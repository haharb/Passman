import { useFieldArray, useForm } from "react-hook-form";
import { ManagerItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { encryptManager } from "../crypto";
import { useMutation } from "react-query";
import { saveManager } from "../api";
import { Dispatch, SetStateAction, useState } from "react";
function Manager({ manager = [], managerKey = "", setStep}: {
    manager: ManagerItem[],
    managerKey: string,
    setStep: Dispatch<SetStateAction<"login" | "register" | "manager">>,
}) {
    const {control, register, handleSubmit} = useForm({ 
        defaultValues: {
            manager, 
        },
    });
    const {fields, append, remove} = useFieldArray({
        control,
        name: "manager",
    });
    const mutation = useMutation(saveManager);
    return (
        <FormWrapper
        onSubmit={handleSubmit(({ manager }) => {
          console.log({ manager });
          const encryptedManager = encryptManager({
            manager: JSON.stringify({manager}), //Needs the manager property to be stringified, cant't just pass in manager
            managerKey,
          });

          window.sessionStorage.setItem("manager", JSON.stringify(manager)); //update session storage after saving manager

          mutation.mutate({
            encryptedManager,
          });
        })}
        >
            {fields.map((field, index) => {
                return (
                <Box mt = "4"
                mb="4"
                display = "flex"
                key={field.id}
                alignItems="flex-end">
                    <FormControl>
                        <FormLabel htmlFor="service">
                            Service
                        </FormLabel>
                        <Input
                            type="url"
                            id="service"
                            placeholder="Service Site"
                            {...register(`manager.${index}.service`, {
                                required: "The site for the service is required.",
                            })}
                                />
                    </FormControl>
                    <FormControl ml="3">
                        <FormLabel htmlFor="login">
                            Login
                        </FormLabel>
                        <Input
                            id="login"
                            placeholder="Login Credential"
                            {...register(`manager.${index}.login`, {
                                required: "The login credential is required.",
                            })}
                                />
                    </FormControl>
                    <FormControl ml = "3">
                        <FormLabel htmlFor = "password">
                            Password
                        </FormLabel>
                        <Input
                            type="passwords"
                            id="password"
                            placeholder="Password"
                            {...register(`manager.${index}.password`, {
                                required: "The Password is required.",
                            })}
                                />
                    </FormControl>

                    <Button type="button" 
                    bg="red.500" 
                    color="white"
                    fontSize="2xl"
                    ml="3" 
                    onClick = {() => remove(index)}>
                    -
                    </Button>
                </Box>
            );
        })}

        <Button onClick={() => append({service: "", login: "", password: ""})}
            >
            Add 
        </Button>


        <Button
        ml = "8"
        color = "white"
        background = "green"
        type = "submit">
                Save Manager
        </Button>
        <Button
      onClick={ () =>{
        setStep('login');
      }
      }
      ml="8"
      color="white"
      background="gray"
      type="submit"
    >
      Log Out
    </Button>
    </FormWrapper>
    );


}

export default Manager;