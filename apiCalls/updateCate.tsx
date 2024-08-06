import axios from "axios";
import { globalUrl } from "./globalUrl";

export const updateCate = async (props: any) => {
  const url = `https://${globalUrl}/api/cate/${props.cateId}`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  try {
    return await axios.put(url, {
      name: props.cate.name,
      delete: !props.cate.delete
    }, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching cates:", error);
    throw error;
  }
};
