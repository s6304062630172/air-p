import "./quotation.css";
import React, { useRef } from 'react'
import Axios from 'axios'
import { Delete, Edit, Add, Close } from "@mui/icons-material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect } from 'react';
import Model from 'react-modal'
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



export default function Quotation() {
    
      //แสดงdropdown แบรนด์
      const [product_brand_name, setproduct_brand_name] = useState([]);
        useEffect(() => {
          fetchproduct_brand_name();
        }, []);
      
        const fetchproduct_brand_name = async () => {
          try {
            const response = await fetch('http://localhost:3001/product_brand');
            const data = await response.json();
            setproduct_brand_name(data);
          } catch (error) {
            console.error('Error fetching product brands:', error);
          }
        };

        //แสดงdropdown type
        const [productTypeNames, setProductTypeNames] = useState([]);

        useEffect(() => {
            fetchProductTypeNames();
        }, []);
    
        const fetchProductTypeNames = async () => {
            try {
                const response = await fetch('http://localhost:3001/product_type');
                const data = await response.json();
                setProductTypeNames(data);
            } catch (error) {
                console.error('Error fetching product types:', error);
            }
        };

   
  

   // const [selectedQuotation, setSelectedQuotation] = useState(null);
    // เพิ่มฟังก์ชัน handleViewDetail เพื่อแสดงรายละเอียดใบเสนอราคาที่เลือก
   // const handleViewDetail = (quotation) => {
   //     setSelectedQuotation(quotation);
   // };
    //เพิ่ม

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
    const [visible, setvisible] = useState(false)
    const [phone_admin, setphone_admin] = useState("");
    const [address_user, setaddress_user] = useState("");
    const [phone_user, setphone_user] = useState("");
    const [date_, setdate_] = useState("");
    const [title_quotation, settitle_quotation] = useState("");
    const [annotation, setannotation] = useState("");
    const [id_tax_user, setid_tax_user] = useState("");
    const [id_tax_admin, setid_tax_admin] = useState("");
    const [email, setemail] = useState("");
    const [product_id, setproduct_id]= useState("");
     const [product_name, setproduct_name]= useState("");
 
    const [quotation_product_brand, setquotation_product_brand] = useState([]);
    const [quotation_product_type, setquotation_product_type] = useState([]);
    const [quotationList, setquotationList] = useState([]);

    const getquotation = () => {
        Axios.get('http://localhost:3001/get/quotation').then((response) => {
            setquotationList(response.data);
        });

    }

    useEffect(() => {
        getquotation();
    }, []);


    const addQuotation = () => {
        if (phone_admin == "" || address_user == "" || phone_user == "" || date_ == "" || title_quotation == "" || annotation == "" || id_tax_user == "" || id_tax_admin == "" || email == ""|| quotation_product_type == "" || quotation_product_brand ==""|| product_id == "" ) {

        } else {
            Axios.post("http://localhost:3001/post/create", {
                phone_admin: phone_admin,
                address_user: address_user,
                phone_user: phone_user,
                date_: date_,
                title_quotation: title_quotation,
                annotation: annotation,
                id_tax_user: id_tax_user,
                id_tax_admin: id_tax_admin,
                email:email,
                product_id:product_id,
                quotation_product_type: quotation_product_type,
                quotation_product_brand: quotation_product_brand
            }).then(() => {

                setquotationList([
                    ...quotationList,
                    {
                        phone_admin: phone_admin,
                        address_user: address_user,
                        phone_user: phone_user,
                        date_: date_,
                        title_quotation: title_quotation,
                        annotation: annotation,
                        id_tax_user: id_tax_user,
                        id_tax_admin: id_tax_admin,
                        email:email,
                        product_id:product_id,
                        quotation_product_type: quotation_product_type,
                        quotation_product_brand: quotation_product_brand
                    },
                ]);
            });
        }
    };

    const deletequotation = (no_quotation) => {
        Axios.delete(`http://localhost:3001/delete/quotation/${no_quotation}`).then((response) => {
            setquotationList(
                quotationList.filter((val) => {
                    return val.no_quotation != no_quotation;
                })
            )
        })
    }
    return (
        <div >
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
                    {quotationList.map((val, key) => {
                        return (
                            <tr>
                                <td>{val.no_quotation}</td>
                                <td>{val.title_quotation}</td>
                                <td>{val.date_}</td>
                                <Link to={`/Editquotation/${val.no_quotation}`} type="button" class="btn btn-dark" ><Edit /></Link>
                                <button type="button" class="btn btn-danger" variant="outlined" color="error" onClick={() => { deletequotation(val.no_quotation) }}><Delete /></button>
                                <button type="button" class="btn btn-danger" variant="outlined" color="error" onClick={() => { handleViewDetail(val)}}><VisibilityIcon /></button>

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
                            <p>Title</p>
                            <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(event) => { settitle_quotation(event.target.value) }} />
                        </div>
                        <div>
                            <p>Date</p>
                            <TextField id="outlined-basic" label="Date" variant="outlined" onChange={(event) => { setdate_(event.target.value) }} />
                        </div>
                        <div>
                            <p>Address User</p>
                            <TextField id="outlined-basic" label="Address user" variant="outlined" onChange={(event) => { setaddress_user(event.target.value) }} />
                        </div>
                        <div>
                            <p>Email</p>
                            <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(event) => { setemail(event.target.value) }} />
                        </div>
                    </div>
                    <div className='block2'>
                        <div>
                            <p>Phone Admin</p>
                            <TextField id="outlined-basic" label="Phone Admin" variant="outlined" onChange={(event) => { setphone_admin(event.target.value) }} />
                        </div>
                        <div>
                            <p>Phone user</p>
                            <TextField id="outlined-basic" label="Phone user" variant="outlined" onChange={(event) => { setphone_user(event.target.value) }} />
                        </div>
                        <div>
                            <p>Id tax user</p>
                            <TextField id="outlined-basic" label="Id tax user" variant="outlined" onChange={(event) => { setid_tax_user(event.target.value) }} />
                        </div>
                        <div>
                            <p>Id tax Admin</p>
                            <TextField id="outlined-basic" label="Id tax Admin" variant="outlined" onChange={(event) => { setid_tax_admin(event.target.value) }} />
                        </div>
                        <div>
                            <p>Annotation</p>
                            <TextField id="outlined-basic" label="Annotation" variant="outlined" onChange={(event) => { setannotation(event.target.value) }} />
                        </div>
                        <div>
                    {/* เแสดง dropdown product_brand,product_type,product_name */}
                    <select>
                    <option value="">Select Brand</option>{product_brand_name.map((brand, index) => (
                    <option key={index} value={brand.product_brand_name}>{brand.product_brand_name}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                <select>
                <option value="">Select Type</option>
                {productTypeNames.map((type, index) => (
                    <option key={index} value={type.product_type_name}>{type.product_type_name}</option>
                ))}
                </select>
                </div>
                    </div>
                    <button onClick={addQuotation} class="btn btn-primary" type="submit">ADD</button>
                </form>
                </Model>
           
                 {/* หน้าต่างแสดงรายละเอียดใบเสนอราคา >*/}
                 {selectedQuotation && (
                <Model isOpen={true}>
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
                    <p>วันที่: {selectedQuotation.date_}</p>
                    <p>หมายเหตุ: {selectedQuotation.annotation}</p>
                    </div>
                    </div>
                    <hr></hr>

                    <table className="detail">
                 <thead>
                     <tr>
                         <th>รายการ</th>
                         <th>ขนาด</th>
                         <th>ราคา</th>
                     </tr>
                 </thead>
                 <tbody>
                 {products.map((val, index) => (
            <tr key={index}>
              <td>{val.product_name}</td>
              <td>{val.product_btu}</td>
              <td>{val.product_price}</td>
            </tr>
          ))}
        </tbody>
                 
             </table>
                    </div>
                    {/* เพิ่มปุ่มปิดหน้าต่าง */}
                    <button onClick={() => setSelectedQuotation(null)}>Close</button>
                    {/* เพิ่มปุ่มdownload */}
                    <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
                </Model>
                
            )}
        </div>


    )
}