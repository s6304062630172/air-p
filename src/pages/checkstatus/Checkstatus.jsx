import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import "./checkstatus.css";
import { Edit} from "@mui/icons-material"
import { Link } from 'react-router-dom';


export default function Checkstatus() {

    const [checkstatusList, setcheckstatusList] = useState([]);

    const getcheckstatus = () => {
        Axios.get('http://localhost:3001/get/checkstatus').then((response) => {
            setcheckstatusList(response.data);
        });

    }
    useEffect(() => {
        getcheckstatus();
    }, []);

    //อัพเดทสถานะของการฟิลเตอร์:
    const [filterStatus, setFilterStatus] = useState("all");

    const handleChangeFilterStatus = (status) => {
        setFilterStatus(status);
    };
    return (
        <div >
            <h3>รายการงาน</h3>
            <div className="button-container">
    <button onClick={() => handleChangeFilterStatus("all")}>ทั้งหมด</button>
    <button onClick={() => handleChangeFilterStatus("รอดำเนินการ")}>รอดำเนินการ</button>
    <button onClick={() => handleChangeFilterStatus("ชำระเสร็จสิ้น")}>ชำระเสร็จสิ้น</button>
    <button onClick={() => handleChangeFilterStatus("ชำระไม่สำเร็จ")}>ชำระไม่สำเร็จ</button>
            </div>
                    <table class="table table-striped">
                <thead>
                    <tr>
                        <th>เลขใบสั่งซื้อ</th>
                        <th>email</th>
                        <th>total</th>
                        <th>type</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    {checkstatusList.map((val, key) => {
                         if (filterStatus === "all" || val.payment_status === filterStatus) {
                        return (
                            <tr>
                                <td>{val.purchase_id}</td>
                                <td>{val.email}</td>
                                <td>{val.payment_amount}</td>
                                <td>{val.pay_type}</td>
                                <td>{val.payment_status}</td>
                                <Link to={`/Editcheckstatus/${val.purchase_id}`} type="button" class="btn btn-dark" ><Edit /></Link>
                                </tr>
        )
    } else {
        return null;
    }
})}
                </tbody>
            </table>
            </div>
    )
}