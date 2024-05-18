import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

export default function Viewfinish() {

    const { ordering_id } = useParams(); // เปลี่ยน purchase_id เป็น ordering_id
    const [work_status, setWorkStatus] = useState('');
    const [team_number, setTeamnumber] = useState('');
    const [username, setUsername] = useState('');
    const [type, setType] = useState('');
    const navigate = useNavigate();
    const [dataList, setDatalist] = useState([])
    useEffect(() => {
        Axios.get(`http://localhost:3001/Viewfinish/${ordering_id}`)
            .then(res => {
                setDatalist(res.data);

            })
            .catch(err => console.log(err));
    }, [ordering_id]);
    console.log(dataList);

    return (
        <div class="w-full h-full fixed overflow-auto">
            <div className="container mt-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 class="text-2xl font-bold text-gray-800">รายละเอียดงาน</h3>

                    <Button onClick={() => navigate('/workfinish')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                </div>
                <form>
                    {dataList.map((val, index) => {
                        return (

                            <div className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">เลขใบสั่งซื้อ:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="purchase_id" value={val.purchase_id} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">เลขใบออเดอร์:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="ordering_id" value={ordering_id} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">ประเภทงาน:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="type" value={val.type} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">สินค้า / บริการ:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.product_name} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">ชือ:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.name} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">สถานะงาน:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.work_status} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">ทีม:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.team_number} />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">ชื่อลูกค้า:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.name} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">ข้อมูลเพิ่มเติม:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.detail} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title-name" className="form-label">ข้อมูลเพิ่มเติม จากลูกค้า:</label>
                                    <input disabled type="text" className="form-control" id="ordering_id" name="product_name" value={val.detail_user} />
                                </div>
                             
                            </div>
                        )
                    })}

                </form>

            </div>

        </div>
    );
}
