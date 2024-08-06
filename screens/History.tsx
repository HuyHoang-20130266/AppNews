import React, { useEffect, useState } from "react";
import {
  View, FlatList, Text
} from "react-native";
import { ListNewsCardItem } from "../components/elements/ListNewsCardItem";
import { SelectList } from "react-native-dropdown-select-list/index";
import { data } from "../components/sortSelect";
import { useDispatch, useSelector } from "react-redux";

const History: React.FC = (props: any) => {

  const [historyList, setHistoryList] = useState<any[]>([]);
  // @ts-ignore
  const [selected, setSelected] = useState<any>(data.at(0).key);
  // @ts-ignore
  const viewedList = useSelector((state) => state.viewedlist);

  useEffect(() => {
    const getList = () => {
      try {
        if (viewedList !== undefined) {
          viewedList.sort((a: any, b: any) => {
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
          setHistoryList(viewedList);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    };
    getList();
  }, [viewedList, selected]);


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
      {(historyList.length > 0) ? <FlatList
        data={historyList}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({ item, index }) => {
          return (
            <ListNewsCardItem itemNews={item} screen={"History"}
                              navigation={props.navigation} />
          );
        }}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}

      /> : <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>Không có tin nào</Text>
      </View>}

    </View>
  );
};

export default History;
