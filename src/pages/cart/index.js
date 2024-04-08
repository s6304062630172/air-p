import {
  Card,
  Typography,
  Radio,
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  onBuyProduct,
  onClearProductCart,
  onGetProductCart,
} from "../../helpers/storage"; //////import ตัวตั้งค่าใน local storage ในการจัดการข้อมูล
import _apiProduct from "../../api/product"; //import api ในการจัดการ prodcut
import axios from "axios";
const Cart = () => {
  const email = localStorage.getItem("email")
  const [productCart, setProductCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [formTotal, setFormTotal] = useState({
    email: email,
    pay_type: "banking",
    price: price
    
  });
  const [address, setAddress] = useState('')
  useEffect(() => {
    axios.get(`http://localhost:3001/userCalendar/${email}`)
        .then(res => {
            setAddress(res.data[0].address)
           
        })
        .catch(err => console.log(err))
}, [])



  const onLoadData = async () => {

    const result = onGetProductCart(); /// ใส่ค่า productที่อยู่ใน local storage มาใส่ไว้ใน result
    let sum = 0;
    for (let i = 0; i < result?.length; i++) { ///// loop ขนาด ของค่าใน result
      sum += result[i].product_price * result[i].quantity; ///////// เอาราคาสินค้าเเต่ละอันในreslut * กันจำนวน เพื่อ หาราคารวม
    }
    setPrice(sum);
    if (result !== null) { ////ถ้า result ไม่เป้นค่าว่าง
      setProductCart(result); ////ให้ใส่ค่าสินค้าที่อยู่ ใน result ไว้ใน array productCart
    }


  };


  const submit = async (event) => { /// เมื่อกดยืนยันคำสั่งซื้อ
    event.preventDefault();
    axios.put(`http://localhost:3001/updateAddress/${email}`, { address})

            .then(res => {
                if (res.data.updated) {
                  console.log(address)
                  
                } else {
                    alert("Not updated")
                }
            })
    const params = productCart;
    const setData = params.map((item) => {
      return { ...item, ...formTotal }; ///เอาข้อมูลใน param item = ข้อมูลสินค้าในตะกร้า //มารวมกับ ข้อมูลวันที่และเวลาใน FormTotal
    });
    const result = await _apiProduct.buyProduct(setData); /////บันทึกข้อมูลลง database โดยข้อมูลที่มีคือ ข้อมูลใน setData ซึ่งเป็น  params(ข้อมูลใน productcart) + formTotal(ค่าที่กำหดนมา)
    if (result == "success") {
      setProductCart([]);
      onClearProductCart();
      setPrice(0);
    }
  };

  const onChangeData = (event) => {
    // กำหนดค่าใหม่ให้กับ formTotal โดยใช้ Spread Operator เพื่อคัดลอกค่าเดิมใน formTotal แล้วเพิ่มหรืออัปเดตค่าใหม่
    setFormTotal({ ...formTotal, [event.target.name]: event.target.value }); //เมื่อเปลี่ยนค่า ให้ใส่ค่าใน formTotal name ด้วยใส่ค่า value ลงในตัวแปร name เเล้ว บันทึกค่าใหม่ลง FormTotal 
  };

  // const onChangeData = (value) => {
  //  setFormTotal({ ...formTotal, pay_type: value });
  //};

  // const onChangeSelectTime = (event) => {
  // if (event.target.val === "1") {
  //  setFormTotal({ ...formTotal, timeStart: "09:00", timeStop: "10:00" });
  // } else if (event.target.val === "2") {
  //  setFormTotal({ ...formTotal, timeStart: "11:00", timeStop: "12:00" });
  //  } else {
  //  setFormTotal({ ...formTotal, timeStart: "13:00", timeStop: "14:00" });
  //  }
  // };
  const onChangeSelectTime = (event) => {
    let selectedTime;
    if (event.target.value === "1") {
      selectedTime = { timeStart: "09:00", timeStop: "10:00" };
    } else if (event.target.value === "2") {
      selectedTime = { timeStart: "11:00", timeStop: "12:00" };
    } else {
      selectedTime = { timeStart: "13:00", timeStop: "14:00" };
    }

    setFormTotal({ ...formTotal, ...selectedTime, time: event.target.value }); /// ใส่ value time ใน formTotal เป็นค่าที่ได่รับมา จาก event
  };

  const onRemoveItem = (val) => {
    if (window.confirm("ต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่ ?") == true) {
      const productAll = productCart;

      const response = productAll.findIndex(
        (e) => e.product_id == val.product_id
      );
      productAll.splice(response, 1);
      const result = productAll;
      let sum = 0;
      for (let i = 0; i < result.length; i++) {
        sum += result[i].product_price * result[i].quantity;
      }
      setPrice(sum);
      onBuyProduct(result);
      setProductCart(result);
    }
  };
  useEffect(() => {
    onLoadData();
    setFormTotal({
      email: email,
      pay_type: "banking",
      price: price,
      type:"ติดตั้ง"
    });
  }, []);
  return (
    <div className="justify-center">
      <form onSubmit={submit}>
        <div className="flex flex-col justify-center mb-5 space-x-5 px-5 py-5 xl:px-80  px-10 py-10">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-medium text-xl font-bold px-2 py-2 text-left"
          >
            ตะกร้าสินค้า
          </Typography>
          <div className="lg:flex flex-col mb-10 px-5 py-5 flex flex-wrap bg-gray-100 rounded-lg shadow-xl">
            {productCart?.map((item, index) => (
              <div
                key={"a" + index}
                className="flex flex-col justify-center space-x-5 px-3 p-2 py-5 mb-5 bg-white w-full h-full rounded-lg shadow-xl border-1 border-gray-200"
              >
                <div className="relative">
                  <div className="absolute top-0 right-0 h-16 w-16">
                    <button
                      className="rounded-full bg-red-900 hover:bg-red-700 text-white text-center h-10 w-10 shadow-lg"
                      onClick={() => onRemoveItem(item)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 px-2 py-2 space-x-2 space-y-2">
                  <img
                    className="rounded-lg w-full object-cover"
                    src={item?.product_img}
                    alt="ui/ux review check"
                  />
                  <div className="flex flex-col px-3 justify-center">
                    <Typography
                      variant="h4"
                      color="blue-gray"
                      className="font-medium font-bold"
                    >
                      {" "}
                      {item?.product_name}
                    </Typography>
                    <div className="flex flex-col space-y-2">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-medium font-bold"
                      >
                        {" "}
                        ราคาสินค้า : {item?.product_price.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-medium font-bold"
                      >
                        {" "}
                        จำนวนสินค้า: {item?.quantity}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-medium font-bold"
                      >
                        {" "}
                        วันที่จอง:{item?.needDate}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-medium font-bold"
                      >
                        {" "}
                        เวลาที่จอง: {item?.timeStart} -  {item?.timeStop}
                      </Typography>
                    </div>

                  </div>

                </div>
                {/* <div className="flex flex-wrap justify-center space-x-5 space-y-1 mb-10 px-5">
                  <Typography
                    variant="h6"
                    className="justify-start font-bold px-2 p-2"
                  >
                    เลือกวันที่ต้องการ
                  </Typography>
                  <input
                    required
                    onChange={(e) => onChangeData(e)}
                    type="date"
                    name="needDate"
                    min={(new Date()).toISOString().split('T')[0]}
                    value={formTotal[index]?.needDate}
                    className="bg-gray-400 rounded-lg px-2 w-fit p-2 text-center text-gray-900"
                  />
                  <Typography
                    variant="h6"
                    className="justify-start font-bold px-2 p-2"
                  >
                    ช่วงเวลาติดตั้ง
                  </Typography>
                  <div className="w-72">
                    <select
                      required
                      className="outline outline-1 rounded-lg bg-white w-full px-3 py-2"
                      name="time"
                      onChange={(e) => onChangeSelectTime(e)}
                      value={formTotal.time ? formTotal.time : ""}
                    >
                      <option value="" disabled hidden>Choose a time</option>
                      <option value="1" selected={formTotal.time === "1"}>9.00-10.00</option>
                      <option value="2" selected={formTotal.time === "2"}>11.00-12.00</option>
                      <option value="3" selected={formTotal.time === "3"}>13.00-14.00</option>
                    </select>
                  </div>
                </div> */}

              </div>
            ))}

            <Typography
              variant="h6"
              className="justify-start font-bold px-2 p-2"
            >
              กรอกข้อมูล/ที่อยู่จัดส่ง
            </Typography>
            <div className="space-x-5 space-y-5 px-3 p-2 w-full">
              <textarea
                id="about"
                name="about"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={address}
                onChange={(event) => { setAddress(event.target.value) }}
              />
            </div>
            <div className="flex gap-10 mb-20 ">

              <Radio
                onChange={(e) => onChangeData(e)}
                //value={formTotal.pay_type}
                value="banking"
                name="pay_type" pay_type="red"
                label="Mobaile Banking QR Code"
                ripple={true}
                defaultChecked
                checked={formTotal.pay_type === "banking"}
                className={formTotal.pay_type === "banking" ? "ring ring-blue-500" : ""}
              />
              <Radio
                onChange={(e) => onChangeData(e)}
                name="pay_type" pay_type="red"
                label="เงินสด"
                value="cash"
                ripple={false}
                checked={formTotal.pay_type === "cash"}
                className={formTotal.pay_type === "cash" ? "ring ring-blue-500" : ""}
              />
            </div>
            <div className="flexpx-32 space-x-5 mb-10 px-0 p-5 relative justify-center bg-red-900 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 h-auto w-full py-5  space-y-0">
              <div className="justify-between mx-20 flex flex-wrap">
                <Typography
                  variant="h6"
                  className="justify-start font-bold text-white"
                >
                  ราคารวมทั้งสิ้น
                </Typography>
                <Typography
                  variant="h6"
                  className="justify-start font-bold text-white"
                >
                  {price.toLocaleString()} บาท
                </Typography>
              </div>
            </div>
            <div className="flex flex-wrap justify-end">
              {productCart.length > 0 && (
                <button
                  type="submit"
                  //   onClick={submit}
                  className="bg-blue-200 w-32 rounded-full mb-2 p-2 hover:bg-blue-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                >
                  สั่งซื้อสินค้า
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Cart;