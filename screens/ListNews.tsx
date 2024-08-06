import React, { useEffect, useState } from "react";
import {
  View, FlatList
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { listNews } from "../apiCalls/listNews";
import { ListNewsCardItem } from "../components/elements/ListNewsCardItem";
import { SelectList } from "react-native-dropdown-select-list/index";
import { data } from "../components/sortSelect";

const ListNews: React.FC = (props: any) => {
  const route = useRoute();
  const { item } = route.params as {
    item: { id: number, name: string, isDelete: number, created_date: string, created_by: string }
  };

  const [listByCate, setListByCate] = useState<any[]>([]);
  // @ts-ignore
  const [selected, setSelected] = useState<any>(data.at(0).key);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await listNews(item.id);
        newsData.sort((a: any, b: any) => {
          switch (selected) {
            case "1": {
              return new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf();
            }
            case "2": {
              return new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();
            }
            case "3": {
              return a.title.localeCompare(b.title);
            }
            case "4": {
              return b.title.localeCompare(a.title);
            }
            case "0": {
              return new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf();
            }
          }
        });
        setListByCate(newsData.filter((item: any) => !item.delete));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    if (item) {
      fetchData();
    }
  }, [item, selected]);


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
      <FlatList
        data={listByCate}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({ item, index }) => {
          return (
            <ListNewsCardItem itemNews={item} screen={"ListNews"}
                              navigation={props.navigation} />
          );
        }}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}

      />
    </View>
  );
};

export default ListNews;
