import Axios from "axios";

const config_authen = () => {
  return {
    "Content-Type": "application/json",
    headers: {},
  };
};
const email = localStorage.getItem("email");
export default {
  ///ดึงproduct จาก table product//
  async getProduct() {
    const apiLine = `http://localhost:3001/product`;
    const response = await Axios.get(apiLine, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },
  ///ดึง product type ///
  async getProductType() {
    const apiLine = `http://localhost:3001/product_type`;
    const response = await Axios.get(apiLine, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },
//บันทึกการสั่งสินค้า//
  async buyProduct(params) {
    const apiLine = `http://localhost:3001/buy-product`;
    const config = {
      ...config_authen(),
      maxContentLength: Infinity // กำหนดขนาดสูงสุดของ payload เป็น Infinity เพื่อให้สามารถส่งข้อมูลขนาดใหญ่ได้
    };
    const response = await Axios.post(apiLine, params, config)
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },

  async cart(params) {
    const apiLine = `http://localhost:3001/cart`;
    const response = await Axios.post(apiLine, params, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },
  
  async getCart(params) {
    const apiLine = `http://localhost:3001/getcart/${email}`;
    const response = await Axios.get(apiLine, params, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },

  async deleteCart(email) {
    const apiLine = `http://localhost:3001/deletecart/${email}`;
    const response = await Axios.delete(apiLine, config_authen())
      .then(async (res) => {
        return await res.data;
      })
      .catch(async (error) => {
        return await error;
      });
    return await response;
  },
};
