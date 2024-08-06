import axios from "axios";
import { globalUrl } from "./globalUrl";

export const addBookmark = async (props:any) => {
  const url = `https://${globalUrl}/api/users/bookmark/${props.userId}/${props.newId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
   return await axios.put(url,{}, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
