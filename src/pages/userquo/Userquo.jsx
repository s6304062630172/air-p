import Select from 'react-select';
import { useState, useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import Axios from 'axios';

const Userquo = () => {
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
                alert('Quotation added successfully');
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
                alert('An error occurred. Please try again.');
            });
    };
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
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
        <div>
        <h3>ขอใบเสนอราคา</h3>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Date:</label>
                <input type="date" className="form-control" name="date_" value={formData.date_} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>ID Tax User:</label>
                <input type="text" className="form-control" name="id_tax_user" value={formData.id_tax_user} onChange={handleChange} required />
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
                <Button type="button" onClick={handleAddProductClick} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">เลือกจำนวน</Button>
            </div>
            {formData.products.map((product, index) => (
                <div key={index} className="form-group">
                    <label>จำนวน:</label>
                    <input type="text" className="form-control" name={`quantity_${index}`} value={product.quantity} onChange={(e) => handleProductQuantityChange(e, index)} required />
                </div>
            ))}
             <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
        </form>
        </div>
    );
};

export default Userquo;