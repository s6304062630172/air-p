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
import payment from "../../img/d9dd63e9-7a02-4895-9aad-516e0619a167.jpg"
import axios from "axios";
const Cart = () => {

  const email = localStorage.getItem("email")
  const [productCart, setProductCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [formTotal, setFormTotal] = useState({
    email: email,
    pay_type: "banking",
    price: price,
    type: "ติดตั้ง",
    payment_img: "",
    banking: "",
  });
  const [address, setAddress] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:3001/editaddress/${email}`)
      .then(res => {
        setAddress(res.data[0].address)
      })
      .catch(err => console.log(err))
  }, [])
  const onLoadData = async () => {
    const cartData = await _apiProduct.getCart(); // รับข้อมูลตะกร้าสินค้าจาก API
    const convert = JSON.stringify(cartData);
    let result = JSON.parse(convert);

    // ทำการแก้ไขค่า needDate สำหรับทุกอ็อบเจกต์ใน result


    let sum = 0;
    for (let i = 0; i < result?.length; i++) {
      sum += result[i].product_price * result[i].quantity;
    }
    setPrice(sum);
    if (result !== null) {
      setProductCart(result);
    }
  };




  const submit = async (event) => { /// เมื่อกดยืนยันคำสั่งซื้อ
    const textareaValue = document.getElementById('about').value;
    if (textareaValue.trim().length === 0) {
      alert('กรุณากรอกที่อยู่');
      event.preventDefault(); // Prevent form submission
    } else {
      event.preventDefault();
      axios.put(`http://localhost:3001/updateAddress/${email}`, { address })

        .then(res => {
          if (res.data.updated) {
            console.log(address)
          } else {
            alert("Not updated")
          }
        })
      const params = productCart; //ข้อมูลที่มาจาก result
      const newData = params.map(({ product_img, ...rest }) => rest);
      const setData = newData.map((item) => {
        return { ...item, ...formTotal }; ///เอาข้อมูลใน param item = ข้อมูลสินค้าในตะกร้า //มารวมกับ ข้อมูลวันที่และเวลาใน FormTotal
      });
      const setData_new = setData.map((item, index) => {
        if (index !== 0) {
          return { ...item, payment_img: "" };
        }
        return item;
      });
      // เอา payment_img ออกจาก item และเก็บข้อมูลอื่น ๆ ไว้ในตัวแปร rest
      // รวมข้อมูลที่เหลือใน item กับ formTotal
      const result = await _apiProduct.buyProduct(setData_new);
      /////บันทึกข้อมูลลง database โดยข้อมูลที่มีคือ ข้อมูลใน setData ซึ่งเป็น  params(ข้อมูลใน productcart) + formTotal(ค่าที่กำหดนมา)
      if (result == "success") {
        await _apiProduct.deleteCart(email);
        setProductCart([]);
        onClearProductCart();
        setPrice(0);
        window.location = '/sucess'
      }

    }

  };

  const onChangeData = (event) => {
    // กำหนดค่าใหม่ให้กับ formTotal โดยใช้ Spread Operator เพื่อคัดลอกค่าเดิมใน formTotal แล้วเพิ่มหรืออัปเดตค่าใหม่
    setFormTotal({ ...formTotal, [event.target.name]: event.target.value }); //เมื่อเปลี่ยนค่า ให้ใส่ค่าใน formTotal name ด้วยใส่ค่า value ลงในตัวแปร name เเล้ว บันทึกค่าใหม่ลง FormTotal 
    console.log(formTotal);
  };

  // const onChangeData = (value) => {
  //  setFormTotal({ ...formTotal, pay_type: value });
  //};




  const onRemoveItem = (val) => {
    if (window.confirm("ต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่ ?") == true) {
      console.log(productCart)
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
      axios.delete(`http://localhost:3001/deletecartProduct/${val.cart_id}`).then((response) => {
      })
    }
  };

  // function covertToBase64(event){
  //   var reader = new FileReader();
  //   reader.readAsDataURL(event.target.files[0]);
  //   reader.onload = () => {
  //     console.log(reader.result);
  //     setFormTotal({ ...formTotal, [event.target.name]: reader.result });
  //   };
  //   reader.onerror = error =>{
  //     console.log("error: ", error);
  //   }
  // }
  function resizeAndConvertToBase64(event, maxWidth, maxHeight) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // กำหนดความกว้างและความสูงใหม่ของภาพตาม maxWidth และ maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // แปลงภาพใหม่ที่ลดขนาดแล้วเป็น Base64
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.5); // เปลี่ยน 'image/jpeg' เป็น 'image/png' หากต้องการภาพ PNG

        console.log(resizedBase64);

        // นำข้อมูล Base64 ไปใช้ต่อได้ตามที่ต้องการ
        setFormTotal({ ...formTotal, [event.target.name]: resizedBase64 });

      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  }



  useEffect(() => {
    onLoadData();
    setFormTotal({
      email: email,
      pay_type: "banking",
      price: price,
      type: "ติดตั้ง",
      payment_img: "",
      banking: "",
    });

  }, []);

  return (
    <div className="justify-center">
      <form >
        <div className="flex flex-col justify-center mb-5 space-x-5 px-5 py-5 xl:px-80  px-10 py-10">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-medium text-xl font-bold px-2 py-2 text-left"
          >
            ตะกร้าสินค้า
          </Typography>
          <div className="lg:flex flex-col mb-10 px-5 py-5 flex flex-wrap bg-gray-100 rounded-lg shadow-xl">
            {productCart?.map((item, index) => {
              let dateString = new Date(item.needDate);
              dateString.setDate(dateString.getDate() + 1);
              let newDateString = dateString.toISOString().split('T')[0];

              return (
                (
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
                            วันที่จอง:{newDateString}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="font-medium font-bold"
                          >
                            {" "}
                            เวลาที่จอง: {item?.timeStart_book} -  {item?.timeStop_book}
                          </Typography>
                        </div>

                      </div>

                    </div>

                  </div>
                )
              )
            })}
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

            <Typography
              variant="h6"
              className="justify-start font-bold px-2 p-2"
            >
              กรอกข้อมูล/ที่อยู่จัดส่ง
            </Typography>
            <div className="space-x-5 space-y-5 px-3 p-2 w-full">
              <textarea
                required
                id="about"
                name="about"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={address}
                onChange={(event) => { setAddress(event.target.value) }}
              />
            </div>
            <Typography
              variant="h4"
              className="justify-start font-bold px-2 p-2"
            >
              เลือกช่องทางการชำระเงิน
            </Typography>
            <div className="flex gap-10 mb-20 ">
              <Radio
                onChange={(e) => onChangeData(e)}
                //value={formTotal.pay_type}
                value="banking"
                name="pay_type" pay_type="red"
                label="Promptpay QR code"
                ripple={true}
                defaultChecked
                checked={formTotal.pay_type === "banking"}
                className={formTotal.pay_type === "banking" ? "ring ring-blue-500" : ""}
              />
              <Radio
                onChange={(e) => onChangeData(e)}
                name="pay_type" pay_type="red"
                label="เงินสด"
                value="เงินสด"
                ripple={false}
                checked={formTotal.pay_type === "เงินสด"}
                className={formTotal.pay_type === "เงินสด" ? "ring ring-blue-500" : ""}
              />
            </div>
            {formTotal.pay_type === "banking" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">โอนเงินได้ทาง QR CODE และส่งหลักฐานการชำระเงิน</h2>
                <img required src={payment} alt="Payment" className="mx-auto w-64 mb-4" />
                <input type="file" className="mb-2" name="payment_img" accept="image/*" onChange={(event) => resizeAndConvertToBase64(event, 500, 400)} />

                <select required name="banking" onChange={(e) => onChangeData(e)} className="mb-4 px-4 py-2 border rounded-md">
                  <option value="Bangkok Bank">ธนาคารกรุงเทพ</option>
                  <option value="Krungthai">ธนาคารกรุงไทย</option>
                  <option value="Krungsri">ธนาคารกรุงศรีอยุธยา</option>
                  <option value="KBank">ธนาคารกสิกรไทย</option>
                  <option value="KKP">ธนาคารเกียรตินาคิน</option>
                  <option value="Citibank">ธนาคารซิตี้แบงค์</option>
                  <option value="TISCO">ธนาคารทิสโก้ จำกัดมหาชน</option>
                  <option value="ttb">ธนาคารทหารไทย</option>
                  <option value="SCB">ธนาคารไทยพาณิชย์</option>
                  <option value="ธกส">ธนาคารเพื่อการเกษตร</option>
                  <option value="UOB">ธนาคารยูโอบี</option>
                  <option value="Mymo">ธนาคารออมสิน</option>
                </select>

              </div>

            )}


            <div className="flex flex-wrap justify-end">
              {productCart.length > 0 && (
                <button
                  onClick={submit}
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