/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView, Text, Image
} from "react-native";
import { useRoute } from "@react-navigation/native";
// @ts-ignore
import cheerio from "react-native-cheerio";
import Icon from "react-native-vector-icons/FontAwesome";
import Speech from "../components/elements/Speech";
import { useDispatch } from "react-redux";
import { saveViewed } from "../ReduxStore/Action";
import { useSelector } from "react-redux";
// @ts-ignore
import VideoPlayer from "react-native-video-player";

function content(htmlContent: string): Array<{ p?: string; url?: string; desc?: string }> {
  const $ = cheerio.load(htmlContent, { decodeEntities: false });

  const transformedContent: Array<{ p?: string; url?: string; desc?: string; video?: string; videodesc?: string }> = [];

  let lastElementWasImage = false;
  let lastElementWasVideo = false;

  $("p, img, div[type='VideoStream']").each((_index: any, element: any) => {
    if ($(element).is("p") && !lastElementWasImage && !lastElementWasVideo) {
      transformedContent.push({ p: $(element).text() });
      lastElementWasImage = false;
    } else if ($(element).is("img")) {
      transformedContent.push({ url: $(element).attr("src") || "" });
      lastElementWasImage = true;
    } else if (lastElementWasImage && $(element).is("p") && !lastElementWasVideo) {
      transformedContent.push({ desc: $(element).text() });
      lastElementWasImage = false;
    } else if ($(element).is("div[type='VideoStream']")) {
      transformedContent.push({ video: $(element).attr("data-vid") || "" });
      lastElementWasImage = true;
    } else if ($(element).is("p") && lastElementWasVideo && !lastElementWasImage) {
      transformedContent.push({ videodesc: $(element).text() || "" });
      lastElementWasImage = false;
    }
  });

  return transformedContent;
}


const Details: React.FC = (props: any) => {

  const route = useRoute();
  const { item } = route.params as {
    item: any
  };
  const [details, setDetails] = useState<any>({});
  const [paragraphContent, setParagraphContent] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userObj);
  useEffect(() => {
    if (item) {
      setDetails(item);
      // @ts-ignore
      setParagraphContent(content(item.content));
      if (props.screen !== "History")
        dispatch(saveViewed(item));
    }
  }, [dispatch, item, props.screen, user]);


  return (
    paragraphContent ?
      <View style={{ backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ minHeight: "100%" }}>
          <View style={{ paddingBottom: 0 }}>
            <Text style={{
              color: "black",
              fontWeight: "700",
              fontSize: 20,
              marginVertical: 20,
              marginHorizontal: 10
            }}>{details.title}</Text>
            <View style={{ alignItems: "center", marginBottom: 10, marginLeft: 10, flexDirection: "row" }}>
              <Icon color="black"
                    name={"user-circle"}
                    style={{ fontSize: 22, marginRight: 10 }} />
              <Text style={{
                color: "black",
                fontWeight: "500",
                fontSize: 13
              }}>{details.createdBy} | {details.createdDate.substring(0, details.createdDate.indexOf("T"))}</Text>
            </View>
            <View>
              { //@ts-ignore
                paragraphContent ? paragraphContent.map((item: any, index: any) => {
                  switch (Object.keys(item)[0]) {
                    case "p": {
                      return <Text
                        style={{ fontSize: 13, marginHorizontal: 10, marginBottom: 5, fontWeight: "500" }}
                        key={index}>{item.p.toString()}</Text>;
                    }
                    case "url": {
                      return <View key={index} style={{
                        alignItems: "center",
                        marginHorizontal: 20
                      }}><Image source={{ uri: item.url }}
                                style={{
                                  width: "90%",
                                  height: 200
                                }} resizeMode={"contain"} /></View>;
                    }
                    case "desc": {
                      return <Text
                        style={{
                          fontSize: 11,
                          marginHorizontal: 10,
                          marginVertical: 5,
                          fontWeight: "400",
                          fontStyle: "italic",
                          textAlign: "center"
                        }}
                        key={index}>{item.desc.toString()}</Text>;
                    }
                    case "video": {
                      return <View key={index} style={{
                        maxHeight: 300,
                        borderWidth: 1,
                        marginHorizontal: 15
                      }}><VideoPlayer
                        video={{ uri: "https://" + item.video }}
                        defaultMuted={false}
                        showDuration={true}
                      /></View>;
                    }
                    case "videodesc": {
                      return <Text
                        style={{
                          fontSize: 11,
                          marginHorizontal: 10,
                          marginVertical: 5,
                          fontWeight: "400",
                          fontStyle: "italic",
                          textAlign: "center"
                        }}
                        key={index}>{item.videodesc.toString()}</Text>;
                    }
                  }
                }) : ""}
            </View>
          </View>
        </ScrollView>
        <View style={{ position: "absolute", right: 0, bottom: 0, width: "100%", height: "100%" }}>
          <Speech context={paragraphContent} item={item} user={user} />
        </View>
      </View>
      : <View></View>
  );
};

export default Details;
