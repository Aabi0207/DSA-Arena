// utils/Auth.js

export const saveUserToLocalStorage = (userData) => {
  const existingUser = JSON.parse(localStorage.getItem("user"));
  const expiryTime = existingUser?.expiryTime || (Date.now() + 6 * 7 * 24 * 60 * 60 * 1000); // 6 weeks

  localStorage.setItem("user", JSON.stringify({ ...userData, expiryTime }));
};
  
  export const getUserFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return null;
  
    if (Date.now() > user.expiryTime) {
      localStorage.removeItem("user");
      return null;
    }
    return user;
  };
  
  export const clearUserFromLocalStorage = () => {
    localStorage.removeItem("user");
  };
  