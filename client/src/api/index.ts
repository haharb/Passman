import axios from "axios"; //for making http requests
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
export function registerUser(payload:{
    hashedCredentials: string,
    email: string
}){
return axios.post<{salt: string, vault: string}>(userBase, payload, {
    withCredentials: true,
}).then(response => response.data);
}