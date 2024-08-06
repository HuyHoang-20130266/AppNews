import AsyncStorage from "@react-native-async-storage/async-storage";

const initState: any = {
  userObj: null,
  viewedlist: [],
  reloadBookmark: false
};
const root = (state = initState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case "init": {
      return {
        ...state,
        userObj: action.payload.userObj,
        viewedlist: action.payload.viewedlist
      };
    }
    case "user/loginUser": {
      const loged = action.payload;
      AsyncStorage.setItem("userObj", JSON.stringify(action.payload))
        .then(() => {
          console.log("Successfully saved userObj");
        })
        .catch((err) => {
          console.log("Error saving userObj: ", err);
        });
      return {
        ...state,
        userObj: loged
      };
    }
    case "user/logout": {
      const newUser = null;
      AsyncStorage.removeItem("userObj")
        .then(() => {
          console.log("Successfully removed userObj");
        })
        .catch((err) => {
          console.log("Error removing userObj: ", err);
        });
      return {
        ...state,
        userObj: newUser
      };
    }
    case "viewed/add": {
      if (state.viewedlist !== undefined && state.viewedlist.findIndex((itemList: any) => itemList.id === action.payload.id) < 0) {
        const addedList = [
          ...state.viewedlist,
          action.payload
        ];
        AsyncStorage.setItem("viewed", JSON.stringify(addedList)).then(() => {
          console.log("Successfully added");
        })
          .catch((err) => {
            console.log("Error removing viewed: ", err);
          });
        return {
          ...state,
          viewedlist: addedList
        };
      }
      return {
        ...state
      };
    }
    case "viewed/removeItem": {
      const removed = state.viewedlist.filter((item: any) => item.id !== action.payload.id);
      AsyncStorage.setItem("viewed", JSON.stringify(removed)).then(() => {
        console.log("Successfully removed item");
      })
        .catch((err) => {
          console.log("Error removing viewed: ", err);
        });
      return {
        ...state,
        viewedlist: removed
      };
    }
    case "viewed/removeAll": {
      const deleted: never[] = [];
      AsyncStorage.setItem("viewed", JSON.stringify(deleted))
        .then(() => {
          console.log("Successfully removed");
        })
        .catch((err) => {
          console.log("Error removing: ", err);
        });
      return {
        ...state,
        viewedlist: deleted
      };
    }
    case "saved/removeAll": {
      return {
        ...state,
        reloadBookmark: action.payload
      };
    }
    default:
      return state;
  }
};

export default root;
