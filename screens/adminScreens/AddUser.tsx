import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Button,
  Image,
  ToastAndroid,
  ActivityIndicator, Dimensions
} from "react-native";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { ImagesAssets } from "../../assets/img/ImagesAssets";
import { nameValidator } from "../../helpers/nameValidator";
import { emailValidator } from "../../helpers/emailValidator";
import { updateAccount } from "../../apiCalls/updateAccount";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { passwordValidator } from "../../helpers/passwordValidator";
import { addUser } from "../../apiCalls/addUser";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddUser: React.FC = (props: any) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [status, setStatus] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const admin = useSelector((state: any) => state.userObj);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const nameError = nameValidator(name);
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    if (nameError) {
      ToastAndroid.showWithGravity(
        nameError,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    } else if (emailError) {
      ToastAndroid.showWithGravity(
        emailError,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    } else if (passwordError) {
      ToastAndroid.showWithGravity(
        passwordError,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }
    const userObject = {
      fullName: name,
      email: email,
      password: password,
      status: status,
      isAdmin: role === "admin" ? true : false
    };
    console.log("userObject", userObject);
    setIsLoading(true);
    if (admin) {
      try {
        const response = await addUser({
          username: admin.email,
          password: admin.password,
          account: userObject
        });
        if (response.statusCodeValue === 400) {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            "Email đã tồn tại trong hệ thống",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        } else if (response.statusCodeValue === 200) {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            "Tạo tài khoản thành công",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          props.navigation.navigate("UserDashBoard", { screen: "UserDashBoard" });
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
      <Image source={role === "admin" ? ImagesAssets.userAdmin : ImagesAssets.user} style={styles.avatar} />

      <Text style={styles.label}>Họ tên:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên người dùng"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập địa chỉ email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mật khẩu:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry={true}
      />

      <Text style={styles.label}>Vai trò:</Text>
      <View style={styles.roleContainer}>
        <RadioButton.Group onValueChange={(value) => setRole(value)} value={role}>
          <View style={styles.radioButtonContainer}>
            <RadioButton.Android value="user" />
            <Text style={styles.radioButtonLabel}>Người dùng</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton.Android value="admin" />
            <Text style={styles.radioButtonLabel}>Admin</Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Switch value={status} onValueChange={setStatus} />
      </View>


      <Button title="Tạo tài khoản" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
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
    width: "100%"
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
  avatar: {
    alignSelf: "center",
    width: 140,
    height: 140,
    borderRadius: 40, // Đặt bo tròn hình ảnh (nửa chiều rộng)
    marginBottom: 16
  }
});

export default AddUser;
