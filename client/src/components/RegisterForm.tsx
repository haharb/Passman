import {Button, FormControl, FormErrorMessage, FormLabel, Heading, Input} from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { generateLockerKey, decryptLocker } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { Dispatch, SetStateAction, useEffect } from "react";

interface RegisterFormValues {
  username: string;
  password: string;
}

interface RegisterFormProps {
  setLockerKey: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<"login" | "register" | "locker">>;
}

export default function RegisterForm({
  setLockerKey,
  setStep,
}: RegisterFormProps) {
  // Clear the storage on component mount
  useEffect(() => {
      window.sessionStorage.clear();
  }, []);

  const {
      handleSubmit,
      register,
      getValues,
      formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const mutation = useMutation(registerUser, {
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

          // Need to fix this to prevent xss
          window.sessionStorage.setItem("locker", JSON.stringify(decryptedLocker));

          setStep("locker");
      },
      onError: (error: any) => {
          console.error("Registration failed:", error);
      },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async () => {
      const username = getValues("username");
      const password = getValues("password");

      try {
          await mutation.mutateAsync({ username, password });
      } catch (error) {
        //TODO: add logging
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
                      minLength: {
                          value: 4,
                          message: "Username must be at least 4 characters long.",
                      },
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
                      minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long.",
                      },
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
              Register
          </Button>
          <div
              onClick={() => setStep("login")}
              style={{
                  marginLeft: "8px",
                  color: "gray",
                  padding: "10px",
                  cursor: "pointer",
              }}
          >
              Already a user? Click here to login instead.
          </div>
          {mutation.isError && (
              <div
                  style={{
                      marginLeft: "8px",
                      color: "red",
                      padding: "10px",
                      cursor: "pointer",
                  }}
              >
                  {mutation.error?.response?.data?.code === 11000
                      ? "User already exists. Register with a different username or login instead."
                      : "Registration failed. Please try again."}
              </div>
          )}
      </FormWrapper>
  );
}
