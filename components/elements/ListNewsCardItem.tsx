import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback, Alert, ToastAndroid, ActivityIndicator, Dimensions
} from "react-native";
import Animated from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../ReduxStore/Action";
import React, { useState } from "react";
import { deleteBookMark } from "../../apiCalls/deleteBookMark";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export function ListNewsCardItem(props: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userObj);
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = () => {
    Alert.alert(
      "Tùy chọn",
      "Chọn thao tác:",
      [{
        text: "Huỷ",
        style: "cancel"
      }, {
        text: "Xoá",
        onPress: () => {
          dispatch(removeItem(props.itemNews));
        },
        style: "default"
      }]
    );
  };
  const showAlertSave = () => {
    Alert.alert(
      "Tùy chọn",
      "Chọn thao tác:",
      [{
        text: "Huỷ",
        style: "cancel"
      }, {
        text: "Xoá",
        onPress: async () => {
          setIsLoading(true);
          if (user) {
            try {
              const response = await deleteBookMark({
                userId: user.id,
                newId: props.itemNews.id,
                username: user.email,
                password: user.password
              });
              if (response.status === 200 || response.status === 201) {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Xoá thành công",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                props.handleEvent(!props.event);
              } else {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Có lỗi trong quá trình xoá",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
              }
            } catch (e) {
              setIsLoading(false);
              console.log(e);
              console.log("Error in delete Bookmarks:", e);
            }
          }
        },
        style: "default"
      }]
    );
  };


  return (
    <TouchableNativeFeedback
      onLongPress={() => {
        if (props.screen === "History")
          return showAlert();
        else if (props.screen === "BookMarks")
          return showAlertSave();
      }}
      onPress={() => {
        props.navigation.navigate("Details", { item: props.itemNews });
      }}
      delayLongPress={650}
    >

      {props.itemNews ? <Animated.View style={styles.root}>
        <View style={styles.container}>
          {isLoading &&
            <View style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              height: windowHeight,
              width: windowWidth,
              zIndex: 1000,
              backgroundColor: "rgba(148,148,148,0.3)"
            }}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>}
          <View style={styles.right}>
            <Image source={{ uri: props.itemNews.image }} style={styles.image} />
          </View>

          <View style={styles.left}>
            <View style={{ height: "90%", justifyContent: "center" }}>
              <Text style={styles.title}>
                {props.itemNews.title}
              </Text>
              <Text style={styles.desc}>
                {props.itemNews.description.substring(0, 85) + "..."}
              </Text>
            </View>
            <View style={styles.containerDate}>
              <Text style={styles.date}>
                {props.itemNews.createdDate.substring(0, props.itemNews.createdDate.indexOf("T"))}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View> : ""}
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 10,
    height: 150,
    marginBottom: 5
  },
  left: {
    width: "50%"
  },
  image: {
    width: "90%",
    height: "80%",
    borderRadius: 15
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    flexDirection: "column",
    height: "100%"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "flex-start",
    marginVertical: 7,
    borderRadius: 15,
    backgroundColor: "rgb(255,255,255)",
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 4
  },
  containerDate: {
    position: "absolute",
    right: 10,
    marginTop: 115
  },
  desc: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400"
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "800"
  },
  date: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
    fontSize: 11,
    fontStyle: "italic",
    fontWeight: "bold"
  }
});
