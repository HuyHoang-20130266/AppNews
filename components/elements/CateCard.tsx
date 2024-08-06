import { Dimensions, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowsHeight = Dimensions.get("window").height;

export function CateCard(props: any): React.JSX.Element {

  return (
    <TouchableNativeFeedback onPress={() => props.navigation.navigate("ListNews", { item: props.item })}>
      <View style={{
        width: (windowWidth - 20) / 2.15,
        height: (windowsHeight) / 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 3,
      }}>
        <Text style={{color: "black"}}>{props.item.name}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};
