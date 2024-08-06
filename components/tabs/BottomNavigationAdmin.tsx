/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomTabNavigatorAdmin from "./BottomTabNavigatorAdmin";
import UserDashBoard from "../../screens/adminScreens/UserDashBoard";
import CateDashBoard from "../../screens/adminScreens/CateDashBoard";
import NewsDashBoard from "../../screens/adminScreens/NewsDashBoard";

const Tab = createBottomTabNavigator();

function BottomNavigationAdmin() {
  const tabs = [
    {
      name: "user",
      label: "Quản lý tài khoản",
      component: UserDashBoard
    },
    {
      name: "list-ul",
      label: "Quản lý danh mục",
      component: CateDashBoard
    },
    {
      name: "newspaper-o",
      label: "Quản lý tin tức",
      component: NewsDashBoard
    }
  ];
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabNavigatorAdmin {...props} />}
      initialRouteName={"Home"}
    >
      {tabs.map((_, index) => {
        return (
          <Tab.Screen
            key={index}
            name={_.name}
            component={_.component}
            options={{
              tabBarLabel: _.label,
              headerShown: false,
              title: _.label
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export default BottomNavigationAdmin;
