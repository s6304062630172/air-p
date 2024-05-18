import { useEffect, useState } from "react";
import Barservice from "./barservice";
import Promote from "./promote";
import Typeproduct from "./typeproduct";
import _apiProduct from "../../api/product";
import _apiUser from "../../api/user";
import Modal from "./modal/modal";
import { onBuyProduct, onGetProductCart } from "../../helpers/storage";
import { Badge } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Quo_modal from "./modal/quo_modal";
import CalculateBTU from "./modal/calculateBTU"
import axios from "axios";
import { Calculate } from "@mui/icons-material";
const Home = () => {
  const [userList, setuserList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productListOriginal, setProductListOriginal] = useState([]);
  const [productClick, setProductClick] = useState([]);
  const [statusModal, setStatusModal] = useState(false);
  const [BTU_statusModal, setBTU_statusModal] = useState(false);
  const [quo_statusModal, setQuo_statusModal] = useState(false);
  const [type, setType] = useState([]);
  const [itemCart, setItemCart] = useState(0);
  const username = localStorage.getItem("username"); // แทนที่ด้วยชื่อผู้ใช้ที่ต้องการดึงข้อมูล
  const email = localStorage.getItem("email")
  ///////////////เช็คauth////////////////////////////
/////////////////////////////////////////////////////
  const onLoadData = async () => {
    const userinfomation = await _apiUser.getUser(username);
    const result = await _apiProduct.getProduct();
    const resultType = await _apiProduct.getProductType();
    setProductList(result);
    setProductListOriginal(result);
    setType(resultType);
    setuserList(userinfomation);
  };

  const onShowModal = (product) => { // product ที่รับมาจาก typeproduct ที่เลือก 
    setProductClick(product); 
    setStatusModal(true);
    // console.log("productClick");
    // console.log("--->", document.getElementById("modal-A"));
    document.getElementById("modal").showModal();
  };
  const returnCloseModal = () => {
    setStatusModal(false);
    document.getElementById("modal").close();
  };
///BTU modal
  const onShowBTUModal = () =>{
    setBTU_statusModal(true);
    document.getElementById("BTU_modal").showModal();
    
  }
  const returnCloseBTUModal =()=>{
    setBTU_statusModal(false);
    document.getElementById("BTU_modal").close();
  }
//quo _ modal
const onShowquoModal = () =>{
  setQuo_statusModal(true);
  document.getElementById("quo_modal").showModal();
  
}
const returnClosequoModal =()=>{
  setQuo_statusModal(false);
  document.getElementById("quo_modal").close();
}

  const returnSubmitData = async (formData) => {
    const formData_add_email = Object.assign({}, formData, { email: email });
    console.log("formData_add_email",formData_add_email)
    await _apiProduct.cart(formData_add_email);
    const productCart = onGetProductCart();
    if (productCart === null) {
      onBuyProduct([formData]);
    } else { //ถ้ามีสินค้าอยู่แล้ว
      const setData = [...productCart, formData]; //ให้เพิ่มข้อมูลใน productCart ด้วย formdata
      setItemCart(setData?.length || 0);
      onBuyProduct(setData); //เพิ่มสินค้าลง localstorage
    }
    setStatusModal(false);
    document.getElementById("modal").close();
  };
  const onSelectType = (typeID) => {
    if (typeID == "all") {
      setProductList(productListOriginal);
    } else {
      const result = productListOriginal?.filter(
        (item) => item?.product_type_id === typeID
      );
      setProductList(result);
    }
  };

  const onSearchName = (event) => {
    if (event.target.value === "") {
      setProductList(productListOriginal);
    } else {
      const result = productListOriginal?.filter((item) =>
        item?.product_name.includes(event.target.value)
      );
      setProductList(result);
    }
  };



  useEffect(() => {
    onLoadData();
    const productCart = onGetProductCart();
    setItemCart(productCart?.length || 0);
  }, []);
  return (
    <>
      <Link to="/" id="cart"></Link>
      <div className="md:flex justify-center mb-3 h-96 top-0">
        <Promote productListOriginal={productListOriginal} />
      </div>
      <Barservice
        type={type}
        onSelectType={onSelectType}
        searchName={onSearchName}
        onShowBTUModal={onShowBTUModal}
        returnCloseBTUModal ={returnCloseBTUModal}
        onShowquoModal={onShowquoModal}
        returnClosequoModal={returnClosequoModal}



      />
      <div className="flex flex-wrap justify-center md:justify-start mr-5 mb-10 md:gap-5 gap-2 px-5 md:mx-10">
        {productList.map((item, index) => (
          <Typeproduct product={item} key={index} onShowModal={onShowModal} />
        ))}
      </div>
      <Modal //กดเข้า Modal
        productClick={productClick || {}}
        returnCloseModal={returnCloseModal}
        statusModal={statusModal}
        returnSubmitData={returnSubmitData}
      ></Modal>
   
       <Quo_modal 
        quo_statusModal={quo_statusModal}
        returnClosequoModal={returnCloseBTUModal}
      ></Quo_modal>
       <CalculateBTU 
        BTU_statusModal={BTU_statusModal}
        returnCloseBTUModal={returnCloseBTUModal}
      ></CalculateBTU>
      <div className="flex justify-end sticky bottom-0 right-0 mr-5 mb-2 md:gap-5 gap-2 px-5 md:mx-20 py-5">
        <Badge content={itemCart} className="w-10 h-10"> 
          <button
            onClick={() => document.getElementById("cart").click()}
            className="rounded-full bg-red-900 hover:bg-red-700 font-bold py-2 px-4 h-16 w-16"
          >
            <svg
              className="w-8 h-8 text-white text-center"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7H7.3"
              />
            </svg>
          </button>
        </Badge>
      </div>
    </>
  );
};

export default Home;
