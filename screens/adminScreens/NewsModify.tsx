import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  ScrollView, ToastAndroid, ActivityIndicator, Dimensions
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import { uploadImageToImgBB } from "../../apiCalls/imgUploadServer";
import { useSelector } from "react-redux";
import CheckboxList from "rn-checkbox-list";
import { allCates } from "../../apiCalls/allCates";
import { getCateIdByNews } from "../../apiCalls/getCateIdByNews";
import { updateNews } from "../../apiCalls/updateNews";
import { deleteNews } from "../../apiCalls/deleteNews";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const NewsModify: React.FC = (props: any) => {
  const Router = useRoute();
  const { item } = Router.params as { item: any };
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const _editor = React.createRef<QuillEditor>();
  const [selectedImg, setSelectedImg] = useState<any>({ uri: null, base64: null });
  const [isLoading, setIsLoading] = useState(false);
  const admin = useSelector((state: any) => state.userObj);
  const [content, setContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [listCate, setListCate] = useState<any>(null);
  const [listCateSelected, setListCateSelected] = useState<any>([]);
  const [listCateSelectedOriginal, setListCateSelectedOriginal] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listCate = await allCates();
        setListCate(listCate.map((item: { id: any; name: any; }) => ({ id: item.id, name: item.name }))
        );
      } catch (e) {
        console.log(e);
      }
    };
    const fetchCate = async () => {
      try {
        const listCate = await getCateIdByNews({ id: item.id });
        setListCateSelected(listCate.map((item: { id: any; name: any; }) => ({ id: item.id, name: item.name })));
        setListCateSelectedOriginal(listCate.map((item: { id: any; name: any; }) => ({
          id: item.id,
          name: item.name
        })));
      } catch (e) {
        console.log(e);
      }
    };
    if (item) {
      setTitle(item.title);
      setDesc(item.description);
      setSelectedImg({ ...setSelectedImg, uri: item.image });
      setContent(!item.content.toString().includes("<script>") ?
        item.content.toString() :
        item.content.toString().substring(0, item.content.indexOf("<script>")));
      setIsActive(!item.delete);
      fetchData();
      fetchCate();
    }
  }, [props, item, admin]);

  const imagePicker = () => {
    launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      maxWidth: 700,
      maxHeight: 500
    }, async (response: any) => {
      setIsLoading(true);
      if (!response.didCancel) {
        const imageData = `${response.assets[0].base64}`;
        setSelectedImg({ uri: response.assets[0].uri, base64: imageData });
      }
      setIsLoading(false);
    });
  };
  const handleSave = async () => {
    const getContents = async () => {
      if (_editor && _editor.current) {
        return await _editor.current.getHtml();
      }
    };
    if (admin) {
      setIsLoading(true);
      const content: any = await getContents();
      if (!content.trim()) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Yêu cầu nhập nội dung tin tức",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      if (!selectedImg.uri) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Yêu cầu chọn một bức ảnh cho tin tức",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      if (title.length < 1 || desc.length < 1) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Không được bỏ trống tiêu đề hoặc mô tả",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      if (listCateSelected.length < 1) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Không được bỏ trống phần danh mục",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      try {
        let urlImg;
        if (selectedImg.uri === item.image) {
          urlImg = item.image;
        } else {
          const response = await uploadImageToImgBB(selectedImg.base64);
          urlImg = response.data.url;
        }
        if (urlImg) {
          const result = await updateNews({
            id: item.id,
            username: admin.email,
            password: admin.password,
            title: title,
            description: desc,
            image: urlImg,
            content: content.toString(),
            delete: isActive,
            createdBy: admin.fullName,
            idCategories: JSON.stringify(listCateSelected) === JSON.stringify(listCateSelectedOriginal) ? listCateSelected.map((item: any) => item.id) : listCateSelected
          });
          if (result.status === 200) {
            setIsLoading(false);
            ToastAndroid.showWithGravity(
              "Cập nhật thành công",
              ToastAndroid.LONG,
              ToastAndroid.CENTER);
            props.navigation.navigate("UserDashBoard", { screen: "NewsDashBoard" });
          }
        }
      } catch (e) {
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Error Occurred, so save news is failed",
          ToastAndroid.LONG,
          ToastAndroid.CENTER);
      }
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa bài báo này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              // Gọi hàm xóa danh mục từ API
              const response = await deleteNews({
                id: item.id,
                username: admin.email,
                password: admin.password
              });
              if (response.status === 204) {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Xóa bài báo thành công",
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                props.navigation.navigate("UserDashBoard", { screen: "NewsDashBoard" });
              } else {
                setIsLoading(false);
                ToastAndroid.showWithGravity(
                  "Có lỗi trong quá trình xóa bài báo mục",
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
  console.log(isActive);

  // @ts-ignore
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
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View
            style={{ backgroundColor: "white", width: "100%", height: "100%", borderColor: "#26292E", borderWidth: 1 }}>
            <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Chọn danh mục</Text>
            <CheckboxList
              listItems={listCate}
              theme="blue"
              listItemStyle={{ borderBottomColor: "#eee", borderBottomWidth: 1 }}
              selectedListItems={listCateSelectedOriginal}
              checkboxProp={{ boxType: "square" }}
              //@ts-ignore
              onChange={({ ids, items }: any) => setListCateSelected(ids)}
            />

            <Button title="Xác nhận"
                    onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={{ height: "160%" }}>
        <Text style={styles.label}>Tên bài báo:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tên bài báo"
        />
        <Text style={styles.label}>Mô tả:</Text>
        <TextInput
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
          placeholder="Nhập mô tả"
        />
        <Text style={styles.label}>Nội dung:</Text>
        {content && <SafeAreaView style={{
          height: 500,
          width: "100%",
          marginBottom: 10
        }}>
          <QuillEditor
            style={{
              flex: 1,
              padding: 0,
              borderColor: "gray",
              borderWidth: 1,
              marginHorizontal: 10,
              marginVertical: 5,
              backgroundColor: "white"
            }}
            ref={_editor}
            //@ts-ignore
            initialHtml={content}
          />
          <View style={{ width: "100%" }}>
            <QuillToolbar editor={_editor} options="full" theme="light" />
          </View>
        </SafeAreaView>}
        <Text style={styles.label}>Ảnh:</Text>
        {selectedImg.uri && <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 200
          }}>
          <Image style={{ minHeight: 150, minWidth: 300 }} resizeMode={"contain"}
                 source={{ uri: selectedImg.uri }} />
        </View>}
        <Button title={selectedImg.uri ? "Chọn lại hình ảnh" : "Chọn hình ảnh"} onPress={imagePicker} />

        <View style={{ marginBottom: 25 }}>
          <Text style={[styles.label, { marginTop: 5 }]}>Chọn danh mục:</Text>
          <Button title="Chọn danh mục" onPress={() => setModalVisible(true)} />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Switch value={isActive} onValueChange={setIsActive} />
        </View>
        <Button title="Lưu"
                onPress={handleSave}
        />
        <Text style={{ marginTop: -5 }} />
        <View>
          <Button title="Xóa tin tức" onPress={handleDelete} color={"red"} />
        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%",
    minHeight: "100%"
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
    marginBottom: 16,
    marginTop: 16
  }
});

export default NewsModify;
