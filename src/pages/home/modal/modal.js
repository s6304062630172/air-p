import { useEffect, useState } from "react";
import { Button, Typography, Radio, Input } from "@material-tailwind/react";
// import Productdetail from "./product";

const Modal = ({
  productClick,
  returnCloseModal,
  statusModal,
  returnSubmitData,
}) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    needDate: "",
    timeStart: "",
    timeStop: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    return returnSubmitData(formData);
  };

  const onChangeQuantity = (status) => {
    if (status === "-") {
      setFormData({
        ...formData,
        quantity: formData?.quantity - 1,
      });
    } else {
      setFormData({
        ...formData,
        quantity: formData?.quantity + 1,
      });
    }
  };

  // const onChangeData = (event) => {
  //   setFormData({ ...formData, [event.target.name]: event.target.value });
  // };

  useEffect(() => {
    console.log("--->test")
    setFormData({
      ...productClick,
      quantity: 1,
      needDate: "",
      timeStart: "",
      timeStop: "",
    });
  }, [statusModal]);

  useEffect( ()=> {
    console.log("--->", productClick)
  }, [productClick] )

  // useEffect(() => {
  //   console.log("productClick ---> ", productClick);
  // }, []);
  return (
    <dialog id="modal" className="">
      <div className="justify-center space-x-5 space-y-5 mb-5 px-5 py-10 top-0">
        <div className="flex flex-row">
          <form method="dialog">
            {/* <button
            className="btn btn-lg  absolute right-2 top-2 bg-red-500 p-2"
            onClick={returnCloseModal}
          > */}
            <button
              className="rounded-full bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 absolute right-5 top-7"
              onClick={returnCloseModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">สั่งซื้อสินค้า</h3>
        </div>
        <div className="justify-center">
          <div className="relative justify-center bg-gray-100 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 h-full">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 py-10 justify-center">
                <img
                  src={productClick?.product_img}
                  className="object-cover w-96 h-full rounded-lg shadow-xl border-1 border-gray-200"
                  alt={productClick?.product_name}
                />
                <div className="bg-gray-100 h-full rounded-lg overflow-hidden border-1 border-gray-200">
                  <Typography variant="h4" className="font-bold px-5">
                    {productClick?.product_name}
                  </Typography>
                  <Typography color="gray" className="px-5">
                    {productClick?.product_detail}
                  </Typography>

                  <div className="flex justify-center items-center px-5">
                    <div className="flex gap-10">
                      <Radio name="type" label="เลือก BTU" />
                      <Radio name="type" label="คำนวณ BTU" defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Button className="bg-white rounded font-bold text-black text-lg hover:bg-gray-200">
                      {productClick?.product_btu}
                    </Button>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Button onClick={() => onChangeQuantity("-")}>-</Button>
                    <input
                      className="text-center w-16 sm:w-20 p-2 bg-white text-black text-sm rounded-lg bg-gray-100 border-1 border-gray-800"
                      value={formData.quantity}
                    />
                    <Button onClick={() => onChangeQuantity("+")}>+</Button>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Typography variant="h4" className="font-bold">
                      ราคา
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {productClick?.product_price?.toLocaleString()}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      บาท
                    </Typography>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Button
                      type="submit"
                      variant="gradient"
                      color="green"
                      className="flex justify-center gap-3 text-white text-sm"
                    >
                      สั่งซื้อสินค้า
                      <svg
                        className="w-6 h-6 text-gray-100 dark:text-white "
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
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7h-1M8 7h-.7M13 5v4m-2-2h4"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
