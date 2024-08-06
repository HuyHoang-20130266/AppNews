/* eslint-disable prettier/prettier */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
global.Buffer = global.Buffer || require("buffer").Buffer;

import React from "react";
import Navigate from "./components/tabs/Navigate";
import { View } from "react-native";
import { store } from "./ReduxStore/Store";
import { Provider } from "react-redux";


function App(): JSX.Element {
  return (
    <Provider store={store}>
      <View style={{ minHeight: "100%", width: "100%" }}>
        <Navigate />
      </View>
    </Provider>
  );
}

export default App;
