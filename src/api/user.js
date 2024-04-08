import Axios from "axios";

const config_authen = () => {
  return {
    "Content-Type": "application/json",
    headers: {},
  };
};
const username = localStorage.getItem("username");

export default {
  async getUser() {
    const apiLine = `${process.env.REACT_APP_API_URL}/userInfo`;
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
