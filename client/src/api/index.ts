import axios from "axios"; //for making http requests
//const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const lockerBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/locker`;

export async function registerUser(payload: {
  username: string;
  password: string;
}): Promise<{ salt: string; locker: string }> {
  try {
      const response = await axios.post<{ salt: string; locker: string }>(
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

export async function loginUser(payload: {
  username: string;
  password: string;
}): Promise<{ salt: string; locker: string }> {
  try {
      const response = await axios.post<{ salt: string; locker: string }>(
          `${userBase}/login`,
          payload,
          {
              withCredentials: true,
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error logging in:', error);
      throw error;  
  }
}


  export async function saveLocker(
    {encryptedLocker}:{
    encryptedLocker: string
  })
  {

    const res = await axios.put(lockerBase, { encryptedLocker }, { withCredentials: true });
    return res.data;
  }