import axios from 'axios';
// import { event } from 'jquery';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@material-tailwind/react";

export default function Editemployee() {
    
    const {employee_id} = useParams();
    const [employee_name,setemployee_name] = useState('')
    const [employee_surname, setemployee_surname] = useState('');
    const [employee_phone, setemployee_phone] = useState('');
    const [employee_position, setemployee_position] = useState('');
    const [employee_address, setemployee_address] = useState("");
    const [line, setline] = useState("");
    const [salary, setsalary] = useState("");
    const [team_number,setteam_number] = useState("");
    const [subdistrict_id ,setsubdistrict_id] = useState("");
    const [province_id,setprovince_id ] = useState("");
    const [district_id ,setdistrict_id] = useState("");
    const [teams, setTeams] = useState([]);
    useEffect(()=>{
        axios.get(`http://localhost:3001/Editemployee/${employee_id}`)
        .then(res => {
            setemployee_name(res.data[0].employee_name)
            setemployee_surname(res.data[0].employee_surname)
            setemployee_phone(res.data[0].employee_phone)
            setemployee_position(res.data[0].employee_position)
            setemployee_address(res.data[0].employee_address)
            setline(res.data[0].line)
            setsalary(res.data[0].salary)
            setteam_number(res.data[0].team_number)
            setsubdistrict_id(res.data[0].subdistrict_id)
            setprovince_id(res.data[0].province_id)
            setdistrict_id(res.data[0].district_id)

        })
        .catch(err => console.log(err))
   // Fetch teams from database
   axios.get('http://localhost:3001/teams')
   .then(res => {
       setTeams(res.data);
   })
   .catch(err => console.log(err));
}, [employee_id]);

    const navigate =  useNavigate();
    const select_position = employee_position
    const hanldeSubmit = (event) => {
        event.preventDefault();
        
        axios.put(`http://localhost:3001/updateemployee/${employee_id}` , { employee_name,employee_surname,employee_phone,employee_position,employee_address,line,salary,team_number,subdistrict_id,province_id,district_id }) 
        .then(res=>{
            if(res.data.updated){
                navigate('/employee')

            }else{
                alert("Not updated")
            }
        })
    }

    return (
        <div>


            <div class="container mt-5">
            <div className="flex justify-between items-center mb-3">
                <h1>แก้ไขข้อมูลพนักงาน</h1>
                <Button onClick={() => navigate('/Employee')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                </div>
                 <form onSubmit={hanldeSubmit}>
                    <div class="mb-3">
                        <label for="employee-name" class="form-label">ชื่อพนักงาน</label>
                        <input type="text" class="form-control" id="employee-name" name="name" value={employee_name} 
                        onChange={(event) => { setemployee_name(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="employee-surname" class="form-label">นามสกุลพนักงาน</label>
                        <input type="text" class="form-control" id="employee-surname" name="name" value={employee_surname} 
                        onChange={(event) => { setemployee_surname(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="employee-phone" class="form-label">เบอร์โทรศัพท์พนักงาน</label>
                        <input type="text" class="form-control" id="employee-phone" name="name" value={employee_phone} 
                        onChange={(event) => { setemployee_phone(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="employee-position" class="form-label">ระบุตำแหน่ง</label>
                        
                        <select onChange={(event) => { setemployee_position(event.target.value) }} >
                            
                            <option value="Intern" selected={select_position === 'Intern'}>Intern</option>
                            <option value="Mechanic" selected={select_position === 'Mechanic'}>Mechanic</option>
                            <option value="Admin" selected={select_position === 'Admin'}>Admin</option>
                        </select >
                    </div>
                    <div class="mb-3">
                        <label for="employee-address" class="form-label">ที่อยู่</label>
                        <input type="text" class="form-control" id="employee-address" name="name" value={employee_address} 
                        onChange={(event) => { setemployee_address(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="line" class="form-label">ไลน์</label>
                        <input type="text" class="form-control" id="line" name="name" value={line} 
                        onChange={(event) => { setline(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="salary" class="form-label">เงินเดือน</label>
                        <input type="text" class="form-control" id="salary" name="name" value={salary} 
                        onChange={(event) => { setsalary(event.target.value) }} />
                    </div>
                    <div>
                        <label htmlFor="title-name" className="form-label">ทีม</label>
                        <select onChange={(event) => setteam_number(event.target.value)}>
                            <option disabled selected value="">เลือกทีม</option>
                            {teams.map(team => (
                                <option key={team.team_id} value={team.team_number}>{team.team_number}</option>
                            ))}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="subdistrict" class="form-label">แขวง</label>
                        <input type="text" class="form-control" id="subdistrict" name="name" value={subdistrict_id} 
                        onChange={(event) => { setsubdistrict_id(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="province" class="form-label">จังหวัด</label>
                        <input type="text" class="form-control" id="province" name="name" value={province_id} 
                        onChange={(event) => { setprovince_id(event.target.value) }} />
                    </div>
                    <div class="mb-3">
                        <label for="district" class="form-label">เขต</label>
                        <input type="text" class="form-control" id="district" name="name" value={district_id} 
                        onChange={(event) => { setdistrict_id(event.target.value) }} />
                    </div>
         
                  
                    <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                </form>
            </div>




        </div>
    )
}