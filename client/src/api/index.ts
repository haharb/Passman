import axios from "axios"; //for making http requests
//const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const managerBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/manager`;

export function registerUser(payload: {
    hashedPassword: string;
    email: string;
  }) {
    try {
        return axios.post<{ salt: string; manager: string }>(
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
        return axios.post<{ salt: string; manager: string }>(
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
  export async function saveManager(
    {encryptedManager}:{
    encryptedManager: string
  })
  {
    const res = await axios.put(managerBase, { encryptedManager }, { withCredentials: true });
    return res.data;
  }