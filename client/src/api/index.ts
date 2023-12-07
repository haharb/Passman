import axios from "axios"; //for making http requests
//const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const vaultBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
export function registerUser(payload: {
    hashedPassword: string;
    email: string;
  }) {
    try {
        return axios.post<{ salt: string; vault: string }>(
        userBase,
        payload,
        {
          withCredentials: true,
        }
      ).then((res) => res.data);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;  
    }
  }
  export function loginUser(payload: {
    hashedPassword: string;
    email: string;
  }) {
    try {
        return axios.post<{ salt: string; vault: string }>(
        `${userBase}/login`,
        payload,
        {
          withCredentials: true,
        }
      ).then((res) => res.data);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;  
    }
  }
  export async function saveVault(
    {encryptedVault}:{
    encryptedVault: string
  })
  {
    const res = await axios.put(vaultBase, { encryptedVault }, { withCredentials: true });
    return res.data;
  }