import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Image,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { ImagesAssets } from "../assets/img/ImagesAssets";
import { nameValidator } from "../helpers/nameValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { equaPassAndRepeatPass } from "../helpers/equalPassAndRepeatPass";
import { updateUserProfile } from "../apiCalls/updateUserProfile";
import { changePass } from "../apiCalls/changePass";
import { loginUser } from "../apiCalls/loginUser";
import { login } from "../ReduxStore/Action";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UserProfile: React.FC = ({ navigation }: any) => {
    const Router = useRoute();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const user = useSelector((state: any) => state.userObj);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [oldPass, setOldPass] = useState<string>("");
    const [newPass, setNewPass] = useState<string>("");
    const [repeatPass, setRepeatPass] = useState<string>("");
    const [isChangePass, SetIsChangePass] = useState(false);

    const [oldShowPassword, setOldShowPassword] = useState(false);
    const [newShowPassword, setNewShowPassword] = useState(false);
    const [repeatShowPassword, setRepeatShowPassword] = useState(false);
  const togglePasswordVisibility = (field:any) => {
    switch (field) {
      case 'old':
        setOldShowPassword((prevShowPassword) => !prevShowPassword);
        break;
      case 'new':
        setNewShowPassword((prevShowPassword) => !prevShowPassword);
        break;
      case 'repeat':
        setRepeatShowPassword((prevShowPassword) => !prevShowPassword);
        break;
      // Thêm các trường khác nếu cần
      default:
        break;
    }
  };

  const dispatch = useDispatch();
    useEffect(() => {
      setCurrentUser(user);
      setEmail(user.email);
      setName(user.fullName);
    }, [user, navigation]);
    const handleChangePassword = async () => {
      const oldPassError = passwordValidator(oldPass);
      const newPassError = passwordValidator(newPass);
      const repeatPassError = passwordValidator(repeatPass);
      const checkEqualError = equaPassAndRepeatPass(newPass, repeatPass);

      if (oldPassError) {
        ToastAndroid.showWithGravity(
          oldPassError,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      } else if (newPassError) {
        ToastAndroid.showWithGravity(
          newPassError,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      } else if (repeatPassError) {
        ToastAndroid.showWithGravity(
          repeatPassError,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      } else if (checkEqualError) {
        ToastAndroid.showWithGravity(
          checkEqualError,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      const userObject = {
        email: email,
        password: oldPass,
        newPassword: newPass
      };
      setIsLoading(true);
      try {
        const response = await changePass({
          username: user.email,
          password: user.password,
          account: userObject
        });
        switch (response.data.body) {
          case "Old password incorrect" : {
            setIsLoading(false);
            ToastAndroid.showWithGravity(
              "Mật khẩu cũ không chính xác",
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
          }
          case "Password changed successfully" : {
            setIsLoading(false);
            const response = await loginUser(user.email, user.password);
            dispatch(login(response.data.body));
            ToastAndroid.showWithGravity(
              "Đổi mật khẩu thành công",
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
          }
        }
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    };
    const handleChangeAction = () => {
      SetIsChangePass(!isChangePass);
    };
    const handleSave = async () => {
      const nameError = nameValidator(name);
      if (nameError) {
        ToastAndroid.showWithGravity(
          nameError,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      const userObject = {
        fullName: name,
        email: email
      };
      setIsLoading(true);
      try {
        const response = await updateUserProfile({
          accountId: user.id,
          username: user.email,
          password: user.password,
          account: userObject
        });
        if (response.status === 200) {
          setIsLoading(false);
          const response = await loginUser(email, user.password);
          dispatch(login(response.data.body));
          ToastAndroid.showWithGravity(
            "Cập nhật thành công",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          navigation.navigate("Settings");
        } else {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            "Có lỗi trong quá trình cập nhật",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        }
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    };
    return (
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
        <Image source={ImagesAssets.user} style={styles.avatar} />
        {!isChangePass && <>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập địa chỉ email"
            keyboardType="email-address"
            editable={false}
          />
          <Text style={styles.label}>Họ tên:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên người dùng"
          />
          <Text style={{ marginBottom: 10 }} />
          <Button title="Lưu thông tin" onPress={handleSave} />
        </>}

        {isChangePass && <>
          <Text style={styles.label}>Mật khẩu cũ:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{height: 45, flex:1}}
              value={oldPass}
              onChangeText={setOldPass}
              secureTextEntry={!oldShowPassword}
              placeholder="Nhập mật khẩu cũ"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => togglePasswordVisibility('old')}>
              <Icon name={oldShowPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Mật khẩu mới:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{height: 45, flex:1}}
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry={!newShowPassword}
              placeholder="Nhập mật khẩu mới"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => togglePasswordVisibility('new')}>
              <Icon name={newShowPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nhập lại mật khẩu mới:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{height: 45, flex:1}}
              value={repeatPass}
              onChangeText={setRepeatPass}
              secureTextEntry={!repeatShowPassword}
              placeholder="Nhập lại mật khẩu mới"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => togglePasswordVisibility('repeat')}>
              <Icon name={repeatShowPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <Text style={{ marginBottom: 10 }} />
          <Button title="Đổi mật khẩu" onPress={handleChangePassword} />
        </>}
        <Text style={{ marginBottom: 10 }} />
        <Button title={!isChangePass ? "Chuyển sang Đổi mật khẩu" : "Quay lại"} onPress={handleChangeAction} />
      </View>
    );
  }
;

const styles = StyleSheet.create({
  container: {
    padding: 16

  },
  avatar: {
    alignSelf: "center",
    width: 140,
    height: 140,
    borderRadius: 40, // Đặt bo tròn hình ảnh (nửa chiều rộng)
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 2,
    color: "black"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  roleContainer: {
    marginBottom: 16
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  radioButtonLabel: {
    fontSize: 16,
    marginLeft: 8
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom:10
  },
  eyeIcon: {
    padding: 10,
  },
});

export default UserProfile;
