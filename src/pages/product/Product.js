import React from 'react'
import { Delete, Edit, Add, Close, Update, FirstPage } from "@mui/icons-material"
import { Button } from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import Axios from 'axios'
import { Link } from 'react-router-dom'



function Product() {
  const [visible, setvisible] = useState(false)
  const [product_img, setproduct_img] = useState("");
  const [product_name, setproduct_name] = useState("");
  const [product_type_id, setproduct_type_id] = useState("");
  const [product_brand_id, setproduct_brand_id] = useState("");
  const [product_detail, setproduct_detail] = useState("");
  const [product_btu, setproduct_btu] = useState("");
  const [product_price, setproduct_price] = useState(0);
  const [product_quantity, setproduct_quantity] = useState(0);
  const [productList, setproductList] = useState([]);
  /////////pagination////////
  const [productsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(productList.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);
  //////////////////////////////////////////////////////

  const getproduct = () => {
    Axios.get('http://localhost:3001/product')
      .then((response) => {
        setproductList(response.data);
      }).catch(err => console.log(err))
  }
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email != "admin@gmail.com") {
      window.location = '/'
    } else {
    }
    getproduct();
  }, []);

  const addProduct = () => {
    if (product_name == "" || product_img == "" || product_type_id == "" || product_brand_id == "" || product_detail == "" || product_price == "" || product_quantity == "" || product_quantity == "") {

    } else {
      Axios.post("http://localhost:3001/create", {
        product_img: product_img,
        product_name: product_name,
        product_type_id: product_type_id,
        product_brand_id: product_brand_id,
        product_detail: product_detail,
        product_price: product_price,
        product_quantity: product_quantity,
        product_btu: product_btu
      }).then(() => {
        setproductList([
          ...productList,
          {
            product_img: product_img,
            product_name: product_name,
            product_type_id: product_type_id,
            product_brand_id: product_brand_id,
            product_detail: product_detail,
            product_price: product_price,
            product_quantity: product_quantity,
            product_btu: product_btu
          },
        ]);
      });
    }
  };
  const deleteproduct = (product_id) => {
    if (window.confirm("ต้องการลบสินค้าจริงหรือไม่")) {
      Axios.delete(`http://localhost:3001/delete/${product_id}`).then((response) => {
        setproductList(
          productList.filter((val) => {
            return val.product_id != product_id;
          })
        )
      })
    }
  }

  ///////////page///////////////////
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // อัปเดต currentPage เพื่อเปลี่ยนหน้า
  };
  // ฟังก์ชันสำหรับการเปลี่ยนหน้าไปยังหน้าก่อนหน้า
  const handlePreviousPage = () => {
    if (currentPage > 1) { // ตรวจสอบว่าหน้าปัจจุบันไม่ใช่หน้าแรก
      handlePageChange(currentPage - 1); // เรียกใช้ handlePageChange เพื่อเปลี่ยนหน้าไปยังหน้าก่อนหน้า
    }
  };

  // ฟังก์ชันสำหรับการเปลี่ยนหน้าไปยังหน้าถัดไป
  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) { // ตรวจสอบว่าหน้าปัจจุบันไม่ใช่หน้าสุดท้าย
      handlePageChange(currentPage + 1); // เรียกใช้ handlePageChange เพื่อเปลี่ยนหน้าไปยังหน้าถัดไป
    }
  };
  ///////////page///////////////////



  // function covertToBase64(e) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onload = () => {
  //     console.log(reader.result);
  //     setproduct_img(reader.result);
  //   };
  //   reader.onerror = error => {
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
          if (width > 1000) {
            height *= 1000 / width;
            width = 1000;
          }
        } else {
          if (height > 1000) {
            width *= 1000 / height;
            height = 1000;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // แปลงภาพใหม่ที่ลดขนาดแล้วเป็น Base64
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.6); // เปลี่ยน 'image/jpeg' เป็น 'image/png' หากต้องการภาพ PNG

        console.log(resizedBase64);

        // นำข้อมูล Base64 ไปใช้ต่อได้ตามที่ต้องการ
        setproduct_img(resizedBase64);

      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className='h-screen w-screen bg-gray-100  overflow-auto p-8'>
      <div className=" flex flex-col space-y-4 mt-0 ml-0 mb-4  ">
        <label class="text-2xl font-semibold bg-gray-800 text-white px-4 py-2">คลังสินค้า</label>
        <table className=" justify-center w-full   overflow-auto">
          <thead className="bg-gray-50">
            <tr className='justify-center'>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ไอดีสินค้า</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า / บริการ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูปภาพ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยี่ห้อ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BTU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((val, key) => {
              return (
                <tr style={{}}>
                  <td className="px-6 py-4 whitespace-nowrap">{val.product_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{val.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={val?.product_img}
                      alt="ui/ux review check"
                      style={{ width: '150px', height: '100px' }} // กำหนดขนาดรูปภาพเป็น 100x100 พิกเซล
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{val.product_type_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{val.product_brand_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{val.product_btu}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{val.product_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{val.product_quantity}</td>
                  <Link to={`/Editproduct/${val.product_id}`} type="button" className="bg-black text-white px-4 py-2 rounded" ><Edit /></Link>
                  <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" variant="outlined" color="error" onClick={() => { deleteproduct(val.product_id) }}><Delete /></button>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='justify-between flex '>
        <nav aria-label="Pagination" className="inline-flex -space-x-px rounded-md shadow-sm bg-gray-800 text-gray-100">
          <button type="button" className="inline-flex items-center px-2 py-2 text-sm font-semibold border rounded-l-md border-gray-700" onClick={handlePreviousPage}>
            <span className="sr-only">Previous</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </button>
          {pageNumbers.map((pageNumber, index) => (
            <button key={index} type="button" className={`inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700 ${currentPage === pageNumber ? 'bg-violet-400 text-gray-900' : ''}`} onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          ))}
          <button type="button" className="inline-flex items-center px-2 py-2 text-sm font-semibold border rounded-r-md border-gray-700" onClick={handleNextPage}>
            <span className="sr-only">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </button>
        </nav>
        <div>
        <Button type="button" onClick={() => setvisible(true)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5 ">ADD</Button>
        </div>
      </div>


















      {/* //////////////////////////////////////////modal ในการเพิ่มสินค้า////////////////////////////////////////////// */}

      <Model id='Model' isOpen={visible}>
        <div className="flex justify-between items-center mb-3">
          <h1 className='text-xl'>เพิ่ม </h1>
          <Button onClick={() => setvisible(false)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">กลับ</Button>
        </div>
        <form>
          <div>
            <p>รูปภาพสินค้า</p>
            <input className='border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200' required type="file" id="myFile" accept='img/*' name="filename" onChange={resizeAndConvertToBase64}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">ชื่อสินค้า</label>
            <input required type="text" class="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_name(event.target.value) }}></input>
          </div>
          <div>
            <p>ประเภทสินค้า</p>
            <select  className='border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200' required onChange={(event) => { setproduct_type_id(event.target.value) }}>
              <option value="">เลือกประเภท</option>
              <option value={"A1"}>แอร์ติดผนัง</option>
              <option value={"A2"} >แอร์แขวน</option>
              <option value={"A3"}>สี่ทิศทาง</option>
              <option value={"A4"}>แอร์ตั้งพื้น</option>
              <option value={"A5"}>ซ่อม</option>
              <option value={"A6"}>ล้าง</option>
            </select>
          </div>
          <div>
            <p>ยี่ห้อสินค้า</p>
            <select className='border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200' required onChange={(event) => { setproduct_brand_id(event.target.value) }}>
              <option selected value="">ระบุยี่ห้อ</option>
              <option value={"1"}>Daikin</option>
              <option value={"2"}>Carrier</option>
              <option value={"3"}>Panasonic</option>
              <option value={"4"}>Fujitsu</option>
              <option value={"5"}>LG</option>
              <option value={"6"}>Samsung</option>
              <option value={"7"}>Sharp</option>
              <option value={"8"}>Hitachi</option>
              <option value={"9"}>ซ่อม</option>
              <option value={"10"}>ล้าง</option>
            </select>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">รายละเอียดสินค้า</label>
            <input required type="text" class="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_detail(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">ราคาสินค้า</label>
            <input required type="text" class="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_price(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">จำนวนสินค้า</label>
            <input required type="text" class="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_quantity(event.target.value) }}></input>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">BTU</label>
            <input required type="text" class="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" id="formGroupExampleInput2" placeholder="" onChange={(event) => { setproduct_btu(event.target.value) }}></input>
          </div>

          <br></br>

          {/* <button class="btn btn-primary w-32 justify-end" onClick={addProduct}  type="submit">ADD</button> */}
          <button class="btn btn-primary w-32 justify-end" onClick={addProduct} > <Add />เพิ่มสินค้า</button>
        </form>
      </Model>
    </div>
  )
}

export default Product
