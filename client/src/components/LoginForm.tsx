import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {useForm} from "react-hook-form";
import { decryptLocker, generateLockerKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { loginUser, registerUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { LockerItem } from "../pages";
import { useState } from 'react';

export default function LoginForm({
    setLocker,
    setLockerKey,
    setStep,
  }: {
    setLocker: Dispatch<SetStateAction<LockerItem[]>>; 
    setLockerKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "locker">>;
  }) {
    const [replyCode, setReplyCode] = useState<number | null>(1);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors, isSubmitting },
      } = useForm<{ username: string; password: string; hashedPassword: string }>();
    

    const mutation = useMutation(loginUser, {
        //Notes: Calls loginUser and allows for the handling of results
        onSuccess: async ({salt, locker}) =>{
            
            const username = getValues("username");

            const password = getValues("password");

            const lockerKey = generateLockerKey({
                password,
                username,
                salt,
            });
        
            
            const decryptedLocker = decryptLocker({locker, lockerKey});
            setLockerKey(lockerKey);
            setLocker(decryptedLocker);

            window.sessionStorage.setItem("locker", JSON.stringify(decryptedLocker));

            setStep('locker'); 
        },
        onError: (error) => {
            console.error("Login failed:", error);
            setReplyCode(null); // If null then there was an error logging in
            },
    });

    return (
    <FormWrapper onSubmit={handleSubmit(() => {

        const username = getValues('username');
        const password = getValues('password');
        
        //Mutate and call the loginUser method
        mutation.mutateAsync({
            username,
            password,
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