import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback, Alert, ToastAndroid, Image
} from "react-native";
import Animated from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { lockUser } from "../../apiCalls/lockUser";
import { hideCategory } from "../../apiCalls/hideCategory";
import { hideNews } from "../../apiCalls/hideNews";

export function NewsCardItem(props: any) {
  const showAlert = () => {
    Alert.alert(
      "Tuỳ chọn",
      "Chọn thao tác",
      [{
        text: "Huỷ",
        style: "cancel"
      },
        {
          text: props.itemNews.delete ? "Hiện bài báo" : "Ẩn bài báo",
          onPress: async () => {
            await hideNews({
              id: props.itemNews.id,
              username: props.admin.email,
              password: props.admin.password
            }).then(r => {
              if (r.status === 200 || r.status === 204) {
                ToastAndroid.showWithGravity(
                  "Cập nhật trạng thái thành công",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                props.handleEvent(!props.event);

              } else {
                ToastAndroid.showWithGravity(
                  "Có lỗi trong qúa trình xử lý",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
              }
            });
          },
          style: "default"
        },
        {
          text: "Sửa",
          onPress: () => {
            props.navigation.navigate("NewsModify", { item: props.itemNews, screen: props.screen });
          },
          style: "default"
        }]
    );
  };


  return (
    <TouchableNativeFeedback
      onPress={() => props.navigation.navigate("NewsModify", { item: props.itemNews, screen: props.screen })}
      onLongPress={() => {
        if (props.screen === "NewsDashBoard" || props.screen === "History")
          return showAlert();
      }}
      delayLongPress={650}
    >

      {props.itemNews ? <Animated.View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.right}>
            <Image source={{ uri: props.itemNews.image }} style={styles.image} />
          </View>

          <View style={styles.left}>
            <View style={{ height: "90%", justifyContent: "center" }}>
              <View style={{ height: "90%", justifyContent: "center" }}>
                <Text style={styles.title}>
                  {props.itemNews.title}
                </Text>
                <Text style={[styles.desc, { color: props.itemNews.delete ? "red" : "green" }]}>
                  Trạng thái: {props.itemNews.delete ? "Đã ẩn" : "Đang Hoạt Động"}
                </Text>
              </View>
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
