import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Platform, ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../ReduxStore/Action";
import RNFS from "react-native-fs";
import { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import QRCode from "react-native-qrcode-svg";

const Settings: React.FC = ({ navigation }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const user = useSelector((state: any) => state.userObj);
  const dispatch = useDispatch();
  let qrCodeRef = React.createRef<QRCode>();

  useEffect(() => {
    setCurrentUser(user);
  }, [user, navigation]);

  const saveQRImage = async () => {
    try {
      if (Platform.OS === "android") {
        const uri = await captureRef(qrCodeRef, {
          format: "png",
          quality: 0.8
        });
        const path = RNFS.CachesDirectoryPath + "/QR.png";
        await RNFS.copyFile(uri, path);
        await CameraRoll.save(path, { type: "photo" });
        ToastAndroid.showWithGravity(
          "Đã lưu hình ảnh QR vào thiết bị",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );

      } else {
        const uri = await captureRef(qrCodeRef, {
          format: "png",
          quality: 0.8
        });
        await CameraRoll.save(uri, { type: "photo" });
        ToastAndroid.showWithGravity(
          "Đã lưu hình ảnh QR vào thiết bị",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      console.error("Lỗi khi lưu hình ảnh QR: ", error);
    }
  };

  const logOut = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }]
    });
  };

  return (
    <View style={styles.container}>
      <View style={{
        marginBottom: 16
      }}>{currentUser === null ?
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableHighlight onPress={() => navigation.navigate("Login")} underlayColor="#400B96FF"
                              style={{
                                backgroundColor: "green",
                                width: 160,
                                height: 40,
                                justifyContent: "center",
                                borderRadius: 8
                              }}>
            <Text style={{ textAlign: "center", color: "white", fontSize: 17 }}>{"Đăng nhập".toUpperCase()}</Text>
          </TouchableHighlight>
          <Text style={{ fontSize: 15, color: "black" }}>Hoặc</Text>
          <TouchableHighlight onPress={() => {
            navigation.navigate("QRScanLogin");
          }} underlayColor="#400B96FF"
                              style={{
                                backgroundColor: "green",
                                width: 160,
                                height: 40,
                                justifyContent: "center",
                                borderRadius: 8
                              }}>
            <Text style={{ textAlign: "center", color: "white", fontSize: 17 }}>{"Quét QR".toUpperCase()}</Text>
          </TouchableHighlight>
        </View> :
        <View>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1
          }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 20 }}>
              <Icon name={"user-circle-o"} style={{ fontSize: 30, marginRight: 5 }} />
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                {currentUser.fullName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("UserProfile")}
              style={{ marginBottom: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "center", padding: 5 }}>
                <Icon name={"id-card"} size={25} color="blue" style={{ marginRight: 5 }} />
                <Text style={{ fontSize: 15, color: "blue" }}>Chỉnh sửa</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
            <View style={{
              marginTop: 15,
              backgroundColor: "red",
              width: "45%",
              height: 40,
              justifyContent: "center",
              borderRadius: 8
            }}>
              <TouchableHighlight
                onPress={() => logOut()}
                underlayColor="#400B96FF"
              >
                <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}>
                  {"Đăng xuất".toUpperCase()}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{
              marginTop: 15,
              backgroundColor: "black",
              width: "45%",
              height: 40,
              justifyContent: "center",
              borderRadius: 8
            }}>
              <TouchableHighlight
                onPress={saveQRImage}
                underlayColor="#400B96FF"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name={"qrcode"} size={25} color="white" style={{ marginLeft: 5, marginRight: 5 }} />
                  <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}>
                    {"Lưu QR Đăng nhập".toUpperCase()}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{
            position: "absolute",
            zIndex: -1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 15,
            opacity: 0
          }}>
            <QRCode
              value={`${currentUser.email}\n${currentUser.password}`}
              size={1000}
              getRef={(c) => {
                qrCodeRef = c;
              }}
              backgroundColor="white"
              color="black"
            />
          </View>
        </View>}
      </View>
      {currentUser === null ? "" : <TouchableOpacity onPress={() => navigation.navigate("BookMarks")}>
        <View style={styles.settingOption}>
          <Icon color="blue"
                name={"save"}
                style={{ fontSize: 30, marginRight: 10 }} />
          <Text style={{ color: "black", fontSize: 15 }}>Bài viết đã lưu</Text>
        </View>
      </TouchableOpacity>}
      <TouchableOpacity onPress={() => navigation.navigate("History")}>
        <View style={styles.settingOption}>
          <Icon color="green"
                name={"history"}
                style={{ fontSize: 30, marginRight: 10 }} />
          <Text style={{ color: "black", fontSize: 15 }}>Đã đọc gần đây</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16
  }
});

export default Settings;
