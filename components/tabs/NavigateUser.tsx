import BottomNavigation from "./BottomNavigation";
import Settings from "../../screens/Settings";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import { ImagesAssets } from "../../assets/img/ImagesAssets";
import AboutUs from "../../screens/AboutUs";
import Login from "../../screens/Login";
import SignUp from "../../screens/SignUp";
import ForgotPassword from "../../screens/ForgotPassword";
import ListNews from "../../screens/ListNews";
import Details from "../../screens/Details";
import { useDispatch, useSelector } from "react-redux";
import { removeAllSaved, removeAllViewed, removeItem } from "../../ReduxStore/Action";
import History from "../../screens/History";
import BookMarks from "../../screens/BookMarks";
import UserProfile from "../../screens/UserProfile";
import { deleteCate } from "../../apiCalls/deleteCate";
import { deleteAllBookMarks } from "../../apiCalls/deleteAllBookMarks";
import QRScanLogin from "../../screens/QRScanLogin";

const Stack = createStackNavigator();

function getHeaderTitle(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "home";
  switch (routeName) {
    case "home":
      return "Trang chủ".toUpperCase();
    case "search":
      return "Tìm kiếm".toUpperCase();
    case "list":
      return "Danh mục".toUpperCase();
  }
}

export default function NavigateUser() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userObj);
  const reload = useSelector((state: any) => state.reloadBookmark);
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Home"
        component={BottomNavigation}
        options={({ route, navigation }) => ({
          title: getHeaderTitle(route),
          headerTitleStyle: styles.headerTitle,
          headerStyle: {
            elevation: 100,
            borderBottomWidth: 0.5
          },
          headerShow: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("AboutUs")}>
              <Image
                source={ImagesAssets.logo}
                style={{ marginLeft: 10, width: 40, height: 40, borderRadius: 8 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Icon
              onPress={() => navigation.navigate("Settings")}
              color="black"
              name={"gear"}
              style={{ fontSize: 26, marginRight: 10 }} />
          )
        })}
      />
      <Stack.Screen name="Settings" component={Settings} options={({ navigation }) => ({
        title: "Cài đặt".toUpperCase(), headerTitleStyle: styles.headerTitle,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        },
        cardStyleInterpolator: ({ current, layouts }: any) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0]
                  })
                }
              ]
            }
          };
        }

      })} />
      <Stack.Screen name="AboutUs" component={AboutUs} options={({ navigation, screenProps }: any) => ({
        title: "Về ứng dụng này".toUpperCase(),
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="Login" component={Login} options={({ navigation }: any) => ({
        title: "Đăng nhập".toUpperCase(),
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="SignUp" component={SignUp} options={({ navigation }: any) => ({
        title: "Đăng ký".toUpperCase(),
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={({ navigation }: any) => ({
        title: "Quên mật khẩu".toUpperCase(),
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="ListNews" component={ListNews} options={({ navigation, route }: any) => ({
        title: route.params.item.name,
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="Details" component={Details} options={({ navigation, route }: any) => ({
        headerTitle: "",
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="UserProfile" component={UserProfile} options={({ navigation, route }: any) => ({
        headerTitle: "",
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
      <Stack.Screen name="History" component={History} options={({ navigation, route }: any) => ({
        headerTitle: "Lịch sử",
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        },
        headerRight: () => {
          const showAlert = () => {
            Alert.alert(
              "Xoá các bài viết",
              "Xoá tất cả các bài viết ?",
              [{
                text: "Huỷ",
                style: "cancel"
              }, {
                text: "Xoá",
                onPress: () => {
                  dispatch(removeAllViewed());
                },
                style: "default"
              }]
            );
          };
          return (
            <Icon
              onPress={showAlert}
              color="black"
              name={"trash"}
              style={{ fontSize: 23, marginRight: 10 }} />
          );
        }
      })} />
      <Stack.Screen name="BookMarks" component={BookMarks} options={({ navigation, route }: any) => ({
        headerTitle: "Tin tức đã lưu",
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        },
        headerRight: () => {
          const showAlert = () => {
            Alert.alert(
              "Xoá các bài viết",
              "Xoá tất cả các bài viết ?",
              [{
                text: "Huỷ",
                style: "cancel"
              }, {
                text: "Xoá",
                onPress: () => {
                  async function handleRemoveAllSave() {
                    try {
                      const response = await deleteAllBookMarks({
                        userId: user.id,
                        username: user.email,
                        password: user.password
                      });
                      if (response.status === 200) {
                        ToastAndroid.showWithGravity(
                          "Xóa tất cả tin tức đã lưu thành công",
                          ToastAndroid.LONG,
                          ToastAndroid.CENTER
                        );
                        dispatch(removeAllSaved(!reload));
                      } else {
                        ToastAndroid.showWithGravity(
                          "Có lỗi trong quá trình xóa danh mục",
                          ToastAndroid.LONG,
                          ToastAndroid.CENTER
                        );
                      }
                    } catch (error) {
                      console.log("Error in handleDelete:", error);
                    }
                  }

                  handleRemoveAllSave();
                },
                style: "default"
              }]
            );
          };
          return (
            <Icon
              onPress={showAlert}
              color="black"
              name={"trash"}
              style={{ fontSize: 23, marginRight: 10 }} />
          );
        }
      })} />
      <Stack.Screen name="QRScanLogin" component={QRScanLogin} options={({ navigation, route }: any) => ({
        headerTitle: "QRScan Login",
        headerTitleStyle: styles.headerTitle,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        }
      })} />
    </Stack.Navigator>);
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "400",
    fontSize: 20
  }
});
