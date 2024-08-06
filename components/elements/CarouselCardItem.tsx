import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground, TouchableOpacity } from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const CarouselCardItem = (props: any): React.JSX.Element | null => {
  return (
    <TouchableOpacity onPress={() => props.navigation.navigate("Details", { item: props.item })}>
    <View style={styles.container} key={props.item.id}>
      <ImageBackground
        source={{ uri: props.item.image }}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 20
        }}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(72,57,57,0.6)",
          borderRadius: 20
        }}>
          <Text style={styles.timer}>{props.item.createdDate.substring(0,10)}</Text>
          <View style={styles.content}>
            <Text style={styles.header}>{props.item.title}</Text>
            <Text style={styles.body}>{props.item.createdBy}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    borderRadius: 20,
    paddingHorizontal: 2,
  },
  timer: {
    position: "absolute",
    marginTop: "5%",
    marginLeft: "65%",
    fontSize: 15,
    color: "white"
  },
  content: {
    marginTop: "17%"
  },
  header: {
    color: "#e7dede",
    fontSize: 22,
    fontWeight: "bold",
    paddingLeft: 10
  },
  body: {
    color: "#e7dede",
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 20
  }
});

export default CarouselCardItem;
