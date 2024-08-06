import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground, TouchableOpacity } from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

// const FirstCarouselCardHome = ({ item, index }: any): React.JSX.Element | null => {
export function FirstCarouselCardHome(props: any) {

  return (
    <TouchableOpacity onPress={() => props.navigation.navigate("Details", { item: props.item })}>

      <View style={styles.container} key={props.id}>
        <ImageBackground
          source={{ uri: props.item.image }}
          style={{
            height: "100%",
            width: "100%"
          }}
        >

          <View style={{
            flex: 1,
            backgroundColor: "rgba(72,57,57,0.6)"
          }}>
            <Text style={styles.timer}>{props.item.createdDate.substring(0, 10)}</Text>
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
    width: SLIDER_WIDTH,
    paddingHorizontal: 2
  },
  timer: {
    position: "absolute",
    marginTop: "5%",
    marginLeft: "65%",
    fontSize: 20,
    color: "#e7dede"
  },
  content: {
    marginTop: "17%"
  },
  header: {
    color: "#e7dede",
    fontSize: 27,
    fontWeight: "bold",
    paddingLeft: SLIDER_WIDTH / 8
  },
  body: {
    color: "#e7dede",
    fontSize: 20,
    paddingLeft: SLIDER_WIDTH / 8,
    paddingRight: SLIDER_WIDTH / 8
  }
});

export default FirstCarouselCardHome;
