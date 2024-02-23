import Axios from "axios";

const config_authen = () => {
  return {
    "Content-Type": "application/json",
    headers: {},
  };
};

export default {
  async getProduct() {
    const apiLine = `${process.env.REACT_APP_API_URL}/product`;
    const response = await Axios.get(apiLine, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },

  async getProductType() {
    const apiLine = `${process.env.REACT_APP_API_URL}/product_type`;
    const response = await Axios.get(apiLine, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },

  async buyProduct(params) {
    const apiLine = `${process.env.REACT_APP_API_URL}/buy-product`;
    const response = await Axios.post(apiLine, params, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },
};
