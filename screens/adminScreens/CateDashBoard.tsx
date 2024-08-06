import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { dataCate } from "../../components/sortSelect";
import { useRoute } from "@react-navigation/native";
import { CateCardItem } from "../../components/elements/CateCardItem";
import { allCates } from "../../apiCalls/allCates";
import { useSelector } from "react-redux";

const CateDashBoard: React.FC = (props: any) => {
  const route = useRoute();

  const [listCateg, setListCate] = useState<any[]>([]);
  // @ts-ignore
  const [selected, setSelected] = useState<any>(dataCate.at(0).key);
  const admin = useSelector((state: any) => state.userObj);
  const [event, setEvent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin) {
          const cateData = await allCates();
          setListCate(cateData.filter((item: any) => {
            switch (selected) {
              case "1": {
                return item.delete;
              }
              case "2": {
                return !item.delete;
              }
              case "0": {
                return item;
              }
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching cate dashboard:", error);
      }
    };
    fetchData();
    return props.navigation.addListener("focus", () => {
      fetchData();
    });
  }, [props, selected, admin, event]);


  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 120 }}>
        <SelectList
          setSelected={setSelected}
          data={dataCate}
          inputStyles={{ color: "black" }}
          boxStyles={{ marginTop: 10, marginBottom: 5, marginHorizontal: 10, backgroundColor: "white" }}
          dropdownStyles={{ marginVertical: 5, marginHorizontal: 10, backgroundColor: "white" }}
          notFoundText={""}
          dropdownTextStyles={{ color: "black" }}
          searchPlaceholder={""}
          defaultOption={dataCate.at(0)}
        />
        <FlatList
          data={listCateg}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          renderItem={({ item, index }) => {
            return (
              <CateCardItem cate={item} screen={"CateDashBoard"} admin={admin} handleEvent={setEvent} event={event}
                            navigation={props.navigation} />
            );
          }}
          contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}

        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => props.navigation.navigate("AddCategory")}>
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

export default CateDashBoard;
