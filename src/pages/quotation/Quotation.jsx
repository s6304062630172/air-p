import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Select from 'react-select';
import { Button } from "@material-tailwind/react";
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import "./quotation.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



export default function Quotation() {
    const [formData, setFormData] = useState({
        title_quotation: '',
        date_: '',
        id_tax_user: '',
        id_tax_admin: '',
        annotation: '',
        phone_admin: '',
        phone_user: '',
        address_user: '',
        email: '',
        total_vat: '',
        vat: '',
        products: [],
    });

    const [productOptions, setProductOptions] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [visible, setvisible] = useState(false)

    useEffect(() => {
        Axios.get('http://localhost:3001/selectproduct')
            .then(res => {
                setProductOptions(res.data.map(product => ({
                    value: product.product_id,
                    label: product.product_name
                })));
            })
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProductChange = (selectedOptions) => {
        setSelectedProducts(selectedOptions);
    };

    const handleAddProductClick = () => {
        setFormData({
            ...formData,
            products: selectedProducts.map(product => ({
                product_id: product.value,
                price: '',
                quantity: '',
            })),
        });
    };

    const handleProductPriceChange = (e, index) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            products: prevState.products.map((product, i) => i === index ? { ...product, price: value } : product),
        }));
    };

    const handleProductQuantityChange = (e, index) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            products: prevState.products.map((product, i) => i === index ? { ...product, quantity: value } : product),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/quotation/create', formData)
            .then(() => {
                alert('Quotation added successfully');
                setFormData({
                    title_quotation: '',
                    date_: '',
                    id_tax_user: '',
                    id_tax_admin: '',
                    annotation: '',
                    phone_admin: '',
                    phone_user: '',
                    address_user: '',
                    email: '',
                    total_vat: '',
                    vat: '',
                    products: [],
                });
                setSelectedProducts([]);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    };
    //แสดงรายการ
    const [quotationList, setquotationList] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:3001/get/quotation')
            .then(response => {
                setquotationList(response.data);
            })
            .catch(error => {
                console.error('Error fetching work status data:', error);
            });
    }, []);
    //ลบ
    const deleteQuotation = (no_quotation) => {
        Axios.delete(`http://localhost:3001/delete/quotation/${no_quotation}`).then((response) => {
            setquotationList(
                quotationList.filter((item) => {
                    return item.no_quotation != no_quotation;
                })
            )
        })
    }
    //ดูข้อมูล

    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [products, setProducts] = useState([]);

    const handleViewDetail = async (quotation) => {
        setSelectedQuotation(quotation);
        try {
            const response = await fetch(`http://localhost:3001/quotation_detail/${quotation.no_quotation}`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };
    //เพิ่ม pdf
    const pdfRef = useRef();

    //ดาวน์โหลด pdf
    const downloadPDF = () => {
        const input = pdfRef.current;

        // ให้ html2canvas แปลงส่วนที่ต้องการสร้างเป็นรูปภาพ
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");

            // สร้างเอกสาร PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - (imgWidth * ratio)) / 2;
            const imgY = 30;

            // เพิ่มรูปภาพลงในเอกสาร PDF
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

            // ดาวน์โหลดไฟล์ PDF
            pdf.save('quotation.pdf');
        });
    };
    return (
        <div>
            <h3>Quotation manage</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Title</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {quotationList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.no_quotation}</td>
                            <td>{item.title_quotation}</td>
                            <td>{item.date_}</td>
                            <Link to={`/Editquotation/${item.no_quotation}`} className="btn btn-dark">
                                <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                    <line x1="16" y1="5" x2="19" y2="8" />
                                </svg>
                            </Link>
                            <Link onClick={() => deleteQuotation(item.no_quotation)} className="btn btn-dark">
                                <svg class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </Link>
                            <Link onClick={() => { handleViewDetail(item) }} className="btn btn-dark">
                                <svg class="h-6 w-6 text-slate-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                                    <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
                            </Link>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Button type="button" onClick={() => setvisible(true)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">ADD</Button>
            <Modal id='Model' isOpen={visible}>
                <div className="flex justify-between items-center mb-3">
                    <h1>ADD </h1>
                    <Button onClick={() => setvisible(false)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title Quotation:</label>
                        <input type="text" className="form-control" name="title_quotation" value={formData.title_quotation} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date" className="form-control" name="date_" value={formData.date_} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>ID Tax User:</label>
                        <input type="text" className="form-control" name="id_tax_user" value={formData.id_tax_user} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>ID Tax Admin:</label>
                        <input type="text" className="form-control" name="id_tax_admin" value={formData.id_tax_admin} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Annotation:</label>
                        <input type="text" className="form-control" name="annotation" value={formData.annotation} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Admin:</label>
                        <input type="text" className="form-control" name="phone_admin" value={formData.phone_admin} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone User:</label>
                        <input type="text" className="form-control" name="phone_user" value={formData.phone_user} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address User:</label>
                        <input type="text" className="form-control" name="address_user" value={formData.address_user} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Product:</label>
                        <Select
                            value={selectedProducts}
                            onChange={handleProductChange}
                            options={productOptions}
                            isMulti
                        />
                        <Button type="button" onClick={handleAddProductClick} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">เลือกจำนวนและราคา</Button>
                    </div>
                    {formData.products.map((product, index) => (
                        <div key={index}>
                            <div className="form-group">
                                <label>{`ราคา ชิ้นที่ ${index + 1}:`}</label>
                                <input type="text" className="form-control" name={`price_${index}`} value={product.price} onChange={(e) => handleProductPriceChange(e, index)} required />
                            </div>
                            <div className="form-group">
                                <label>จำนวน:</label>
                                <input type="text" className="form-control" name={`quantity_${index}`} value={product.quantity} onChange={(e) => handleProductQuantityChange(e, index)} required />
                            </div>
                        </div>
                    ))}
                    <div className="form-group">
                        <label>จำนวนภาษีมูลค่าเพิ่ม 7%:</label>
                        <input type="text" className="form-control" name="vat" value={formData.vat} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>ราคารวมมูลค่าภาษี:</label>
                        <input type="text" className="form-control" name="total_vat" value={formData.total_vat} onChange={handleChange} required />
                    </div>
                    <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                </form>
            </Modal>
            {/* หน้าต่างแสดงรายละเอียดใบเสนอราคา >*/}
            {selectedQuotation && (
                <Modal isOpen={true}>
                    <div className="box" ref={pdfRef} >
                        <h1 className="topic">ใบเสนอราคา</h1>
                        <div className="blocks-container">
                            <div className="block3">
                                <img className="logo" src={require("./st.png")} alt="โลโก้ร้าน" />
                                <p>363/137 ซอยพหลโยธิน 52 แยก24 ถนนพหลโยธิน </p>
                                <p>แขวงคลองถนนเขตสายไหม กรุงเทพฯ 10220</p>
                                <p>หมายเลขเสียภาษีของพนักงาน {selectedQuotation.id_tax_admin}</p>
                                <p>หมายเลขโทรศัพท์แอดมิน: {selectedQuotation.phone_admin}</p>
                                <br></br>
                                <p>ลูกค้า</p>
                                <p>ที่อยู่: {selectedQuotation.address_user}</p>
                                <p>หมายเลขเสียภาษีของลูกค้า: {selectedQuotation.id_tax_user}</p>
                                <p>หมายเลขโทรศัพท์ลูกค้า: {selectedQuotation.phone_user}</p>
                                <p>อีเมล์: {selectedQuotation.email}</p>
                            </div>

                            <div className="block4">
                                <p>เลขที่ใบเสนอราคา: {selectedQuotation.no_quotation}</p>
                                <p>ชื่องาน: {selectedQuotation.title_quotation}</p>
                                <p>วันที่: {selectedQuotation.date_}</p>
                                <p>หมายเหตุ: {selectedQuotation.annotation}</p>
                            </div>
                        </div>
                        <br></br>

                        <table className="detail">
                            <thead className='fig'>
                                <tr>
                                    <th>รายการ</th>
                                    <th>ขนาด BTU</th>
                                    <th>จำนวน</th>
                                    <th>ราคาต่อหน่วย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((val, index) => (
                                    <tr key={index}>
                                        <td>{val.product_name}</td>
                                        <td>{val.product_btu}</td>
                                        <td>{val.quantity}</td>
                                        <td>{val.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <br></br>
                            <p>จำนวนภาษีมูลค่าเพิ่ม 7%: {selectedQuotation.vat} บาท</p>
                            <p>รวมเงินทั้งสิ้น: {selectedQuotation.total_vat} บาท</p>
                            <br></br>
                        </table>
                    </div>

                    <Button onClick={() => setSelectedQuotation(null)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                    {/* เพิ่มปุ่มdownload  */}
                    <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
                </Modal>

            )}

        </div>
    )
}