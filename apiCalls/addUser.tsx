import axios from "axios";
import { globalUrl } from "./globalUrl";

export const addUser = async (props: any) => {
  const url = `https://${globalUrl}/api/users`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  const body = {
    fullName: props.account.fullName,
    email: props.account.email,
    password: props.account.password,
    status: props.account.status,
    admin: props.account.isAdmin
  };
  try {
    const response = await axios.post(url, body, {
      headers: authHeader
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
