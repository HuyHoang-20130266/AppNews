import axios from "axios";
import { globalUrl } from "./globalUrl";

export const changePass = async (props: any) => {
  console.log(props);
  const url = `https://${globalUrl}/api/auth/change-password`;

  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
    return await axios.post(url, {
      email: props.account.email,
      password: props.account.password,
      newPassword: props.account.newPassword
    }, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
