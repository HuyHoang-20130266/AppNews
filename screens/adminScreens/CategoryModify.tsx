import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { nameValidator } from "../../helpers/nameValidator";
import { updateCate } from "../../apiCalls/updateCate";
import { useSelector } from "react-redux";
import { deleteCate } from "../../apiCalls/deleteCate";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const CategoryModify: React.FC = (props: any) => {
  const Router = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const { cate } = Router.params as { cate: any };
  const [name, setName] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(true);
  const admin = useSelector((state: any) => state.userObj);

  useEffect(() => {
    if (cate) {
      setName(cate.name);
      setIsDelete(!cate.isDelete);
    }
  }, [cate]);
  const handleSave = async () => {
    console.log("Before handleSave");
    const nameError = nameValidator(name);
    if (nameError) {
      ToastAndroid.showWithGravity(
        nameError,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }
    const cateObject = {
      name: name,
      delete: isDelete
    };

    setIsLoading(true);
    if (admin) {
      try {
        const response = await updateCate({
          cateId: cate.id,
          username: admin.email,
          password: admin.password,
          cate: cateObject
        });
        if (response.status === 200) {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            "Cập nhật thành công",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          props.navigation.navigate("UserDashBoard", { screen: "CateDashBoard" });
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
        console.log("Error in updateCate:", e);
      }
    }

  };


  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa danh mục này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              // Gọi hàm xóa danh mục từ API
              const response = await deleteCate({
                CateId: cate.id,
                username: admin.email,
                password: admin.password
              });
              if (response.status === 204) {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Xóa danh mục thành công",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                props.navigation.navigate("UserDashBoard", { screen: "CateDashBoard" });
              } else {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Có lỗi trong quá trình xóa danh mục",
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
      ]
    );
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
      <Text style={styles.label}>Tên danh mục:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên danh mục"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Switch value={isDelete} onValueChange={setIsDelete} />
      </View>
      <Button title="Lưu" onPress={handleSave} />
      <Text style={{ marginTop: -5 }} />
      <Button title="Xóa danh mục" onPress={handleDelete} color={"red"} />
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
    fontSize: 16
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  }
});

export default CategoryModify;
