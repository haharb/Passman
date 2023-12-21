import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {useForm} from "react-hook-form";
import { decryptManager, generateManagerKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { loginUser, registerUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { ManagerItem } from "../pages";
import { useState } from 'react';
export default LoginForm;
function LoginForm({
    setManager,
    setManagerKey,
    setStep,
  }: {
    setManager: Dispatch<SetStateAction<ManagerItem[]>>; //Type could be retrieved by hovering over where they are passed down in index.tsx
    setManagerKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "manager">>;
  }) {
    const [replyCode, setReplyCode] = useState<number | null>(1);
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
      } = useForm<{ username: string; password: string; hashedPassword: string }>();
    

    const mutation = useMutation(loginUser, {
        onSuccess: ({salt, manager}) =>{
            const hashedPassword = getValues("hashedPassword");
            const username = getValues("username");
            const managerKey = generateManagerKey({
                hashedPassword,
                username,
                salt,
            });
        
            window.sessionStorage.setItem("managerkey", managerKey);
            const decryptedManager = decryptManager({manager, managerKey});
            setManagerKey(managerKey);
            setManager(decryptedManager);
            window.sessionStorage.setItem("manager", JSON.stringify(decryptManager));
            setStep('manager'); 
        },
        onError: (error) => {
            console.error("Login failed:", error);
            setReplyCode(null); // If null then there was an error logging in
            },
    });
    const isUsernameValid = getValues('username');
    const isPasswordValid = getValues('password');
    return (
    <FormWrapper onSubmit={handleSubmit(() => {
        const username = getValues('username');
        const password = getValues('password');
        const hashedPassword = hashPassword(password);
        setValue("hashedPassword", hashedPassword);
        mutation.mutate({
            username,
            hashedPassword,
        });
    })}>
        <Heading>Login</Heading>
        <FormControl mt="4">
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input 
            id="username"
            placeholder = "Username"
            {...register("username", {
                required: "Username is required",
            })}
            />
            <FormErrorMessage>
                {errors.username && errors.username.message}
            </FormErrorMessage>
        </FormControl>
        <FormControl mt="4">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input 
                id="password" 
                placeholder = "Password"
                type="password"
                {...register("password", {
                    required: "A password is required",
            })}
            />
            <FormErrorMessage>
                {errors.password && errors.password.message}
            </FormErrorMessage>
        </FormControl>
       <Button type = "submit">
            Login
       </Button>
       {replyCode === null && (
        <div
        style={{
            marginLeft: '8px',
            color: 'red',
            padding: '10px',
        }}>
            Login failed. Invalid username or password.
        </div>
        )}
       <div
        onClick={() => {
            setStep('register');
        }}
        style={{
            marginLeft: '8px',
            color: 'gray',
            padding: '10px',
            cursor: 'pointer',
        }}
    >
       New user? Click here to register instead.
    </div>
    </FormWrapper>
);
}