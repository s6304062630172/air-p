import Select from 'react-select';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from "@material-tailwind/react";
import Axios from 'axios';
const Quo_modal = ({
    Repair_statusModal,
    returnClosequoModal
}) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [formData, setFormData] = useState({
        date_: '',
        id_tax_user: '',
        phone_user: '',
        address_user: '',
        email: '',
        products: [],
    });
    const handleSubmit = (e) => {
        e.preventDefault(); 
        Axios.post('http://localhost:3001/userquo', formData)
            .then(() => {
                alert('ขอใบเสนอราคาเรียบร้อย');
                setFormData({
                    date_: '',
                    id_tax_user: '',
                    phone_user: '',
                    address_user: '',
                    email: '',
                    products: [],
                });
                setSelectedProducts([]);
          
              
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('ส่งคำขอไม่สำเร็จ');
                
            });
            
    };
    useEffect(() => {
        Axios.get('http://localhost:3001/selectproduct')
            .then(res => {
                setProductOptions(res.data.map(product => ({
                    value: product.product_id,
                    label: product.product_name
                })));
            })
            .catch(err => console.log(err));
    }, [Repair_statusModal]);
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
                quantity: '',
            })),
        });
    };
    const handleProductQuantityChange = (e, index) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            products: prevState.products.map((product, i) => i === index ? { ...product, quantity: value } : product),
        }));
    };
    return (

        <dialog id="quo_modal" >
            <div className="justify-center space-x-5 space-y-5 mb-5 px-5 py-10 top-0 ">
                <form method="dialog">
                    <button
                        className="rounded-full bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 absolute right-5 top-7"
                        onClick={returnClosequoModal}
                    >
                        ✕
                    </button>
                </form>
                <form method="dialog" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold ">ขอใบเสนอราคา</label>

                    </div>
                    <div className="form-group">
                        <label required htmlFor="message" className="text-lg font-semibold">วันที่ขอ:</label>
                        <br></br> <input className=" border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" type="date"  name="date_" value={formData.date_} onChange={handleChange} required />
                    </div>
                   
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold">เลขประจำตัวผู้เสียภาษี:</label>
                        <input
                            required
                            onChange={handleChange}
                            id="id_tax_user"
                            name="id_tax_user"
                            className="border rounded-md px-3 py-2"
                            value={formData.id_tax_user}
                  
                        />
                    </div>
                   
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold">เบอร์โทรศัพท์:</label>
                        <input
                            required
                            onChange={handleChange}
                            id="phone_user"
                            name="phone_user"
                            className="border rounded-md px-3 py-2"
                            value={formData.phone_user}
                   
                        />
                    </div>
                  
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold">ที่อยู่:</label>
                        <input
                            required
                            onChange={handleChange}
                            id="address_user"
                            name="address_user"
                            className="border rounded-md px-3 py-2"
                            value={formData.address_user}
                 
                        />
                    </div>
                   
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold">อีเมลล์:</label>
                        <input
                            required
                            onChange={handleChange}
                            id="email"
                            name="email"
                            className="border rounded-md px-3 py-2"
                            style={{ width: '600px', height: '40px'}}
                            value={formData.email}
              
                        />
                    </div>
                    <br></br>
                    <div className="form-group">
                        <label className="text-lg font-semibold">เลือกสินค้า:</label>
                        <Select
                            value={selectedProducts}
                            onChange={handleProductChange}
                            options={productOptions}
                            isMulti
                            
                            
                        />
                        <Button type="button" onClick={handleAddProductClick} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">เลือกจำนวน</Button>
                    </div>

                    {formData.products.map((product, index) => (
                        <div key={index} className="form-group">
                            <label> เลือกจำนวนสินค้าชิ้นที่ {index + 1}</label>
                            <input type="text" className="form-control" name={`quantity_${index}`} value={product.quantity} onChange={(e) => handleProductQuantityChange(e, index)} required />
                        </div>
                    ))}
                    <br></br>
                    <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                </form>
            </div>
        </dialog>
    );


}
export default Quo_modal;