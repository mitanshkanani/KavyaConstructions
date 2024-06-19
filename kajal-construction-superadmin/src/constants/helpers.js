export const isSuperAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user === "kajalconstruction@gmail.com";
};
