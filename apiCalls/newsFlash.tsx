import axios from "axios";
import { globalUrl } from "./globalUrl";

export const newsFlash = async () => {
  const url = `https://${globalUrl}/api/news/flash`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching cate dashboard:", error);
    throw error;
  }
};
