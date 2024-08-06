import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, Button, Alert, StyleSheet, Dimensions, ToastAndroid, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { nameValidator } from "../../helpers/nameValidator";
import { updateCate } from "../../apiCalls/updateCate";
import { addCate } from "../../apiCalls/addCate";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddCategory: React.FC = (props: any) => {
  const Router = useRoute();
  const [name, setName] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(true);
  const admin = useSelector((state: any) => state.userObj);
  const [isLoading, setIsLoading] = useState(false);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

  useEffect(() => {
      setName(name);
      setIsDelete(!isDelete);
  }, []);
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
    const cateObject = {
      name: name,
      isDelete: isDelete,
      createdDate: formattedDate,
      createdBy: admin.fullName
    };
    console.log(cateObject);
    setIsLoading(true);
    if (admin) {
      try {
        const response = await addCate({
          username: admin.email,
          password: admin.password,
          cate: cateObject
        });
        if (response.status === 200 || response.status === 201) {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            "Thêm thành công",
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
        console.log("After updateCate");
      } catch (e) {
        setIsLoading(false);
        console.log(e);
        console.log("Error in updateCate:", e);
      }
    }
  };
  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa danh mục này không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => console.log("Xóa danh mục") }
    ]);
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
      <Button title="Tạo danh mục" onPress={handleSave} />
      <Text style={{ marginBottom: 5 }} />
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

export default AddCategory;
