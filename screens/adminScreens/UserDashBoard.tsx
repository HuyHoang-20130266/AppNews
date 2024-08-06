import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet, Text, FlatList, TouchableOpacity
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { dataUser } from "../../components/sortSelect";
import { UserCardItem } from "../../components/elements/UserCardItem";
import { useRoute } from "@react-navigation/native";
import { allUsers } from "../../apiCalls/allUsers";
import { useSelector, useDispatch } from "react-redux";


const UserDashBoard: React.FC = (props: any) => {
  const route = useRoute();

  const [listUser, setListUser] = useState<any[]>([]);
  // @ts-ignore
  const [selected, setSelected] = useState<any>(dataUser.at(0).key);
  const [event, setEvent] = useState(false);
  const admin = useSelector((state: any) => state.userObj);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin) {
          const userData = await allUsers({ username: admin.email, password: admin.password });
          setListUser(userData.filter((item: any) => item.id !== admin.id).filter((item: any) => {
            switch (selected) {
              case "1": {
                return item.status && !item.admin;
              }
              case "2": {
                return !item.status && !item.admin;
              }
              case "3": {
                return item.status && item.admin;
              }
              case "4": {
                return !item.status && item.admin;
              }
              case "0": {
                return item;
              }
            }
          }));
        }
      } catch
        (error) {
        console.error("Error fetching users: hihi", error);
      }
    };
    fetchData();
    return props.navigation.addListener("focus", () => {
      fetchData();
    });
  }, [props, selected, admin, event]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 130 }}>
        <SelectList
          setSelected={setSelected}
          data={dataUser}
          inputStyles={{ color: "black" }}
          boxStyles={{ marginTop: 10, marginBottom: 5, marginHorizontal: 10, backgroundColor: "white" }}
          dropdownStyles={{ marginVertical: 5, marginHorizontal: 10, backgroundColor: "white" }}
          notFoundText={""}
          dropdownTextStyles={{ color: "black" }}
          searchPlaceholder={""}
          defaultOption={dataUser.at(0)}
        />
        <FlatList
          data={listUser}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          renderItem={({ item, index }) => {
            return (
              <UserCardItem user={item} screen={"UserDashBoard"} admin={admin}
                            navigation={props.navigation} handleEvent={setEvent} event={event} />
            );
          }}
          contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}

        />
      </View>
      {/* Nút dấu cộng ở góc dưới bên phải */}
      <TouchableOpacity style={styles.addButton} onPress={() => props.navigation.navigate("AddUser")}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
    ;
};

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    paddingBottom: 80,
    top: 20
  },
  scrollViewContent: {
    alignItems: "center"
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16
  },
  addButton: {
    position: "absolute",
    bottom: 150,
    right: 14,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center"
  },
  addButtonText: {
    fontSize: 30,
    color: "white"
  }
});

export default UserDashBoard;
