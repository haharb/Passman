import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { generateLockerKey, decryptLocker, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { Dispatch, SetStateAction, useEffect } from "react";

interface RegisterFormValues {
  username: string;
  password: string;
  hashedPassword: string;


}

interface RegisterFormProps {
  setLockerKey: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<"login" | "register" | "locker">>;
}

export default function RegisterForm({
  setLockerKey,
  setStep,
}: RegisterFormProps) {

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const mutation = useMutation(registerUser, {
    onSuccess: ({ salt, locker }) => {
      const username = getValues("username");
      const hashedPassword = getValues("hashedPassword");

      //Locker key is generated using the username and password concatenated and a salt
      const lockerKey = generateLockerKey({
        username,
        hashedPassword,
        salt,
      });

      // Store locker and lockerKey securely in sessionStorage
      window.sessionStorage.setItem("lockerKey", lockerKey);
      setLockerKey(lockerKey);
      window.sessionStorage.setItem("locker", "");

      setStep("locker");
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async () => {
    const username = getValues("username");
    const password = getValues("password");
    const hashedPassword = hashPassword(password);
    setValue("hashedPassword", hashedPassword);

    try {
      await mutation.mutateAsync({ username, hashedPassword });
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Heading>Register</Heading>
      <FormControl mt="4" isInvalid={!!errors.username}>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 4, message: "Username must be at least 4 characters long." },
          })}
        />
        <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mt="4" isInvalid={!!errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "A password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters long." },
          })}
        />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" mt="4" colorScheme="teal" isLoading={mutation.isLoading || isSubmitting}>
        Register
      </Button>
      <div
        onClick={() => setStep("login")}
        style={{ marginLeft: "8px", color: "gray", padding: "10px", cursor: "pointer" }}
      >
        Already a user? Click here to login instead.
      </div>
      {mutation.isError && (
        <div
          style={{ marginLeft: "8px", color: "red", padding: "10px", cursor: "pointer" }}
        >
          {mutation.error?.response?.data?.code === 11000
            ? "User already exists. Register with a different username or login instead."
            : "Registration failed. Please try again."}
        </div>
      )}
    </FormWrapper>
  );
}
