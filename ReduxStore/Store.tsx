import root from "./RootReducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: root,
  middleware: (getDefaultMidleware) => getDefaultMidleware({
    immutableCheck: false,
    serializableCheck: false
  })
});
