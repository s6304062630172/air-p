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
    const [subdistrict_id, setsubdistrict_id] = useState("");
    const [province_id, setprovince_id] = useState("");
    const [district_id, setdistrict_id] = useState("");
    const [employeeList, setemployeeList] = useState([]);
    const [teams, setTeams] = useState([]);
    const getemployee = () => {
        Axios.get('http://localhost:3001/get/employee').then((response) => {
            setemployeeList(response.data);
        });

    }

    useEffect(() => {
        getemployee();
    }, []);

    const addEmployee = () => {
        if (employee_name == "" || employee_surname == "" || employee_phone == "" || employee_position == "" || employee_address == "" || line == "" || salary == "" || team_number == "" || subdistrict_id == "" || province_id == "" || district_id == "") {

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
                subdistrict_id: subdistrict_id,
                province_id: province_id,
                district_id: district_id
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
                        subdistrict_id: subdistrict_id,
                        province_id: province_id,
                        district_id: district_id
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
                setTeams(response.data); // เปลี่ยนจาก setquotationList เป็น setTeams
            })
            .catch(error => {
                console.error('Error fetching teams data:', error);
            });
    }, []);

    return (
        <div >
            <h3>Employee manage</h3>

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>Surname</th>
                        <th>Position</th>

                    </tr>
                </thead>
                <tbody>
                    {employeeList.map((val, key) => {
                        return (
                            <tr>
                                <td>{val.employee_id}</td>
                                <td>{val.employee_name}</td>
                                <td>{val.employee_surname}</td>
                                <td>{val.employee_position}</td>
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

            <p className='add' onClick={() => setvisible(true)}> <Add />ADD</p>
            <Model id='Model' isOpen={visible}>
                <h1>ADD </h1>
                <p className='close' onClick={() => setvisible(false)}><Close /></p>
                <form className='form' action="">
                    <div className='block1'>
                        <div>
                            <p>Name</p>
                            <TextField id="outlined-basic" label="Name" variant="outlined" onChange={(event) => { setemployee_name(event.target.value) }} />
                        </div>
                        <div>
                            <p>Surname</p>
                            <TextField id="outlined-basic" label="Surname" variant="outlined" onChange={(event) => { setemployee_surname(event.target.value) }} />
                        </div>
                        <div>
                            <p>Phone</p>
                            <TextField id="outlined-basic" label="Phone" variant="outlined" onChange={(event) => { setemployee_phone(event.target.value) }} />
                        </div>
                        <div>
                            <p>Position</p>
                            <select required onChange={(event) => { setemployee_position(event.target.value) }}>
                                <option selected value="">ระบุตำแหน่ง</option>
                                <option value={"Intern"}>Intern</option>
                                <option value={"mechanic"}>mechanic</option>
                                <option value={"Admin"}>Admin</option>
                            </select>
                        </div>
                        <div>
                            <p>Address</p>
                            <TextField id="outlined-basic" label="Address" variant="outlined" onChange={(event) => { setemployee_address(event.target.value) }} />
                        </div>
                        <div>
                            <p>Line</p>
                            <TextField id="outlined-basic" label="Line" variant="outlined" onChange={(event) => { setline(event.target.value) }} />
                        </div>
                        <div>
                            <p>Salary</p>
                            <TextField id="outlined-basic" label="Salary" variant="outlined" onChange={(event) => { setsalary(event.target.value) }} />
                        </div>
                        <div>
                            <select required onChange={(event) => { setteam_number(event.target.value) }}>
                                <option selected value="">เลือกทีม</option>
                                {teams.map((team, index) => (
                                    <option key={index} value={team.team_number}>{team.team_number}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>subdistrict_id</p>
                            <TextField id="outlined-basic" label="subdistrict_id" variant="outlined" onChange={(event) => { setsubdistrict_id(event.target.value) }} />
                        </div>
                        <div>
                            <p>province_id</p>
                            <TextField id="outlined-basic" label="province_id" variant="outlined" onChange={(event) => { setprovince_id(event.target.value) }} />
                        </div>
                        <div>
                            <p>district_id</p>
                            <TextField id="outlined-basic" label="district_id" variant="outlined" onChange={(event) => { setdistrict_id(event.target.value) }} />
                        </div>
                    </div>
                    <Button onClick={addEmployee} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">เพิ่ม</Button>
                </form>
            </Model>
        </div>
    )
}