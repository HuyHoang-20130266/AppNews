// import React from "react";
import { StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CarouselCardItem, { ITEM_WIDTH } from "./CarouselCardItem";
import { data } from "./data";
import { getNewsFlashWithCate } from "../../apiCalls/getNewsFlashWithCate";
import React, { useEffect, useState } from "react";

const CarouselCards = (props : any) => {
  // const [index, setIndex] = React.useState(0);

  const [listData, setListData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarroulsel = async () => {
      const data = await getNewsFlashWithCate({
      id: props.item.id
      });
      setListData(data);
    };
    fetchCarroulsel();
  }, []);
  console.log(listData);
  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={ITEM_WIDTH}
        height={ITEM_WIDTH / 2}
        autoPlay={false}
        data={listData}
        style={{
          backgroundColor: "rgba(1,1,1,0)", paddingLeft: 2,
          paddingRight: 2
        }}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => <CarouselCardItem navigation={props.navigation} item={listData.at(index)} index={index} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 2,
    paddingRight: 2
  }
});

export default CarouselCards;
