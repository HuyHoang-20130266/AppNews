/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React from "react";
import {
  View,
  ScrollView, Image, Button
} from "react-native";
import CateHome from "../components/elements/CateHome";
import CarouselParallax from "../components/elements/CarouselParallax";
import Weather from "../components/elements/Weather";

const newsCategories = [
  { id: 1, title: "Thời sự" },
  { id: 5, title: "Kinh tế" },
  { id: 10, title: "Giải trí" }
];

const Home: React.FC = (props: any) => {
  return (
    <View style={{ minHeight: "100%" }}>
      <ScrollView>
        <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 70 }}>
          <CarouselParallax navigation={props.navigation} />
          <Weather />
          {
            newsCategories.map((item) => <CateHome navigation={props.navigation} item={item} key={item.id} />)
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
