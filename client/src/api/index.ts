import axios from "axios"; //for making http requests
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
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
      throw error; // You may want to handle this error in a specific way or log it.
    }
  }