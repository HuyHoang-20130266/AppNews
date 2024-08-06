import React from "react";
import {
  View,
  ScrollView, Text
} from "react-native";

const AboutUs: React.FC = () => {

  return (
    <View style={{ minHeight: "100%" }}>
      <ScrollView>
        <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 70 }}>
          <Text style={{color: 'black'}}>Một sản phẩm của nhóm sinh viên NLU.</Text>
          <Text style={{color: 'black'}}>Phục vụ cho việc hoàn thành môn học.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUs;
