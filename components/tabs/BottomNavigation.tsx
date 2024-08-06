/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../../screens/Home';
import Settings from '../../screens/Settings';
import BottomTabNavigator from './BottomTabNavigator';
import Search from "../../screens/Search";
import Categories from "../../screens/Categories";

const Tab = createBottomTabNavigator();

function BottomNavigation() {
    const tabs = [
        {
            name: 'home',
            label: 'Trang chủ',
            component: Home,
        },
        {
            name: 'search',
            label: 'Tìm kiếm',
            component: Search,
        },
        {
            name: 'list',
            label: 'Danh mục',
            component: Categories,
        },
      ];
  return (
    <Tab.Navigator
    tabBar={(props) => <BottomTabNavigator {...props} />}
    initialRouteName={'Home'}
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

export default BottomNavigation;
