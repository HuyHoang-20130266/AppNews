import axios from "axios";
import { globalUrl } from "./globalUrl";

export const allNews = async () => {
  const url = `https://${globalUrl}/api/news/all`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news dashboard:", error);
    throw error;
  }
};
