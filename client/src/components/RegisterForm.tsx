import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {useForm} from "react-hook-form";
import { generateVaultKey, hashCredentials } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { VaultItem } from "../pages";

function RegisterForm({
    setVaultKey, 
    setStep}: {
    setVaultKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<'login' | 'register' | 'vault'>>;
}){
    const {
        handleSubmit,
        register, 
        getValues, 
        setValue, 
        formState: {errors, isSubmitting},
    } = useForm<{email: string, password: string, hashedCredentials: string}>();

    const mutation = useMutation(registerUser, {
        onSuccess: ({salt, vault}) =>{
            const hashedCredentials = getValues("hashedCredentials")
            const vaultKey = generateVaultKey({
                hashedCredentials,
                salt,
            });
        
            window.sessionStorage.setItem("vk", vaultKey);
            setVaultKey(vaultKey);
            window.sessionStorage.setItem('vault', "");
            setStep('vault')
        },

    })
    return (
    <FormWrapper onSubmit={handleSubmit(() => {
        const email = getValues('email');
        const password = getValues('password');
        const hashedCredentials = hashCredentials(email,password);
        setValue("hashedCredentials", hashedCredentials);
        mutation.mutate({
            email,
            hashedCredentials
        });
    })}>
        <Heading>Register</Heading>
        <FormControl mt="4">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input 
            id="email"
            placeholder = "Email"
            {...register("email", {
                required: "Email is required",
                minLength: {
                    value: 4,
                    message: 'Email must be at least 4 characters long.'},
            })}
            />
            <FormErrorMessage>
                {errors.email && errors.email.message}
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
                        message: 'Password must be at least 6 characters long.'},
            })}
            />
            <FormErrorMessage>
                {errors.email && errors.email.message}
            </FormErrorMessage>
        </FormControl>
       <Button type = "submit">
            Register
       </Button>
    </FormWrapper>
);
}


export default RegisterForm;