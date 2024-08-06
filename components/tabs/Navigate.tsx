import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getInitialState } from "../../ReduxStore/getInitialState";
import { useEffect, useState } from "react";
import { init } from "../../ReduxStore/Action";
import NavigateUser from "./NavigateUser";
import NavigateAdmin from "./NavigateAdmin";


export default function Navigate() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userObj);
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const initState = async () => {
      try {
        const initialState = await getInitialState();
        if (initialState) {
          dispatch(init(initialState));
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    if (JSON.stringify(user) !== JSON.stringify(currentUser)) {
      initState().then(() => setCurrentUser(user));
    }
  }, [user, currentUser, dispatch]);
  console.log(currentUser);

  return (<NavigationContainer>
    {currentUser === null || !currentUser.admin ? <NavigateUser /> : <NavigateAdmin />}
  </NavigationContainer>);
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "400",
    fontSize: 20
  }
});
