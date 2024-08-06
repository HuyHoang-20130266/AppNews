import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import BottomNavigationAdmin from "./BottomNavigationAdmin";
import AdminSettings from "../../screens/adminScreens/AdminSettings";
import UserModify from "../../screens/adminScreens/UserModify";
import AddUser from "../../screens/adminScreens/AddUser";
import AddCategory from "../../screens/adminScreens/AddCategory";
import CategoryModify from "../../screens/adminScreens/CategoryModify";
import NewsModify from "../../screens/adminScreens/NewsModify";
import AddNews from "../../screens/adminScreens/AddNews";
import UserProfile from "../../screens/UserProfile";

const Stack = createStackNavigator();

function getHeaderTitle(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "user";

  switch (routeName) {
    case "user":
      return "Quản lý tài khoản".toUpperCase();
    case "list-ul":
      return "Quản lý danh mục".toUpperCase();
    case "newspaper-o":
      return "Quản lý tin tức".toUpperCase();
  }
}

export default function NavigateAdmin() {

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="UserDashBoard"
        component={BottomNavigationAdmin}
        options={({ route, navigation }) => ({
          title: getHeaderTitle(route),
          headerTitleStyle: styles.headerTitle,
          headerStyle: {
            elevation: 100,
            borderBottomWidth: 0.5
          },
          headerShow: true,
          headerRight: () => (
            <Icon
              onPress={() => navigation.navigate("AdminSetting")}
              color="black"
              name={"gear"}
              style={{ fontSize: 26, marginRight: 10 }} />
          )
        })}
      />
      <Stack.Screen name="AdminSetting" component={AdminSettings} options={({ navigation }) => ({
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
      <Stack.Screen name="CategoryModify" component={CategoryModify} options={({ navigation }) => ({
        title: "Sửa danh mục".toUpperCase(), headerTitleStyle: styles.headerTitle,
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
      <Stack.Screen name="NewsModify" component={NewsModify} options={({ navigation }) => ({
        title: "Sửa bài báo".toUpperCase(), headerTitleStyle: styles.headerTitle,
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
      <Stack.Screen name="AddCategory" component={AddCategory} options={({ navigation }) => ({
        title: "Thêm danh mục".toUpperCase(), headerTitleStyle: styles.headerTitle,
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
      <Stack.Screen name="AddNews" component={AddNews} options={({ navigation }) => ({
        title: "Thêm bài báo".toUpperCase(), headerTitleStyle: styles.headerTitle,
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
      <Stack.Screen name="UserModify" component={UserModify} options={({ navigation }) => ({
        title: "Chỉnh sửa tài khoản".toUpperCase(), headerTitleStyle: styles.headerTitle,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        },

      })} />
      <Stack.Screen name="AddUser" component={AddUser} options={({ navigation }) => ({
        title: "Thêm tài khoản".toUpperCase(), headerTitleStyle: styles.headerTitle,
        headerStyle: {
          elevation: 100,
          borderBottomWidth: 0.5
        },

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
    </Stack.Navigator>);
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "400",
    fontSize: 20
  }
});
