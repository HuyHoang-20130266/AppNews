import axios from "axios";
import { globalUrl } from "./globalUrl";

export const signUp = async (name: string, email: string, password: string) => {
  const url = `https://${globalUrl}/api/auth/register`;
  const requestBody = {
    fullName: name,
    password: password,
    email: email
  };

  try {
    return await axios.post(url, requestBody);
  } catch (error) {
    console.error("Error during signUp:", error);
    throw error;
  }
};
