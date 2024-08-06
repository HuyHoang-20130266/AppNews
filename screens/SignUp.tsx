import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, Dimensions, TouchableHighlight } from "react-native";
import { Text } from "react-native-paper";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import Background from "../components/elements/Background";
import TextInput from "../components/elements/TextInput";
import Button from "../components/elements/Button";
import { ImagesAssets } from "../assets/img/ImagesAssets";
import { signUp } from "../apiCalls/signUp";
import { validateCodeValidator } from "../helpers/validateCodeValidator";
import { sendOtp } from "../apiCalls/sendOtp";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignUp({ navigation }: any) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [validateCode, setValidateCode] = useState({ value: "", error: "" });
  const [nextStepCode, setNextStepCode] = useState(false);

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    try {
      setIsLoading(true);
      const response = await signUp(name.value, email.value, password.value);

      switch (response.data.body) {
        case "Email already exists": {
          setEmail({ ...email, error: "Email đã tồn tại" });
          break;
        }
        case "OTP sent to email": {
          setNextStepCode(true);
          break;
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setIsLoading(false);
    }
  };
  const onSendCode = async () => {
    const validateCodeError = validateCodeValidator(validateCode.value);
    if (validateCodeError) {
      setValidateCode({ ...validateCode, error: validateCodeError });
      return;
    }
    try {
      setIsLoading(true);
      const response = await sendOtp({
        fullName: name.value,
        email: email.value,
        password: password.value,
        otp: validateCode.value
      });
      if (response.data.statusCodeValue === 200) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Đăng ký thành công",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        navigation.replace("Login");
      } else {
        switch (response.data.body) {
          case "Invalid OTP.": {
            setValidateCode({ ...validateCode, error: "Sai mã xác nhận" });
            break;
          }
          case "OTP has expired.": {
            setValidateCode({ ...validateCode, error: "Mã xác nhận đã hết hạn" });
            break;
          }
          default : {
            setValidateCode({ ...validateCode, error: "Đã có lỗi trong quá trình kiểm tra" });
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
      {!nextStepCode && <TextInput
        label="Tên của bạn"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text: any) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />}
      {!nextStepCode && <TextInput
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
      />}
      {!nextStepCode && <TextInput
        label="Mật khẩu"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />}
      {!nextStepCode &&
      //   <Button
      //   mode="contained"
      //   onPress={onSignUpPressed}
      //   style={{ marginTop: 24 }}
      // >
      //   Đăng ký
      // </Button>}
      <View style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
      }}>
        <TouchableHighlight onPress={onSignUpPressed} underlayColor="#400B96FF"
                            style={{
                              backgroundColor: "green",
                              width: 300,
                              height: 45,
                              justifyContent: "center",
                              borderRadius: 17,
                              marginTop: 24
                            }}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>{"Đăng ký".toUpperCase()}</Text>
        </TouchableHighlight>
      </View>}
      {nextStepCode && <TextInput
        label="Nhập mã xác nhận"
        returnKeyType="next"
        value={validateCode.value}
        onChangeText={(text: any) => setValidateCode({ value: text, error: "" })}
        error={!!validateCode.error}
        errorText={validateCode.error}
        autoCapitalize="none"
      />}
      {nextStepCode && <Button
        mode="contained"
        onPress={onSendCode}
        style={{ marginTop: 24 }}
      >
        Xác nhận
      </Button>}
      <View style={styles.row}>
        <Text>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4
  },
  link: {
    fontWeight: "bold",
    color: "green"
  }
});
