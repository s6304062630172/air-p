import axios from "axios";
import { useEffect, useState } from "react";

export default function Validation() {
    const email = localStorage.getItem("email")
    const Useauthen = () => {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3001/authen', null, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
            .then(res => {
                if (res.data.status === "ok") {
                    localStorage.setItem('username', res.data.decoded.username)
                    if (email != "admin@gmail.com") {
                        window.location = '/'
                    }
                    else {
                        window.location = '/product'
                    }
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userinfo');
                    localStorage.removeItem('email');
                    window.location = '/login';
                }
            })
            .catch(err => {
                console.log(err);
                localStorage.removeItem('token');
                window.location = '/login';
            });
    }


    useEffect(() => {
        Useauthen();
    }, []);

    return (
        <div>

        </div>
    )
}
////////////////////////เช็คtoken และนำเข้าสู่หน้าต่างๆ/////////////