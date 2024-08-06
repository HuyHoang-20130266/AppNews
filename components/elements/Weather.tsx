import { useState } from "react";
import { Text, View, Image } from "react-native";
import Geolocation from "@react-native-community/geolocation";

const apiKeys = {
  key: "58f39df8347beb805b0116fc8ec1d655",
  base: "https://api.openweathermap.org/data/2.5/"
};
const desc: any = {
  "clear sky": "Quang đãng",
  "few clouds": "Ít mây",
  "scattered clouds": "Mây rải rác",
  "broken clouds": "Nhiều mây đan xen",
  "shower rain": "Mưa rào",
  "rain": "Mưa",
  "thunderstorm": "Mưa dông",
  "snow": "Tuyết",
  "mist": "Sương mù"
};
const Weather = () => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getWeather = async (lat: any, lon: any) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeys.key}&units=metric`
    );
    const data = await api_call.json();
    setState({
      lat: lat,
      lon: lon,
      city: data.name,
      // @ts-ignore
      temperatureC: Math.round(data.main.temp),
      // @ts-ignore
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.main,
      status: data.weather[0],
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      description: data.weather[0].description,
      country: data.sys.country
    });
  };
  if (isLoading) {
    // @ts-ignore

    Geolocation.getCurrentPosition(info => {
      getWeather(info.coords.latitude, info.coords.longitude);
      setIsLoading(false);
    });
  }
  return (
    (state ? <View
      style={{
        marginTop: 10,
        // backgroundColor: "rgba(91,236,216, 0.7)",
        backgroundColor: "rgb(158 194 236)",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <View style={{ alignItems: "center", padding: 10 }}>
        <Text style={{ fontSize: 13, color: "black" }}> {state.city}, {state.country} | {state.temperatureC}°C, cảm giác
          như {state.main.feels_like}°C</Text>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Image source={{ uri: state.icon }} width={50} height={50} />
          <Text style={{ fontSize: 13, color: "black" }}>{desc[state.description]}</Text>
        </View>
      </View>
    </View> : <Text></Text>)
  );
};

export default Weather;
