import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {useForm} from "react-hook-form";
import { decryptVault, generateVaultKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { loginUser, registerUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { VaultItem } from "../pages";

export default LoginForm;
function LoginForm({
    setVault,
    setVaultKey,
    setStep,
  }: {
    setVault: Dispatch<SetStateAction<VaultItem[]>>; //Type could be retrieved by hovering over where they are passed down in index.tsx
    setVaultKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "vault">>;
  }) {
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
      } = useForm<{ email: string; password: string; hashedPassword: string }>();
    

    const mutation = useMutation(loginUser, {
        onSuccess: ({salt, vault}) =>{
            const hashedPassword = getValues("hashedPassword");
            const email = getValues("email");
            const vaultKey = generateVaultKey({
                hashedPassword,
                email,
                salt,
            });
        
            window.sessionStorage.setItem("vk", vaultKey);
            const decryptedVault = decryptVault({vault, vaultKey});
            setVaultKey(vaultKey);
            setVault(decryptedVault);
            window.sessionStorage.setItem("vault", JSON.stringify(decryptVault));
            setStep('vault');
        },
    });
    return (
    <FormWrapper onSubmit={handleSubmit(() => {
        const email = getValues('email');
        const password = getValues('password');
        const hashedPassword = hashPassword(password);
        setValue("hashedPassword", hashedPassword);
        mutation.mutate({
            email,
            hashedPassword,
        });
    })}>
        <Heading>Login</Heading>
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
                        message: "Password must be at least 6 characters long."},
            })}
            />
            <FormErrorMessage>
                {errors.password && errors.password.message}
            </FormErrorMessage>
        </FormControl>
       <Button type = "submit">
            Login
       </Button>
    </FormWrapper>
);
}