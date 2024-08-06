import React, { useState, useEffect } from "react";
import {
  View, FlatList, KeyboardAvoidingView, Text
} from "react-native";
import { Searchbar } from "react-native-paper";
import { ListNewsCardItem } from "../components/elements/ListNewsCardItem";
import { allNews } from "../apiCalls/allNews";

const Search: React.FC = (props: any) => {
  const [search, setSearch] = useState("");
  const [listFetched, setListFetched] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await allNews();
        setListFetched(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchData();
  }, [props]);

  useEffect(() => {
    if (listFetched) {
      if (search === "")
        setList([]);
      else {
        setList(listFetched.filter((item: any) => item.title.indexOf(search) !== -1).filter((item: any) => !item.delete));
      }
    }
  }, [search]);

  const onChangeSearch = (query: any) => setSearch(query);

  return (
    <KeyboardAvoidingView style={{
      flex: 1,
      width: "100%"
    }} behavior="padding">
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          backgroundColor: "white",
          borderRadius: 25,
          elevation: 8
        }}>
        <Searchbar style={{ backgroundColor: "white" }}
                   placeholder="Tìm..."
                   value={search}
                   onChangeText={onChangeSearch}
        />
      </View>
      {list.length > 0 ? <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({ item, index }) => {
          return (
            <ListNewsCardItem itemNews={item} screen={"Search"}
                              navigation={props.navigation} />
          );
        }}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}

      /> : <View style={{
        justifyContent: "center", alignItems: "center"
      }}>
        <Text>Không có tin nào</Text>
      </View>}

    </KeyboardAvoidingView>
  );
};

export default Search;
