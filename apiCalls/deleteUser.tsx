import axios from "axios";
import { globalUrl } from "./globalUrl";

export const deleteUser = async (props: any) => {
  const url = `https://${globalUrl}/api/users/${props.accountId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
    return await axios.delete(url, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
