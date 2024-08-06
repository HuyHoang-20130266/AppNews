import axios from "axios";
import { globalUrl } from "./globalUrl";

export const updateAccount = async (props: any) => {
  const url = `https://${globalUrl}/api/users/${props.accountId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
    return await axios.put(url, {
      fullName: props.account.fullName,
      email: props.account.email,
      status: props.account.status,
      admin: props.account.isAdmin
    }, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
