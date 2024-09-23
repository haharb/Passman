import axios from "axios"; //for making http requests
//const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const lockerBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/locker`;

export async function registerUser(payload: {
  password: string;
  username: string;
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
  password: string;
  username: string;
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


  //NOTES:{ encryptedLocker }: 
  //This is destructuring.
  //Instead of receiving an entire object and then accessing its encryptedLocker property inside the function,
  // you're directly extracting encryptedLocker from the passed object.
  export async function saveLocker(
    {encryptedLocker}:{
    encryptedLocker: string
  })
  {
    //NOTES: { encryptedLocker } is short hand for an object that 
    //has the same name as the property { encryptedLocker }
    //{ withCredentials: true } is a config object for axios that indicates to use cookies
    const res = await axios.put(lockerBase, { encryptedLocker }, { withCredentials: true });
    return res.data;
  }