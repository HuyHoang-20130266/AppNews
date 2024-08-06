import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Button,
  Alert,
  Image,
  ToastAndroid,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { RadioButton } from "react-native-paper";
import { ImagesAssets } from "../../assets/img/ImagesAssets";
import { useRoute } from "@react-navigation/native";
import { nameValidator } from "../../helpers/nameValidator";
import { emailValidator } from "../../helpers/emailValidator";
import { updateAccount } from "../../apiCalls/updateAccount";
import { useSelector } from "react-redux";
import { updatePassword } from "../../apiCalls/updatePassword";
import { deleteUser } from "../../apiCalls/deleteUser";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UserModify: React.FC = (props: any) => {
    const Router = useRoute();
    const { user } = Router.params as { user: any };
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("user");
    const [status, setStatus] = useState<boolean>(false);
    const admin = useSelector((state: any) => state.userObj);
    useEffect(() => {
      if (user) {
        setName(user.fullName);
        setEmail(user.email);
        setRole(user.admin ? "admin" : "user");
        setStatus(user.status);
      }
    }, [user]);
    const handleSave = async () => {
      const nameError = nameValidator(name);
      const emailError = emailValidator(email);
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
      }
      const userObject = {
        fullName: name,
        email: email,
        status: status,
        isAdmin: role === "admin"
      };
      setIsLoading(true);
      if (admin) {
        try {
          const response = await updateAccount({
            accountId: user.id,
            username: admin.email,
            password: admin.password,
            account: userObject
          });
          if (response.status === 200) {
            setIsLoading(false);
            ToastAndroid.showWithGravity(
              "Cập nhật thành công",
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
    const handleDelete = () => {
      Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa tài khoản không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa", style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              // Gọi hàm xóa danh mục từ API
              const response = await deleteUser({
                accountId: user.id,
                username: admin.email,
                password: admin.password
              });
              if (response.status === 204) {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Xóa use thành công",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                props.navigation.replace("UserDashBoard");
              } else {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Có lỗi trong quá trình xóa tài khoản",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
              }
            } catch (error) {
              setIsLoading(false);
              console.log("Error in handleDelete:", error);
            }
          }
        }
      ]);
    };

    const handleChangePassword = async () => {
      setIsLoading(true);
      if (admin) {
        try {
          const response = await updatePassword({
            id: user.id,
            username: admin.email,
            password: admin.password
          });
          if (response.status === 200) {
            setIsLoading(false);
            ToastAndroid.showWithGravity(
              "Cập nhật mật khẩu thành công",
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
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
          editable={false}
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
        {user && <Button title="Cập nhật mật khẩu mới" onPress={handleChangePassword} />}
        <Text style={{ marginBottom: 10 }} />
        <Button title="Lưu" onPress={handleSave} />
        <Text style={{ marginBottom: 10 }} />
        {user && <Button title="Xóa tài khoản" onPress={handleDelete} color={"red"} />}
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
    fontSize: 16
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
  }
});

export default UserModify;
