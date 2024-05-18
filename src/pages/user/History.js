import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function History() {
  const [datalist, setDatalist] = useState([]);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const gethistory = async () => {
    await axios.get(`http://localhost:3001/history/${email}`)
      .then(res => {
        setDatalist(res.data)
        console.log(res.data)

      })
      .catch(err => console.log(err));
  }
  useEffect(() => {
    gethistory();

  }, []);
  return (
    <section class="py-1 bg-blueGray-50">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div class="rounded-t mb-0 px-4 py-3 border-0">
            <div class="flex flex-wrap items-center">
              <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 class="font-semibold text-base text-blueGray-700">ประวัติการใช้บริการ</h3>
              </div>
              <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">

              </div>
            </div>
          </div>

          <div class="block w-full overflow-x-auto">
            <table class="items-center  bg-transparent w-full border-collapse ">
              <thead>
                <tr>
                  <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    เลขใบสั่งซื้อ
                  </th>
                  <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    วันที่สั่ง
                  </th>
                  <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    ราคารวมการสั่งซื้อ
                  </th>
                  <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    สถานะการชำระเงิน
                  </th>
                  <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  </th> 
                </tr>
              </thead>
              <tbody>
                {datalist.map((val, index) => {
                  let dateString = new Date(val.date);
                  dateString.setDate(dateString.getDate() + 1);
                  let newDateString = dateString.toISOString().split('T')[0];
                  return (
                    <tr>
                      <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {val.purchase_id}
                      </td>
                      <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {newDateString}
                      </td>
                      <td class="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {val.payment_amount}
                      </td>
                      <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  
                        {val.payment_status}
                      </td>
                      <td class=" border-t-0 px-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <Link to={`/usercheckstatus/${val.purchase_id}`}>
                        <button   class="px-4 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">ตรวจสอบสถานะงาน</button>
                        </Link>
                      </td>
                      
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <footer class="relative pt-8 pb-6 mt-16">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap items-center md:justify-between justify-center">
            <div class="w-full md:w-6/12 px-4 mx-auto text-center">

            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
