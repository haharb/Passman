import axios from "axios"; //for making http requests
//const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const userBase = 'http://localhost:4000/api/users';
export async function registerUser(payload: {
    hashedCredentials: string;
    email: string;
  }) {
    try {
        const response = await axios.post<{ salt: string; vault: string }>(
        userBase,
        payload,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; 
    }
  }