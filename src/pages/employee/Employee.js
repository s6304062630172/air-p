import React from 'react'
import Axios from 'axios'
import { Add, Close } from "@mui/icons-material"
import { Button } from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import TextField from '@mui/material/TextField';
import "./employee.css";
import { Link } from 'react-router-dom'


export default function Employee() {


    const [visible, setvisible] = useState(false)
    const [employee_name, setemployee_name] = useState("");
    const [employee_surname, setemployee_surname] = useState("");
    const [employee_phone, setemployee_phone] = useState("");
    const [employee_position, setemployee_position] = useState("");
    const [employee_address, setemployee_address] = useState("");
    const [line, setline] = useState("");
    const [salary, setsalary] = useState("");
    const [team_number, setteam_number] = useState("");
    const [employeeList, setemployeeList] = useState([]);
    const [teams, setTeams] = useState([]);
    /////////pagination////////
    const [productsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(employeeList.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = employeeList.slice(indexOfFirstProduct, indexOfLastProduct);
    /////////////////////////////////////////////////////
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
    const getemployee = () => {
        Axios.get('http://localhost:3001/get/employee').then((response) => {
            setemployeeList(response.data);
        });

    }

    useEffect(() => {
        getemployee();
    }, []);

    const addEmployee = () => {
        if (employee_name == "" || employee_surname == "" || employee_phone == "" || employee_position == "" || employee_address == "" || line == "" || salary == "") {

        } else {
            Axios.post("http://localhost:3001/post/employee", {
                employee_name: employee_name,
                employee_surname: employee_surname,
                employee_phone: employee_phone,
                employee_position: employee_position,
                employee_address: employee_address,
                line: line,
                salary: salary,
                team_number: team_number,

            }).then(() => {

                setemployeeList([
                    ...employeeList,
                    {
                        employee_name: employee_name,
                        employee_surname: employee_surname,
                        employee_phone: employee_phone,
                        employee_position: employee_position,
                        employee_address: employee_address,
                        line: line,
                        salary: salary,
                        team_number: team_number,

                    },
                ]);

            });
        }
    };

    const deleteemployee = (employee_id) => {
        Axios.delete(`http://localhost:3001/delete/employee/${employee_id}`).then((response) => {
            setemployeeList(
                employeeList.filter((val) => {
                    return val.employee_id != employee_id;
                })
            )
        })

    }

    useEffect(() => {
        Axios.get('http://localhost:3001/teams')
            .then(response => {
                setTeams(response.data); 
            })
            .catch(error => {
                console.error('Error fetching teams data:', error);
            });
    }, []);

    return (
        <div className='h-screen w-screen bg-gray-100  overflow-auto p-8'>
            <div className=" flex flex-col space-y-4 mt-0 ml-0 mb-4">
                <label class="text-2xl font-semibold bg-gray-800 text-white px-4 py-2">ข้อมูลพนักงาน</label>
                <table className=" justify-center w-full overflow-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นามสกุล</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ทีม</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.map((val, key) => {
                            return (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">{val.employee_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{val.employee_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{val.employee_surname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{val.employee_position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{val.team_number}</td>
                                    <Link to={`/Editemployee/${val.employee_id}`} className="btn btn-dark">
                                        <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                            <line x1="16" y1="5" x2="19" y2="8" />
                                        </svg>
                                    </Link>
                                    <Link onClick={() => { deleteemployee(val.employee_id) }} className="btn btn-dark">
                                        <svg class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Link>


                                </tr>
                            )

                        })}

                    </tbody>
                </table>


                {/* <p className='add' onClick={() => setvisible(true)}> <Add />ADD</p> */}
                <Model id='Model' isOpen={visible}>

                    <h1>เพิ่ม </h1>
                    <p className='close' onClick={() => setvisible(false)}><Close /></p>
                    <form className='w-full' action="">
                        <div >
                            <div>
                                <p>ชื่อ</p>
                                <TextField required className='w-full' onChange={(event) => { setemployee_name(event.target.value) }} />
                            </div>
                            <div>
                                <p>นามสกุล</p>
                                <TextField className='w-full' required onChange={(event) => { setemployee_surname(event.target.value) }} />
                            </div>
                            <div>
                                <p>เบอร์โทรศัพท์</p>
                                <TextField className=' w-full' required onChange={(event) => { setemployee_phone(event.target.value) }} />
                            </div>
                            <div>
                                <p>ตำแหน่ง</p>
                                <select className='w-full border border-gray-400' required onChange={(event) => { setemployee_position(event.target.value) }}>
                                    <option selected value="">ระบุตำแหน่ง</option>
                                    <option value={"Intern"}>Intern</option>
                                    <option value={"mechanic"}>mechanic</option>
                                    <option value={"Admin"}>Admin</option>
                                </select>
                            </div>
                            <div>
                                <p>ที่อยู่</p>
                                <TextField className=' w-full' required onChange={(event) => { setemployee_address(event.target.value) }} />
                            </div>
                            <div>
                                <p>ไอดีไลน์</p>
                                <TextField className=' w-full' required onChange={(event) => { setline(event.target.value) }} />
                            </div>
                            <div>
                                <p>เงินเดือน</p>
                                <TextField className=' w-full' required onChange={(event) => { setsalary(event.target.value) }} />
                            </div>
                            <div>
                                <p>ทีม</p>
                                <select className='w-full border border-gray-400' required onChange={(event) => { setteam_number(event.target.value) }}>
                                    <option selected value="">เลือกทีม</option>
                                    {teams.map((team, index) => (
                                        <option key={index} value={team.team_number}>{team.team_number}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <Button onClick={addEmployee} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">เพิ่ม</Button>
                    </form>

                </Model>
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
        </div>
    )
}