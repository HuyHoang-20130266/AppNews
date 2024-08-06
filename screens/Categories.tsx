import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView, StyleSheet
} from "react-native";
import { CateCard } from "../components/elements/CateCard";
import { listCate } from "../apiCalls/listCate";
import { listNews } from "../apiCalls/listNews";


const Categories: React.FC = ({ navigation }: any) => {
  const [catedatas, setCateDatas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await listCate()
        // @ts-ignore
        setCateDatas(newsData.filter(item => !item.delete));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    if (navigation) {
      fetchData();
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.gridContainer}>
          {catedatas.map(item =>
            <CateCard key={item.id} item={item} navigation={navigation} />
          )}
        </View>
      </ScrollView>
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
  }
});

export default Categories;
