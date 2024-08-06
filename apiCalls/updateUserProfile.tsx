import axios from "axios";
import { globalUrl } from "./globalUrl";

export const updateUserProfile = async (props: any) => {
  const url = `https://${globalUrl}/api/users/profile/${props.accountId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
    return await axios.put(url, {
      fullName: props.account.fullName,
      email: props.account.email
    }, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
