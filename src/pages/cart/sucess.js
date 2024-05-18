import React from 'react';
import { Link } from 'react-router-dom'; // แก้ชื่อ import เป็น Link แทนเพราะเราจะใช้ Link ของ React Router
export default function Success() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">คำสั่งซื้อสำเร็จ!</h1>
        <p className="mb-4">Thank you for your order. We've received your payment and your order is now being processed.</p>
        <div className="flex justify-between">
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            กลับหน้าแรก
          </Link>
          <Link to="/history" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            ตรวจสอบสถานะ
          </Link>
        </div>
      </div>
    </div>
  );
}
