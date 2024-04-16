import { Typography, Select, Option } from "@material-tailwind/react";
import { Link } from "react-router-dom";
const options = ["One", "Two", "Three", "Four", "Five", "Six"];
const Barservice = ({ type, onSelectType, searchName }) => {
  return (
    <div className="bg-white top-0 mx-5">
      <div className="md:flex md:flex-row md:space-y-1 md:flex-wrap md:mb-2 w-full">
        <a href="#" className="px-3 py-1 font-bold text-gray-900 mr-2">
          Service
        </a>
        <a
          href="#"
          className="rounded-full bg-gray-300 px-3 py-1 flex items-center  font-bold text-gray-900 mr-2"
        >
          จองคิวล้าง
        </a>
        <a
          href="#"
          className="rounded-full bg-gray-300 px-3 py-1 flex items-center font-bold text-gray-900 mr-2"
        >
          จองคิวซ่อม
        </a>
        <Link
          to="/userquo"
          className="rounded-full bg-gray-300 px-3 py-1 flex items-center font-bold text-gray-900 mr-2"
        >
          ใบเสนอราคา
        </Link>
        
        <div className="flex justify-end mx-5 md:ml-auto">
          <input
            onChange={searchName}
            placeholder="ค้นหาสินค้า"
            type="text"
            className="w-full md:w-72 h-10 bg-gray-300 text-black text-sm right-0 rounded-full bg-gray-300 px-3 py-1 radius-mr-2"
          />
        </div>
      </div>

      <div className="flex flex-col rounded-lg bg-gray-100 p-3 my-5 md:mx-20 md:flex-row md:px-2">
        <button
          onClick={() => onSelectType("all")}
          className="bg-gray-300 w-full md:w-32 h-15 rounded-lg mb-2 p-2 hover:bg-gray-200 focus:ring-2 focus:ring-inset focus:ring-gray-600 mx-2 md:mx-5"
        >
          ทั้งหมด
        </button>
        {type.map((item, index) => (
          <button
            onClick={() => onSelectType(item.product_type_id)}
            className="bg-gray-300 w-full md:w-32 h-15 rounded-lg mb-2 p-2 hover:bg-gray-200 focus:ring-2 focus:ring-inset focus:ring-gray-600 mx-2 md:mx-5"
            key={index}
          >
            {item?.product_type_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Barservice;
