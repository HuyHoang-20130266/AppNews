// import * as React from "react";
import { Dimensions, View } from "react-native";
import React, { useEffect, useState } from "react";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import FirstCarouselCardHome from "./FirstCarouselCardHome";
import { data } from "./data";
import { newsFlash } from "../../apiCalls/newsFlash";

const PAGE_WIDTH = Dimensions.get("window").width + 80;
const colors = [
  "#26292E",
  "#5becd8",
  "#a4cc38"
];

function CarouselParallax(props: any) {

  const [listData, setListData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarroulsel = async () => {
      const data = await newsFlash();
      setListData(data);
    };
    fetchCarroulsel();
  }, []);
  console.log(listData);
  const progressValue = useSharedValue<number>(0);
  const baseOptions =
    ({
      vertical: false,
      width: PAGE_WIDTH,
      height: PAGE_WIDTH * 0.6
    } as const);

  return (
    <View
      style={{
        alignItems: "center"
      }}
    >
      {listData ? <Carousel
        {...baseOptions}
        style={{
          width: PAGE_WIDTH
        }}
        loop
        pagingEnabled={true}
        snapEnabled={true}
        autoPlay={true}
        autoPlayInterval={3000}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50
        }}
        data={listData}
        renderItem={({ index }) => <FirstCarouselCardHome navigation={props.navigation} item={listData.at(index)} index={index} />}
      /> : <View></View>}
      {!!progressValue && (
        <View
          style={
            {
              flexDirection: "row",
              justifyContent: "space-between",
              width: 75,
              alignSelf: "center"
            }
          }
        >
          {colors.map((backgroundColor, index) => {
            return (
              <PaginationItem
                backgroundColor={backgroundColor}
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={false}
                length={colors.length}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const PaginationItem: React.FC<{
  index: number
  backgroundColor: string
  length: number
  animValue: Animated.SharedValue<number>
  isRotate?: boolean
}> = (props) => {
  const { animValue, index, length, backgroundColor, isRotate } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          )
        }
      ]
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: "white",
        width,
        height: width,
        borderRadius: 50,
        overflow: "hidden",
        transform: [
          {
            rotateZ: isRotate ? "90deg" : "0deg"
          }
        ]
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1
          },
          animStyle
        ]}
      />
    </View>
  );
};

export default CarouselParallax;