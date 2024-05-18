import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import "./dashboard.css";

const Dashboard = () => {
    const [dailySales, setDailySales] = useState([]);
    const [topBrands, setTopBrands] = useState([]);
    const [chart, setChart] = useState(null);
    const [monthlySales, setMonthlySales] = useState([]);
    const [brand_img, setbrand_img] = useState("");
    const [totalSale, setTotalSale] = useState("");
    const [totalType, setTotalType] = useState({});
    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:3001/dashboard'),
            axios.get('http://localhost:3001/api/monthly-sales')
        ]).then(([topBrandsResponse, monthlySalesResponse]) => {
            setTopBrands(topBrandsResponse.data);
            setMonthlySales(monthlySalesResponse.data);
            setbrand_img(topBrandsResponse.data);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
        if (monthlySales.length > 0) {
            // Sort the monthlySales data by month name
            const sortedMonthlySales = monthlySales.sort((a, b) => {
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return months.indexOf(a.month_name) - months.indexOf(b.month_name);
            });

            const ctx = document.getElementById('line-chart').getContext('2d');
            if (Chart.getChart(ctx)) {
                Chart.getChart(ctx).destroy();
            }
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedMonthlySales.map(item => item.month_name),
                    datasets: [{
                        label: 'Total Sales',
                        data: sortedMonthlySales.map(item => item.total_sold),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [monthlySales]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/weekly-sales')
            .then(response => {
                setDailySales(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });



    }, []);
    useEffect(() => {
        axios.get('http://localhost:3001/api/totalSale')
            .then(res => {
                setTotalSale(res.data[0].total_payment);
            })
            .catch(error => {
                console.error('Error fetching total sale:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/totaltype')
            .then(res => {
                setTotalType(res.data); 
                console.log(totalType)
            })
            .catch(error => {
                console.error('Error fetching total type:', error);
            });
    }, []);

    useEffect(() => {
        const ctx = document.getElementById('column-chart').getContext('2d');
        if (chart) {
            chart.destroy();
        }

        if (dailySales.length > 0) {

            const sortedData = dailySales.sort((a, b) => {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                return days.indexOf(a.day_name) - days.indexOf(b.day_name);
            });

            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedData.map(item => item.day_name),
                    datasets: [{
                        label: 'Units Sold',
                        data: sortedData.map(item => item.total_sold),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChart(newChart);
        }

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [dailySales]);


    return (
        <div className='h-screen w-screen bg-gray-100  overflow-auto'>
            <div className=" flex flex-col space-y-4 mt-0 ml-0 mb-4">
                <label class="text-2xl font-semibold bg-gray-800 text-white px-4 py-2">DASHBOARD</label>
                <div className="dashboard-container">
                    <div className="dashboard-card light-gray-bg">
                        <h2 className="text-xl font-semibold mb-4">สถิติรายสัปดาห์</h2>
                        <canvas id="column-chart" style={{ maxWidth: '300px', maxHeight: '300px' }}></canvas>
                    </div>
                    <div className="dashboard-card light-gray-bg">
                        <h2 className="text-xl font-semibold mb-4">สถิติรายเดือน</h2>
                        <canvas id="line-chart" style={{ maxWidth: '300px', maxHeight: '300px' }}></canvas>
                    </div>
                    <div className="dashboard-card light-gray-bg">
                        <h2 className="text-xl font-semibold mb-4">ยอดขายรวม/บาท</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h2 class="text-2xl font-bold text-blue-500">{totalSale} บาท </h2>
                    </div>
                    <div className="dashboard-card light-gray-bg">
                        <h2 className="text-xl font-semibold mb-4">ยอดขายซ่อม/บาท</h2>
                        <div className="flex items-center space-x-2 mb-4">
                            <svg class="h-8 w-8 text-black-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6-6a6 6 0 0 1 -8 -8l3.5 3.5" /></svg>
                            <h2 className="text-2xl font-bold text-blue-500">{totalType.ซ่อม} บาท</h2>
                        </div>
                        <h2 className="text-xl font-semibold mb-4">ยอดขายล้าง/บาท</h2>
                        <div className="flex items-center space-x-2">
                            <svg class="h-8 w-8 text-black-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-blue-500">{totalType.ล้าง} บาท</h2>
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="dashboard-card light-blue-bg">
                    <h2 className="text-xl font-semibold mb-4">อันดับสินค้า และ บริการ ขายดี</h2>
                    <ul>
                        {topBrands.map((brand, index) => (
                            <li key={brand.product_brand_id}>
                                <strong>{index + 1}. {brand.product_brand_name}</strong>: {brand.total_sold} ตัว
                                <img
                                    src={brand.brand_img} // ใช้ URL ของรูปภาพของแต่ละแบรนด์
                                    alt=""
                                    style={{ width: '300px', height: '200px' }} // กำหนดขนาดรูปภาพ
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;