import {Button, FormControl, FormErrorMessage,FormLabel, Heading, Input} from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { decryptLocker, generateLockerKey } from "../crypto";
import { useMutation } from "react-query";
import { loginUser } from "../api";
import { Dispatch, SetStateAction } from "react";
import { LockerItem } from "../pages";

interface LoginFormValues {
    username: string;
    password: string;
}

interface LoginFormProps {
    setLocker: Dispatch<SetStateAction<LockerItem[]>>;
    setLockerKey: Dispatch<SetStateAction<string>>;
    setStep: Dispatch<SetStateAction<"login" | "register" | "locker">>;
}

export default function LoginForm({
    setLocker,
    setLockerKey,
    setStep,
}: LoginFormProps) {
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>();

    const mutation = useMutation(loginUser, {
        onSuccess: ({ salt, locker }) => {
            const username = getValues("username");
            const password = getValues("password");

            // Generate locker key using password, username, and salt
            const lockerKey = generateLockerKey({
                username,
                password,
                salt,
            });

            const decryptedLocker = decryptLocker({ locker, lockerKey });
            setLockerKey(lockerKey);
            setLocker(decryptedLocker);

            // TODO: check for risk of XSS
            window.sessionStorage.setItem("locker", decryptedLocker);

            setStep("locker");
        },
        onError: (error: any) => {
            console.error("Login failed:", error);
        },
    });

    const onSubmit: SubmitHandler<LoginFormValues> = async () => {
        const username = getValues("username");
        const password = getValues("password");

        try {
            await mutation.mutateAsync({password, username});
        } catch (error) {
            //TODO: add error logging
        }
    };

    return (
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Heading>Login</Heading>
            <FormControl mt="4" isInvalid={!!errors.username}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                    id="username"
                    placeholder="Username"
                    {...register("username", {
                        required: "Username is required",
                    })}
                />
                <FormErrorMessage>
                    {errors.username && errors.username.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl mt="4" isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    {...register("password", {
                        required: "A password is required",
                    })}
                />
                <FormErrorMessage>
                    {errors.password && errors.password.message}
                </FormErrorMessage>
            </FormControl>
            <Button
                type="submit"
                mt="4"
                colorScheme="teal"
                isLoading={mutation.isLoading || isSubmitting}
            >
                Login
            </Button>
            {mutation.isError && (
                <div
                    style={{
                        marginLeft: "8px",
                        color: "red",
                        padding: "10px",
                    }}>
                    Login failed. Invalid username or password.
                </div>
            )}
            <div
                onClick={() => setStep("register")}
                style={{
                    marginLeft: "8px",
                    color: "gray",
                    padding: "10px",
                    cursor: "pointer",
                }}
            >
                New user? Click here to register instead.
            </div>
        </FormWrapper>
    );
}
