import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { encryptVault } from "../crypto";
import { useMutation } from "react-query";
import { saveVault } from "../api";
import { Dispatch, SetStateAction, useState } from "react";
function Vault({ vault = [], vaultKey = "", setStep}: {
    vault: VaultItem[],
    vaultKey: string,
    setStep: Dispatch<SetStateAction<"login" | "register" | "vault">>,
}) {
    const {control, register, handleSubmit} = useForm({ 
        defaultValues: {
            vault, 
        },
    });
    const {fields, append, remove} = useFieldArray({
        control,
        name: "vault",
    });
    const mutation = useMutation(saveVault);
    return (
        <FormWrapper
        onSubmit={handleSubmit(({ vault }) => {
          console.log({ vault });
          const encryptedVault = encryptVault({
            vault: JSON.stringify({vault}), //Needs the vault property to be stringified, cant't just pass in vault
            vaultKey,
          });

          window.sessionStorage.setItem("vault", JSON.stringify(vault)); //update session storage after saving vault

          mutation.mutate({
            encryptedVault,
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
                            {...register(`vault.${index}.service`, {
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
                            {...register(`vault.${index}.login`, {
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
                            {...register(`vault.${index}.password`, {
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
                Save Vault
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

export default Vault;