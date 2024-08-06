import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback, Alert, ToastAndroid
} from "react-native";
import Animated from "react-native-reanimated";
import { ImagesAssets } from "../../assets/img/ImagesAssets";
import React from "react";
import { color } from "react-native-elements/dist/helpers";
import { lockUser } from "../../apiCalls/lockUser";

export function UserCardItem(props: any) {
  const showAlert = () => {
    Alert.alert(
      "Tuỳ chọn",
      "Chọn thao tác",
      [{
        text: "Huỷ",
        style: "cancel"
      }, {
        text: props.user.status ? "Khóa tài khoản" : "Mở tài khoản",
        onPress: async () => {
          await lockUser({
            id: props.user.id,
            username: props.admin.email,
            password: props.admin.password
          }).then(r => {
            if (r.status === 200) {
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
      }, {
        text: "Sửa",
        onPress: () => {
        },
        style: "default"
      }]
    );
  };


  return (
    <TouchableNativeFeedback
      onPress={() => props.navigation.navigate("UserModify", { user: props.user })}
      onLongPress={() => {
        if (props.screen === "UserDashBoard" || props.screen === "History")
          return showAlert();
      }}
      delayLongPress={650}
    >

      {props.user ? <Animated.View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.right}>
            <Image source={props.user.admin ? ImagesAssets.userAdmin : ImagesAssets.user} style={{ width: 70, height: 70 }} />
          </View>

          <View style={styles.left}>
            <View style={{ height: "90%", justifyContent: "center" }}>
              <Text style={styles.title}>
                Username: <Text style={[{fontWeight: "bold"}]}> {props.user.email} </Text>
              </Text>
              <Text style={styles.desc}>
                Họ tên: <Text style={[styles.content]}> {props.user.fullName} </Text>
              </Text>
              <Text style={[styles.desc, ]}>
                Trạng thái: <Text style={[styles.content,{ color: props.user.status ? "green" : "red" }]}> {props.user.status ? "Đang Hoạt Động" : "Đã khóa"} </Text>
              </Text>
              <Text style={styles.desc}>
                Vai trò: <Text style={[styles.content,{ color: props.user.admin ? "red" : "blue" }]}> {props.user.admin ? "Admin" : "Người dùng"} </Text>
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
    height: 100,
    marginBottom: 5
  },
  left: {
    width: "70%"
  },
  image: {
    borderRadius: 15
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
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
  desc: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "bold"
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "800"
  },
  content: {
    fontWeight: "normal",
  },
  date: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
    fontSize: 11,
    fontStyle: "italic",
    fontWeight: "bold"
  }
});
