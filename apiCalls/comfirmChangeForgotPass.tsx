import axios from "axios";
import { globalUrl } from "./globalUrl";

export const comfirmChangeForgotPass = async (props: any) => {
  console.log(props);
  const url = `https://${globalUrl}/api/auth/reset-password`;

  const requestBody = {
    email: props.email,
    password: props.password,
    otp: props.otp
  };
  try {
    return await axios.post(url, requestBody);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
