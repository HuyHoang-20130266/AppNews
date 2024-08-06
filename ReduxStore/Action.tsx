export const login = (data: any) => {
  return {
    type: "user/loginUser",
    payload: data
  };
};
export const init = (data: any) => {
  return {
    type: "init",
    payload: data
  };
};
export const logout = () => {
  return {
    type: "user/logout"
  };
};
export const saveViewed = (data: any) => {
  return {
    type: "viewed/add",
    payload: data
  };
};
export const removeAllViewed = () => {
  return {
    type: "viewed/removeAll",
    payload: null
  };
};
export const removeAllSaved = (data: any) => {
  return {
    type: "saved/removeAll",
    payload: data
  };
};

export const removeItem = (data: any) => {
  return {
    type: "viewed/removeItem",
    payload: data
  };
};

export const updateUser = (data: any) => {
  return {
    type: "user/update",
    payload: data
  };
};
export const addUser = (data: any) => {
  return {
    type: "user/add",
    payload: data
  };
};
export const deleteUser = (data: any) => {
  return {
    type: "user/delete",
    payload: data
  };
};


