import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import "./checkstatus.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Workstatus() {
    const [workStatusList, setWorkStatusList] = useState([]);
    const [employeeList, setEmployeelist] = useState([]);
    const navigate = useNavigate();
    const [team_number, setTeam_number] = useState("")
    /////////pagination////////
    const [productsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(workStatusList.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = workStatusList.slice(indexOfFirstProduct, indexOfLastProduct);
    //////////////////////////////////////////////////////
    
    const onLoadData = () => {
        Axios.get('http://localhost:3001/get/workstatus')
            .then(response => {
                setWorkStatusList(response.data);
            })
            .catch(error => {
                console.error('Error fetching work status data:', error);
            });

        console.log(workStatusList);
    }
    useEffect(() => {
        onLoadData();
    }, []);
    useEffect(() => {
        axios.get(`http://localhost:3001/employee`)
            .then(res => {
                setEmployeelist(res.data)

            })
            .catch(err => console.log(err));

    }, [])
    const handleNavigation = () => {
        navigate('/calendar');

    };

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
    const onChangeData = (e, ordering_id) => {
        const team_number = e.target.value;
        axios.put(`http://localhost:3001/up_team_ordering`, { team_number, ordering_id })
            .then(res => {
                if (res.data.updated) {
                    setTeam_number(team_number);
                    onLoadData();
                    console.log(team_number);

                } else {
                    alert("Not updated");
                }
            })
            .catch(error => {
                console.error("Error updating team number:", error);
                alert("Failed to update team number");
            });
    };


    return (

        <div class="text-gray-900 bg-gray-200 w-full">
            <div class="p-4 flex">
                <h1 class="text-3xl">
                    ข้อมูลตารางงาน
                </h1>
            </div>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4">จัดการงาน</button>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4" onClick={handleNavigation}>ปฏิทิน</button>

            <div className="ml-4 button-container">
                <Button color="dark" ripple="light" onClick={() => navigate('/Checkstatus/')} className="mr-2">รอตรวจสอบ</Button>
                <Button color="dark" ripple="light" onClick={() => navigate('/Workstatus/')} className="mr-2" >ดำเนินงาน</Button>
                <Button color="dark" ripple="light" onClick={() => navigate('/Workfinish/')} className="mr-2" >สำเร็จ</Button>
            </div>
            <div class="px-3 py-4 flex justify-center">
                <table class="w-full text-md bg-white shadow-md rounded mb-4">
                    <tbody>
                        <tr class="border-b">
                            <th class="text-left p-3 px-5">ใบสั่งซื้อ</th>
                            <th class="text-left p-3 px-5">เลขออเดอร์</th>
                            <th class="text-left p-3 px-5">ยูสเซอร์เนม</th>
                            <th class="text-left p-3 px-5">ประเภทงาน</th>
                            <th class="text-left p-3 px-5">สถานะงาน</th>

                            <th class="text-left p-3 px-5">เลือกทีม</th>
                            <th class="text-left p-3 px-5">วันที่</th>
                            <th class="text-left p-3 px-5">ช่วงเวลา</th>
                            <th></th>
                        </tr>
                        {currentProducts.map((item, index) => {
                            let dateString = new Date(item.date_book);
                            dateString.setDate(dateString.getDate() + 1);
                            let newDateString = dateString.toISOString().split('T')[0];
                            return (
                                <tr class="border-b hover:bg-orange-100 bg-gray-100" key={index}>
                                    <td class="p-3 px-5">{item.purchase_id} </td>
                                    <td class="p-3 px-5">{item.ordering_id} </td>
                                    <td class="p-3 px-5">{item.username} </td>
                                    <td class="p-3 px-5">{item.type}  </td>
                                    <td class="p-3 px-5">{item.work_status} </td>

                                    <td class="p-3 px-5">
                                        <select onChange={(event) => onChangeData(event, item.ordering_id)} class="bg-transparent">
                                            <option key={index} selected={item.team_number === ""} value="">เลือกทีม</option>
                                            <option key={index} selected={item.team_number === "1"} value="1">1</option>
                                            <option key={index} selected={item.team_number === "2"} value="2">2</option>
                                            <option key={index} selected={item.team_number === "3"} value="3">3</option>
                                        </select>
                                    </td>
                                    <td class="p-3 px-5"> {newDateString}</td>
                                    <td class="p-3 px-5"> {item.timestart_book + " -" + item.timestop_book}</td>
                                    <td class="p-3 px-5 flex justify-end">
                                        <Link to={`/Editworkstatus/${item.ordering_id}`} className="btn btn-dark">
                                            <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                                <line x1="16" y1="5" x2="19" y2="8" />
                                            </svg>
                                        </Link>



                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
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
        </div>
    );
}