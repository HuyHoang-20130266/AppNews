import React, { useState } from "react";
import {
  StyleSheet,
  ToastAndroid,
  View,
  Button,
  ActivityIndicator, Dimensions
} from "react-native";
import { Text } from "react-native-paper";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { useDispatch } from "react-redux";
import { loginUser } from "../apiCalls/loginUser";
import { login } from "../ReduxStore/Action";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function QRScanLogin({ navigation }: any) {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  const dispatch = useDispatch();

  const onSuccess = async (e: { data: any; }) => {
    try {
      setIsLoading(true);
      const response = await loginUser(e.data.substring(0, e.data.indexOf("\n")), e.data.substring(e.data.indexOf("\n") + 1));
      if (response.data.statusCodeValue === 200) {
        setIsLoading(false);
        dispatch(login(response.data.body));
        ToastAndroid.showWithGravity(
          "Đăng nhập thành công",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }]
        });
      } else {
        switch (response.data.body) {
          case "Password incorrect": {
            setStatus("Sai mật khẩu");
            break;
          }
          case "Email not found": {
            setStatus("Không tìm thấy email");
            break;
          }
          case "Account is locked": {
            setStatus("Tài khoản này đã bị khoá");
            break;
          }
          default: {
            setStatus("Đã có lỗi trong quá trình kiểm tra");
            break;
          }
        }
        setIsLoading(false);
        setShowScanner(false);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setIsLoading(false);
    }
  };
  const handleRetryScan = () => {
    setStatus("");
    setShowScanner(true);
  };
  return (
    <View style={{ flex: 1 }}>
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
      {showScanner ? (
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.auto}
          topContent={<Text style={styles.centerText}>Hãy quét mã QR của bạn để đăng nhập</Text>}
          bottomContent={<Text style={styles.bottomText}>{status}</Text>}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{fontSize: 20, marginBottom: 10}}>{status}</Text>
          <Button title="Quét lại" onPress={handleRetryScan} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  bottomText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
    padding: 16
  }
});
