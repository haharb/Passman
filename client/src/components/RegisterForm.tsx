import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {useForm} from "react-hook-form";
import { generateLockerKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { LockerItem } from "../pages";
import { useState } from 'react';


export default function RegisterForm({
    setLockerKey,
    setStep,
  }: {
    setLockerKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "locker">>;
  }) {

    // Clear the storage to ensure fresh start 
    window.sessionStorage.clear();
    
    //NOTES: Using useForm from react hook form that help with form submission and validation
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors, isSubmitting },
      } = useForm<{ username: string; password: string; hashedPassword: string }>();


    const [replyCode, setReplyCode] = useState<number | null>(null);


    //NOTES: useMutation from React Query which is used for creating updating or deleting data (POST, PUT, DELETE)
    const mutation = useMutation(registerUser, {
        onSuccess: ({salt, locker}) =>{
            const username = getValues("username");
            const password = getValues("password");

            const lockerKey = generateLockerKey({
                password,
                username,
                salt,
            });
        
            window.sessionStorage.setItem("lockerkey", lockerKey);
            setLockerKey(lockerKey);

            window.sessionStorage.setItem("locker", locker);
            setStep('locker');
        },
        onError: (error: any) => {
            console.error("Registration failed:", error);
        
            // Check if the error contains the replyCode information
            const replyCode = error?.response?.data?.code; // Adjust the property path based on API response structure
        
            if (replyCode) {
              setReplyCode(replyCode);
            } else {
              // Handle the case where replyCode is not available in the error
              console.error("Unable to extract replyCode from the error.");
            }
          },
    });


    return (
    <FormWrapper onSubmit={handleSubmit(() => {
      
        const username = getValues('username');
        const password = getValues('password');
        
        mutation.mutate({
            username,
            password,
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
            {getValues('username') && getValues('username').length < 4 && (
          <div
            style={{
              marginLeft: '8px',
              color: 'red',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            Username must be at least 4 characters long.
          </div>
        )}
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
            {getValues('password') && getValues('password').length < 6 && (
          <div
            style={{
              marginLeft: '8px',
              color: 'red',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            Password must be at least 6 characters long.
          </div>
        )}
            <FormErrorMessage>
                {errors.password && errors.password.message}
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
        {replyCode ==11000 && (
        <div
        style={{
            marginLeft: '8px',
            color: 'red',
            padding: '10px',
            cursor: 'pointer',
        }}>
            User already exists. Register with a different username or login instead.
        </div>
        )}
        

    </FormWrapper>
    
);
}
