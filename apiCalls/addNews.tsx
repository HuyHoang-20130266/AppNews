import axios from "axios";
import { globalUrl } from "./globalUrl";

export const addNews = async (props: any) => {
  const url = `https://${globalUrl}/api/news`;
  const authHeader = { Authorization: `Basic ${Buffer.from(`${props.username}:${props.password}`).toString("base64")}` };
  const body = {
    title: props.title,
    description: props.description,
    image: props.image,
    content: props.content,
    createdBy: props.createdBy,
    idCategories: props.idCategories
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
