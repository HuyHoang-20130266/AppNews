import axios from "axios";
import { globalUrl } from "./globalUrl";

export const deleteCate = async (props: any) => {
  const url = `https://${globalUrl}/api/cate/${props.CateId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };

  try {
    return await axios.delete(url, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
