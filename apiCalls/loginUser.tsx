import axios from "axios";
import { globalUrl } from "./globalUrl";

export const loginUser = async (username: string, password: string) => {
  const url = `https://${globalUrl}/api/auth/login`;
  const requestBody = {
    email: username,
    password: password
  };

  try {
    return await axios.post(url, requestBody);
  } catch (error) {
    console.error("Error during loginUser:", error);
    throw error;
  }
};
