import React, { useEffect, useState } from "react";
import {
  View, FlatList, Text, TouchableNativeFeedback
} from "react-native";
import { ListNewsCardItem } from "../components/elements/ListNewsCardItem";
import { SelectList } from "react-native-dropdown-select-list/index";
import { data } from "../components/sortSelect";
import { useSelector } from "react-redux";
import { listBookmarks } from "../apiCalls/listBookmarks";

const BookMarks: React.FC = (props: any) => {
  const [event, setEvent] = useState(false);
  const [saveList, setSaveList] = useState<any[]>([]);
  // @ts-ignore
  const [selected, setSelected] = useState<any>(data.at(0).key);
  const user = useSelector((state: any) => state.userObj);
  const reload = useSelector((state: any) => state.reloadBookmark);

  useEffect(() => {
    const getList = async () => {
      try {
        if (user) {
          const saveList = await listBookmarks({
            id: user.id,
            username: user.email,
            password: user.password
          });
          saveList.sort((a: any, b: any) => {
              switch (selected) {
                case "1": {
                  return new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();
                }
                case "2": {
                  return new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf();
                }
                case "3": {
                  return a.title.localeCompare(b.title);
                }
                case "4": {
                  return b.title.localeCompare(a.title);
                }
                case "0": {
                  return new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();
                }
              }
            }
          );
          setSaveList(saveList);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    };
    getList();
    return props.navigation.addListener("focus", () => {
      getList();
    });
  }, [user, props, selected, event, reload]);


  return (

    <View style={{ marginBottom: 60 }}>

      <SelectList
        setSelected={setSelected}
        data={data}
        inputStyles={{ color: "black" }}
        boxStyles={{ marginTop: 10, marginBottom: 5, marginHorizontal: 10, backgroundColor: "white" }}
        dropdownStyles={{ marginVertical: 5, marginHorizontal: 10, backgroundColor: "white" }}
        notFoundText={""}
        dropdownTextStyles={{ color: "black" }}
        searchPlaceholder={""}
        defaultOption={data.at(0)}
      />
      {(saveList.length > 0) ? <FlatList
        data={saveList}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({ item, index }) => {
          return (
            <ListNewsCardItem itemNews={item} screen={"BookMarks"}
                              navigation={props.navigation} handleEvent={setEvent} event={event} />
          );
        }}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}

      /> : <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>Không có tin nào</Text>
      </View>}

    </View>
  );
};

export default BookMarks;
