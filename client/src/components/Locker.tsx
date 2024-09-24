import { useFieldArray, useForm } from "react-hook-form";
import { LockerItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { encryptLocker } from "../crypto";
import { useMutation } from "react-query";
import { saveLocker } from "../api";
import { Dispatch, SetStateAction, useState } from "react";


export default function Locker({ locker = [], lockerKey = "", setStep}: {
    locker: LockerItem[],
    lockerKey: string,
    setStep: Dispatch<SetStateAction<"login" | "register" | "locker">>,
}) {
    const [isSaved, setIsSaved] = useState(false); // State for managing the saved message

    const { control, register, handleSubmit, reset } = useForm({
        defaultValues: {
          locker: locker && locker.length > 0 ? locker : [{ service: "", login: "", password: "" }],
        },
      });
      
    const {fields, append, remove} = useFieldArray({
        control,
        name: "locker",
    });
    
    const mutation = useMutation(saveLocker);

    return (
        <FormWrapper
        onSubmit={handleSubmit(({ locker }) => {

          console.log({ locker });

          const encryptedLocker = encryptLocker({
            locker: JSON.stringify({locker}), //Needs the locker property to be stringified, cant't just pass in locker
            lockerKey,
          });

          window.sessionStorage.setItem("locker", JSON.stringify(locker)); //update session storage after saving locker

          mutation.mutate({
            encryptedLocker,
          });

          setIsSaved(true); // Set the state to indicate that the data has been saved
          setTimeout(() => setIsSaved(false), 3000); // Hide the message after 3 seconds
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
                            id="service"
                            placeholder="Service"
                            {...register(`locker.${index}.service`, {
                                required: "The service is required.",
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
                            {...register(`locker.${index}.login`, {
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
                            {...register(`locker.${index}.password`, {
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
                Save
        </Button>

        <Button
            onClick={ () =>{
                reset();
                window.sessionStorage.clear();
                setStep('login');
            }
            }
            ml="8"
            color="white"
            background="gray"
            >
                Log Out
    </Button>
    <div
            style={{
                marginLeft: '8px',
                color: isSaved ? 'gray' : "transparent",
                padding: '10px',
                cursor: 'pointer',
            }}>
            Changes saved to the database.
        </div>
    </FormWrapper>
    );


}
