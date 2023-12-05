import axios from "axios"; //for making http requests
//const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const userBase = 'http://localhost:4000';
const vaultBase = 'http://localhost:4000';
export async function registerUser(payload: {
    hashedPassword: string;
    email: string;
  }) {
    try {
        const response = await axios.post<{ salt: string; vault: string }>(
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
  export async function loginUser(payload: {
    hashedPassword: string;
    email: string;
  }) {
    try {
        const response = await axios.post<{ salt: string; vault: string }>(
        `${userBase}`,
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