import axios from "axios";
import { globalUrl } from "./globalUrl";

export const addCate = async (props: any) => {
  const url = `https://${globalUrl}/api/cate`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  const body = {
    name: props.cate.name,
    isDelete: !props.cate.isDelete,
    createdDate: props.cate.createdDate,
    createdBy: props.cate.createdBy
  };
  try {
    return await axios.post(url, body, {
      headers: authHeader
    });
  } catch (error) {
    console.error("Error fetching cates:", error);
    throw error;
  }
};
