export const currentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    console.log(user)
    if (!user) {
      return null;
    }
    return JSON.parse(user);                                                  
  }
};
