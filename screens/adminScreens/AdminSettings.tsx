/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, useWindowDimensions} from "react-native";
import { logout } from "../../ReduxStore/Action";
import Icon from "react-native-vector-icons/FontAwesome";

const AdminSettings: React.FC = ({ navigation }: any) => {
  const { width: screenWidth } = useWindowDimensions();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const user = useSelector((state: any) => state.userObj);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentUser(user);
  }, [user, navigation]);

  const logOut = () => {
    dispatch(logout());
  };
  return (
    <View style={styles.container}>
      <View style={{
        marginBottom: 16
      }}>{currentUser === null ?
        <TouchableHighlight onPress={() => navigation.navigate("Login")} underlayColor="#400B96FF"
                            style={{
                              backgroundColor: "green",
                              width: 160,
                              height: 40,
                              justifyContent: "center",
                              borderRadius: 8,
                              marginLeft: 110
                            }}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 18 }}>{"Đăng nhập".toUpperCase()}</Text>
        </TouchableHighlight> :
        <View>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1
          }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft:20}}>
              <Icon name={"user-circle-o"} style={{ fontSize: 30, marginRight: 5 }} />
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                {currentUser.fullName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("UserProfile")}
              style={{ marginBottom: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "center", padding: 5 }}>
                <Icon name={"id-card"} size={25} color="blue" style={{ marginRight: 5 }} />
                <Text style={{ fontSize: 15, color: "blue" }}>Chỉnh sửa</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
            <View style={{
              marginTop: 15,
              backgroundColor: "red",
              width: "45%",
              height: 40,
              justifyContent: "center",
              borderRadius: 8
            }}>
              <TouchableHighlight
                onPress={() => logOut()}
                underlayColor="#400B96FF"
              >
                <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}>
                  {"Đăng xuất".toUpperCase()}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{
              marginTop: 15,
              backgroundColor: "black",
              width: "45%",
              height: 40,
              justifyContent: "center",
              borderRadius: 8
            }}>
              <TouchableHighlight
                onPress={() => {}}
                underlayColor="#400B96FF"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name={"qrcode"} size={25} color="white" style={{ marginLeft: 5, marginRight: 5 }} />
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 15 }}>
                    {"Lưu QR Đăng nhập".toUpperCase()}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16
  }
});

export default AdminSettings;
