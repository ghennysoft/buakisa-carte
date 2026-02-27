export const currentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  }
  return null;
};
