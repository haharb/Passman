import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {useForm} from "react-hook-form";
import { generateManagerKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { ManagerItem } from "../pages";
import { useState } from 'react';
function RegisterForm({
    setManagerKey,
    setStep,
  }: {
    setManagerKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "manager">>;
  }) {
    window.sessionStorage.clear();
    const [replyCode, setReplyCode] = useState<number | null>(null);
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
      } = useForm<{ username: string; password: string; hashedPassword: string }>();
    

    const mutation = useMutation(registerUser, {
        onSuccess: ({salt, manager}) =>{
            const hashedPassword = getValues("hashedPassword");
            const username = getValues("username");
            const managerKey = generateManagerKey({
                hashedPassword,
                username,
                salt,
            });
        
            window.sessionStorage.setItem("vk", managerKey);
            setManagerKey(managerKey);
            window.sessionStorage.setItem("manager", "");
            setStep('manager');
            setReplyCode(replyCode);
        },

    });
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
        <Heading>Register</Heading>
        <FormControl mt="4">
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input 
            id="username"
            placeholder = "Username"
            {...register("username", {
                required: "Username is required",
                minLength: {
                    value: 4,
                    message: 'Username must be at least 4 characters long.'},
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
                    minLength: {
                        value: 6, 
                        message: "Password must be at least 6 characters long."},
            })}
            />
            <FormErrorMessage>
                {errors.username && errors.username.message}
            </FormErrorMessage>
        </FormControl>
       <Button type = "submit">
            Register
       </Button>
       <div
            onClick={() => {
                setStep('login');
            }}
            style={{
                marginLeft: '8px',
                color: 'gray',
                padding: '10px',
                cursor: 'pointer',
            }}
        >
            Already a user? Click here to login instead.
        </div>
        {replyCode ===1100 && (
        <div
        style={{
            marginLeft: '8px',
            color: 'red',
            padding: '10px',
            cursor: 'pointer',
        }}>
            User already exists. Register with a different username or login.
        </div>
        )}
    </FormWrapper>
);
}


export default RegisterForm;