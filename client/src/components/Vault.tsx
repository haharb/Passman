import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

function Vault({ vault = [], vaultKey = ""}: {
    vault: VaultItem[],
    vaultKey: "",
}) {
    const {control, register, handleSubmit} = useForm();
    const {fields, append, remove} = useFieldArray({
        control,
        name: "vault",
    });
    return (
    <FormWrapper>
        {fields.map((field, index) => {
            return (
            <Box display = "flex" key={field.id}>
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
            </Box>
        );
    })}

    <Button onClick={() => append({service: "", login: "", password: ""})}
        >
        Add 
            </Button>
    </FormWrapper>
    );
}

export default Vault;