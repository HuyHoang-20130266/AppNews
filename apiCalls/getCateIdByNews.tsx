import axios from "axios";
import { globalUrl } from "./globalUrl";

export const getCateIdByNews = async (props:any) => {
  const url = `https://${globalUrl}/api/cate/news/${props.id}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news dashboard:", error);
    throw error;
  }
};
