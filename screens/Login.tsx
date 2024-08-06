import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View, Image, ToastAndroid, ActivityIndicator, Dimensions, TouchableHighlight } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/elements/Background";
import TextInput from "../components/elements/TextInput";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { ImagesAssets } from "../assets/img/ImagesAssets";
import { loginUser } from "../apiCalls/loginUser";
import { useDispatch } from "react-redux";
import { login } from "../ReduxStore/Action";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    try {
      setIsLoading(true);
      const response = await loginUser(email.value, password.value);
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
            setPassword({ ...password, error: "Sai mật khẩu" });
            break;
          }
          case "Email not found": {
            setEmail({ ...email, error: "Không tìm thấy email" });
            break;
          }
          case "Account is locked": {
            setEmail({ ...email, error: "Tài khoản này đã bị khoá" });
            break;
          }
          default: {
            setEmail({ ...email, error: "Đã có lỗi trong quá trình kiểm tra" });
            break;
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setIsLoading(false);
    }
  };

  return (
    <Background>
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
      <Image source={ImagesAssets.logo} style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 10 }} />
      <Text style={{
        fontSize: 21,
        color: "green",
        fontWeight: "bold",
        paddingVertical: 1
      }}>Nông Lâm News</Text>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Mật khẩu"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
      }}>
      <TouchableHighlight onPress={onLoginPressed} underlayColor="#400B96FF"
                          style={{
                            backgroundColor: "green",
                            width: 300,
                            height: 45,
                            justifyContent: "center",
                            borderRadius: 17
                          }}>
        <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>{"Đăng nhập".toUpperCase()}</Text>
      </TouchableHighlight>
      </View>
      <View style={styles.row}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
          <Text style={styles.link}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24
  },
  row: {
    flexDirection: "row",
    marginTop: 4
  },
  forgot: {
    fontSize: 13,
    color: "green"
  },
  link: {
    fontWeight: "bold",
    color: "green"
  }
});
