import axios from "axios";
import { useEffect, useState } from "react";
export default function Validation() {
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




                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userinfo');
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
        window.location = '/';
    }, []);

    return (
        <div>

        </div>
    )
}
