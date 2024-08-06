import axios from "axios";
import { globalUrl } from "./globalUrl";

export const deleteAllBookMarks = async (props:any) => {
  const url = `https://${globalUrl}/api/users/bookmark/${props.userId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
    return  await axios.delete(url, {
      headers: authHeader
    });
    // return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
