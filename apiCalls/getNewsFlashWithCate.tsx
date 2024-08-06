import axios from "axios";
import { globalUrl } from "./globalUrl";

export const getNewsFlashWithCate = async (props:any) => {
  const url = `https://${globalUrl}/api/news/flash/${props.id}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news dashboard:", error);
    throw error;
  }
};