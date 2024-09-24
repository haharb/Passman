import axios from "axios";

const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const lockerBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/locker`;

export async function registerUser(payload: {
  username: string;
  hashedPassword: string;
}) {
  try {
    const res = await axios.post<{ salt: string; locker: string; }>(
      userBase,
      payload,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function loginUser(payload: {
  hashedPassword: string;
  username: string;
}) {
  try {
    const res = await axios.post<{ salt: string; locker: string; }>(
      `${userBase}/login`,
      payload,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function saveLocker({encryptedLocker}: {encryptedLocker: string}) {
  try {
    const res = await axios.put(lockerBase, { encryptedLocker }, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error saving locker:", error);
    throw error;
  }
}
