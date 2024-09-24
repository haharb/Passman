import { BoxProps, Box } from "@chakra-ui/react";
import React from "react";
function FormWrapper({
    children,
    ...props
}: {children: React.ReactNode} & BoxProps) {
    return ( <Box w= "100%" maxW ="containter.sm" boxShadow = "xl" as = 'form' {...props}>
        {children}
        </Box>
    );
}

export default FormWrapper;