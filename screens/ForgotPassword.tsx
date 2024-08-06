import React, { useState } from "react";
import { emailValidator } from "../helpers/emailValidator";
import Background from "../components/elements/Background";
import TextInput from "../components/elements/TextInput";
import Button from "../components/elements/Button";
import { Image, View, ToastAndroid, ActivityIndicator, Dimensions, TouchableHighlight } from "react-native";
import { ImagesAssets } from "../assets/img/ImagesAssets";
import { theme } from "../components/elements/theme";
import { Text } from "react-native-paper";
import { sendForgotCode } from "../apiCalls/sendForgotCode";
import { passwordValidator } from "../helpers/passwordValidator";
import { comfirmChangeForgotPass } from "../apiCalls/comfirmChangeForgotPass";
import { validateCodeValidator } from "../helpers/validateCodeValidator";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ForgotPassword({ navigation }: any) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [passwordNew, setPasswordNew] = useState({ value: "", error: "" });
  const [rePasswordNew, setRePasswordNew] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [validateCode, setValidateCode] = useState({ value: "", error: "" });
  const [nextStepCode, setNextStepCode] = useState(false);

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    try {
      setIsLoading(true);
      const response = await sendForgotCode({ email: email.value });
      if (response.data.statusCodeValue === 404) {
        setIsLoading(false);
        setEmail({ ...email, error: "Không tìm thấy email" });
      } else {
        setIsLoading(false);
        setNextStepCode(true);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setIsLoading(false);
    }
  };
  const comfirmPassword = async () => {
    const passwordNewError = passwordValidator(passwordNew.value);
    const rePasswordNewError = passwordValidator(rePasswordNew.value);
    const validateCodeError = validateCodeValidator(validateCode.value);
    if (passwordNewError || rePasswordNewError || validateCodeError) {
      setPasswordNew({ ...passwordNew, error: passwordNewError });
      setRePasswordNew({ ...rePasswordNew, error: rePasswordNewError });
      setValidateCode({ ...validateCode, error: validateCodeError });
      return;
    } else if (passwordNew.value !== rePasswordNew.value) {
      setPasswordNew({ ...passwordNew, error: "2 mật khẩu phải giống nhau" });
      setRePasswordNew({ ...rePasswordNew, error: "2 mật khẩu phải giống nhau" });
      return;
    }
    try {
      setIsLoading(true);
      const response = await comfirmChangeForgotPass({
        email: email.value,
        password: passwordNew.value,
        otp: validateCode.value
      });
      if (response.data.statusCodeValue === 200) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Đổi mật khẩu thành công",
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
        label="Email của bạn"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Bạn sẽ nhận được mã code 6 số để xác minh"
      />}
      {!nextStepCode &&
        <View style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
      }}>
        <TouchableHighlight onPress={sendResetPasswordEmail} underlayColor="#400B96FF"
        style={{
        backgroundColor: "green",
        width: 300,
        height: 45,
        justifyContent: "center",
          borderRadius: 17,
          marginTop: 16
      }}>
        <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>{"Xác nhận".toUpperCase()}</Text>
        </TouchableHighlight>
        </View>}
      {nextStepCode && <TextInput
        label="Mật khẩu mới"
        returnKeyType="done"
        value={passwordNew.value}
        onChangeText={(text: any) => setPasswordNew({ value: text, error: "" })}
        error={!!passwordNew.error}
        errorText={passwordNew.error}
        secureTextEntry
      />}
      {nextStepCode && <TextInput
        label="Nhập lại mật khẩu mới"
        returnKeyType="done"
        value={rePasswordNew.value}
        onChangeText={(text: any) => setRePasswordNew({ value: text, error: "" })}
        error={!!rePasswordNew.error}
        errorText={rePasswordNew.error}
        secureTextEntry
      />}
      {nextStepCode && <TextInput
        label="Nhập mã xác nhận"
        returnKeyType="next"
        value={validateCode.value}
        onChangeText={(text: any) => setValidateCode({ value: text, error: "" })}
        error={!!validateCode.error}
        errorText={validateCode.error}
        autoCapitalize="none"
      />}
      {nextStepCode &&
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16
        }}>
          <TouchableHighlight onPress={comfirmPassword} underlayColor="#400B96FF"
                              style={{
                                backgroundColor: "green",
                                width: 300,
                                height: 45,
                                justifyContent: "center",
                                borderRadius: 17,
                                marginTop: 16
                              }}>
            <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>{"Xác nhận".toUpperCase()}</Text>
          </TouchableHighlight>
        </View>}
    </Background>
  );
}
