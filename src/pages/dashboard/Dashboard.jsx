import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import "./dashboard.css";

const Dashboard = () => {
    const [dailySales, setDailySales] = useState([]);
    const [topBrands, setTopBrands] = useState([]);
    const [chart, setChart] = useState(null);
    const [monthlySales, setMonthlySales] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:3001/dashboard'),
            axios.get('http://localhost:3001/api/monthly-sales')
        ]).then(([topBrandsResponse, monthlySalesResponse]) => {
            setTopBrands(topBrandsResponse.data);
            setMonthlySales(monthlySalesResponse.data);
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
        if (chart) {
            chart.destroy();
        }

        if (dailySales.length > 0) {
            const ctx = document.getElementById('column-chart').getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    datasets: [{
                        label: 'Units Sold',
                        data: dailySales.map(item => item.total_sold),
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
        <div>
        <h3>Dashboard</h3>
        <div className="dashboard-container">
            <div className="dashboard-card light-gray-bg">
                <h2 className="text-xl font-semibold mb-4">สถิติรายสัปดาห์</h2>
                <canvas id="column-chart" style={{maxWidth: '300px', maxHeight: '300px'}}></canvas>
            </div>
            <div className="dashboard-card light-gray-bg">
                <h2 className="text-xl font-semibold mb-4">สถิติรายเดือน</h2>
                <canvas id="line-chart" style={{maxWidth: '300px', maxHeight: '300px'}}></canvas>
            </div>
        </div>
        <br></br>
        <div className="dashboard-card light-blue-bg">
            <h2 className="text-xl font-semibold mb-4">อันดับ Brand ขายดี</h2>
            <ul>
                {topBrands.map((brand, index) => (
                    <li key={brand.product_brand_id}>
                        <strong>{index + 1}. {brand.product_brand_name}</strong>: {brand.total_sold} ตัว
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
};

export default Dashboard;






