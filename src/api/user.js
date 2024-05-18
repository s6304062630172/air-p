import Axios from "axios";

const config_authen = () => {
  return {
    "Content-Type": "application/json",
    headers: {},
  };
};
const username = localStorage.getItem("username");

export default {
  async getUser(username) {
    const apiLine = `http://localhost:3001/userInfo/${username}`;
    const response = await Axios.get(apiLine, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },

};
