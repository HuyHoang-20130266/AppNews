import axios from "axios";
import { globalUrl } from "./globalUrl";

export const sendOtp = async (props: any) => {
  console.log(props);
  const url = `https://${globalUrl}/api/auth/validate-email`;

  const requestBody = {
    fullName: props.fullName,
    password: props.password,
    email: props.email,
    otp: props.otp
  };
  try {
    return await axios.post(url, requestBody);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
