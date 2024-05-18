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
    const [quotationList, setquotationList] = useState([]);
    /////////pagination////////
    const [productsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(quotationList.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = quotationList.slice(indexOfFirstProduct, indexOfLastProduct);

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


    //////////////////////////////////////////////////////
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
        handleCalculate(); // เรียกใช้ handleCalculate เมื่อมีการเปลี่ยนแปลงราคาสินค้า
    };

    const handleProductQuantityChange = (e, index) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            products: prevState.products.map((product, i) => i === index ? { ...product, quantity: value } : product),
        }));
        handleCalculate(); // เรียกใช้ handleCalculate เมื่อมีการเปลี่ยนแปลงราคาสินค้า
    };

    const [vat, setVat] = useState('');
    const [totalVat, setTotalVat] = useState('');

    const handleCalculate = () => {
        const newVat = formData.products.reduce((acc, product) => {
            return acc + (parseFloat(product.price) * parseFloat(product.quantity) * 7 / 100);
        }, 0);

        const newTotalVat = formData.products.reduce((acc, product) => {
            return acc + (parseFloat(product.price) * parseFloat(product.quantity));
        }, 0) + newVat;

        setFormData(prevState => ({
            ...prevState,
            vat: newVat.toFixed(2),
            total_vat: newTotalVat.toFixed(2)
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
                setVat('');
                setTotalVat('');
                loadData();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });

        // ปิด Modal
        setvisible(false);
    };

    //แสดงรายการ
    const loadData = () => {
        Axios.get('http://localhost:3001/get/quotation')
            .then(response => {
                setquotationList(response.data);
            })
            .catch(error => {
                console.error('Error fetching work status data:', error);
            });

    }
    useEffect(() => {
        loadData();
    }, []);
    //ลบ
    const deleteQuotation = (no_quotation) => {
        if (window.confirm("ต้องการลบใช่หรือไม่")) {
            Axios.delete(`http://localhost:3001/delete/quotation/${no_quotation}`).then((response) => {
                setquotationList(
                    quotationList.filter((item) => {
                        return item.no_quotation != no_quotation;
                    })
                )
            })
        }

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
        <div className='h-screen w-screen bg-gray-100  overflow-auto p-8'>
            <div className=" flex flex-col space-y-4 mt-0 ml-0 mb-4">
                <label class="text-2xl font-semibold bg-gray-800 text-white px-4 py-2">ใบเสนอราคา</label>
                <table className=" justify-center w-full overflow-y-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หัวข้อ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">{item.no_quotation}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.title_quotation}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(item.date_).toLocaleDateString('en-GB')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/Editquotation/${item.no_quotation}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <svg className="h-6 w-6 inline-block" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                            <line x1="16" y1="5" x2="19" y2="8" />
                                        </svg>
                                    </Link>
                                    <button onClick={() => deleteQuotation(item.no_quotation)} className="text-red-600 hover:text-red-900 mr-4">
                                        <svg className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <button onClick={() => { handleViewDetail(item) }} className="text-blue-600 hover:text-blue-900">
                                        <svg className="h-6 w-6 inline-block" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10v4l-3-2-3 2V10l3-2 3 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4v16h14V4m0 0l-7 8m7-8l-7 8" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                        <Button type="button" onClick={() => setvisible(true)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5 ">เพิ่ม</Button>
                    </div>
                </div>

                <Modal id='Model' isOpen={visible}>
                    <div className="flex justify-between items-center mb-3">
                        <h1>เพิ่ม</h1>
                        <Button onClick={() => setvisible(false)} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">กลับ</Button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title Quotation (หัวข้อใบเสนอราคา):</label>
                            <input type="text" className="form-control" name="title_quotation" value={formData.title_quotation} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Date(วันที่ขอ):</label>
                            <input type="date" className="form-control" name="date_" value={formData.date_} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>ID Tax User(เลขประจำตัวผู้เสียภาษี):</label>
                            <input type="text" className="form-control" name="id_tax_user" value={formData.id_tax_user} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>ID Tax Admin(เลขประจำตัวผู้เสียภาษี):</label>
                            <input type="text" className="form-control" name="id_tax_admin" value={formData.id_tax_admin} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Annotation(หมายเหตุ):</label>
                            <input type="text" className="form-control" name="annotation" value={formData.annotation} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Admin(เบอร์โทรร้านค้า):</label>
                            <input type="text" className="form-control" name="phone_admin" value={formData.phone_admin} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone User(เบอร์โทรผู้ขอใบเสนอราคา):</label>
                            <input type="text" className="form-control" name="phone_user" value={formData.phone_user} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Address User(ที่อยู่ผู้ขอใบเสนอราคา):</label>
                            <input type="text" className="form-control" name="address_user" value={formData.address_user} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email(อีเมลล์ผู้ขอใบเสนอราคา):</label>
                            <input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Product(สินค้าที่ต้องการ):</label>
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
                        <Button type="button" onClick={handleCalculate} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">คำนวณ</Button>
                        <div className="form-group">
                            <label>แสดงจำนวนภาษีมูลค่าเพิ่ม 7%:</label>
                            <input type="text" className="form-control" name="vat" value={formData.vat} onChange={handleChange} readOnly />
                        </div>
                        <div className="form-group">
                            <label>แสดงราคารวมมูลค่าภาษี:</label>
                            <input type="text" className="form-control" name="total_vat" onChange={handleChange} value={formData.total_vat} readOnly />
                        </div>
                        <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                    </form>
                </Modal>
                {/* หน้าต่างแสดงรายละเอียดใบเสนอราคา >*/}
                {selectedQuotation && (
                    <Modal isOpen={true}>
                        <div className="box" ref={pdfRef}>
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
                                    <p>วันที่:{new Date(selectedQuotation.date_).toLocaleDateString('en-GB')}</p>
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
                                        <th>ราคาทั้งหมด</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((val, index) => (
                                        <tr key={index}>
                                            <td>{val.product_name}</td>
                                            <td>{val.product_btu}</td>
                                            <td>{val.quantity}</td>
                                            <td>{val.price}</td>
                                            <td>{val.price * val.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <br></br>
                                <p>จำนวนภาษีมูลค่าเพิ่ม 7%: {selectedQuotation.vat} บาท</p>
                                <p>รวมเงินทั้งสิ้น: {selectedQuotation.total_vat} บาท</p>
                                <br></br>
                            </table>
                        </div>
                        <button onClick={() => setSelectedQuotation(null)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4">Back</button>
                        {/* เพิ่มปุ่มdownload  */}
                        <button onClick={downloadPDF} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Download PDF</button>
                    </Modal>


                )}
            </div>

        </div>
    )
}