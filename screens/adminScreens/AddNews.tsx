import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  ScrollView, ToastAndroid, ActivityIndicator, Dimensions
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import { uploadImageToImgBB } from "../../apiCalls/imgUploadServer";
import { useSelector } from "react-redux";
import CheckboxList from "rn-checkbox-list";
import { allCates } from "../../apiCalls/allCates";
import { addNews } from "../../apiCalls/addNews";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const AddNews: React.FC = (props: any) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const _editor = React.createRef<QuillEditor>();
  const [selectedImg, setSelectedImg] = useState<any>({ uri: null, base64: null });
  const [isLoading, setIsLoading] = useState(false);
  const admin = useSelector((state: any) => state.userObj);
  const [modalVisible, setModalVisible] = useState(false);
  const [listCate, setListCate] = useState<any>(null);
  const [listCateSelected, setListCateSelected] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState([]);

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
    fetchData();
  }, [props, admin]);

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
        const response = await uploadImageToImgBB(selectedImg.base64);
        if (response) {
          const result = await addNews({
            username: admin.email,
            password: admin.password,
            title: title,
            description: desc,
            image: response.data.url,
            content: content.toString(),
            createdBy: admin.fullName,
            idCategories: listCateSelected
          });
          console.log(result);
          if (result.status === 200 || result.status === 201) {
            setIsLoading(false);
            ToastAndroid.showWithGravity(
              "Thêm thành công",
              ToastAndroid.LONG,
              ToastAndroid.CENTER);
            props.navigation.navigate("UserDashBoard", { screen: "NewsDashBoard" });
          }
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        ToastAndroid.showWithGravity(
          "Error Occurred, so save news is failed",
          ToastAndroid.LONG,
          ToastAndroid.CENTER);
      }
      setIsLoading(false);
    }
  };

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
              selectedListItems={selectedIds}
              listItemStyle={{ borderBottomColor: "#eee", borderBottomWidth: 1 }}
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
      <ScrollView contentContainerStyle={{ height: "150%" }}>
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
        <SafeAreaView style={{
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
            initialHtml={"Thêm nội dung tại đây!"}
          />
          <View style={{ width: "100%" }}>
            <QuillToolbar editor={_editor} options="full" theme="light" />
          </View>
        </SafeAreaView>
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
          <Text style={[styles.label, { marginTop: 15, marginBottom: 15 }]}>Chọn danh mục:</Text>
          <Button title="Chọn danh mục" onPress={() => setModalVisible(true)} />
        </View>
        <Button title="Thêm bài báo"
                onPress={handleSave}
        />
        <Text style={{ marginTop: -5 }} />
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

export default AddNews;
