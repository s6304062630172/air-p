import React from 'react'
import Axios from 'axios'
import { Delete, Edit, Add, Close } from "@mui/icons-material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import TextField from '@mui/material/TextField';
import "./employee.css";
import { Link } from 'react-router-dom'


export default function Employee() {
    

    const [visible, setvisible] = useState(false)
    const [employee_name ,setemployee_name] = useState("");
    const [employee_surname, setemployee_surname] = useState("");
    const [employee_phone, setemployee_phone] = useState("");
    const [employee_position, setemployee_position] = useState("");
    const [employeeList, setemployeeList] = useState([]);

    const getemployee = () => {
        Axios.get('http://localhost:3001/get/employee').then((response) => {
            setemployeeList(response.data);
        });

    }

    useEffect(() => {
        getemployee();
    }, []);

    const addEmployee = () => {
        if (employee_name == "" || employee_surname == "" || employee_phone == "" || employee_position == "") {

        } else {
            Axios.post("http://localhost:3001/post/employee", {
              employee_name: employee_name,
              employee_surname: employee_surname,
              employee_phone: employee_phone,
              employee_position: employee_position
            }).then(() => {

                setemployeeList([
                    ...employeeList,
                    {
                      employee_name: employee_name,
                      employee_surname: employee_surname,
                      employee_phone: employee_phone,
                      employee_position: employee_position
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
                                <Link to={`/Editemployee/${val.employee_id}`} type="button" class="btn btn-dark" ><Edit /></Link>
                                <button type="button" class="btn btn-danger" variant="outlined" color="error" onClick={() => { deleteemployee(val.employee_id) }}><Delete /></button>

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
                    </div>
            
                    <button onClick={addEmployee} class="btn btn-primary" type="submit">ADD</button>
                </form>
               
              
            </Model>
        </div>


    )
}