const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios'); // เพิ่มบรรทัดนี้
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const LINE_NOTIFY_TOKEN = 'qTTR3oIOBQVR2BLrbjGoiyEE2IjJO5o0wY8fXKq3Wqm'; // นำเข้า LINE_NOTIFY_TOKEN

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

//addmay
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'tk-login'


const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "air-con"
})



app.get('/product', (req, res) => {
  db.query("SELECT product.*, product_type.product_type_name, product_brand.product_brand_name FROM product JOIN product_type ON product.product_type_id = product_type.product_type_id JOIN product_brand ON product.product_brand_id = product_brand.product_brand_id;", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});

//add may
app.get('/userInfo/:username',(req,res)=>{
  const username = req.params.username;
  db.query("SELECT * FROM user WHERE username = ?",username,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })
})

app.get('/editaddress/:email', (req, res) => {
  const email = req.params.email
  db.query("SELECT address FROM user WHERE email = ?", email, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })

})

app.put('/updateAddress/:email', (req, res) => {

  const sql = "UPDATE user SET address = ? WHERE email =?"
  const email = req.params.email;
  db.query(sql, [req.body.address,email], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
  })

})

//เดิม
app.get('/test', (req, res) => {
  db.query("SELECT * FROM test", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});

app.post("/test/create",(req,res)=>{
  const title = req.body.title;
  const detail = req.body.detail;
  const name = req.body.name;
  const date_start = req.body.date_start;
  const date_end = req.body.date_end;

  db.query(
    "INSERT INTO test (title,detail,name,date_start,date_end) VALUES(?,?,?,?,?) ",
    [title,detail,name,date_start,date_end],
    (err,result)=>{
      if(err){
        console.log(err);
      }else{
        res.send("values Inserte");
      }
    })
    
})




app.post("/create", (req, res) => {

  const product_img = req.body.product_img;
  const product_name = req.body.product_name;
  const product_type_id = req.body.product_type_id;
  const product_brand_id = req.body.product_brand_id;
  const product_detail = req.body.product_detail;
  const product_price = req.body.product_price;
  const product_quantity = req.body.product_quantity;
  const product_btu = req.body.product_btu;


  db.query(
    "INSERT INTO product (product_img,product_name,product_type_id,product_brand_id,product_detail,product_price,product_quantity,product_btu) VALUES(?,?,?,?,?,?,?,?) ",
    [product_img, product_name, product_type_id, product_brand_id, product_detail, product_price, product_quantity,product_btu],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );



});



app.delete('/delete/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  db.query("DELETE FROM product WHERE product_id = ?", product_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})
app.get('/editproduct/:product_id',(req,res)=>{
  const product_id = req.params.product_id
  db.query("SELECT * FROM product WHERE product_id = ?",product_id,(err,result)=>{
    if (err){
      console.log(err)
    }else{
      res.send(result)
    }
  })
  
})

app.put('/update/:product_id',(req,res)=>{
  
  const sql = "UPDATE product SET product_name = ? , product_type_id = ? , product_brand_id = ? , product_price = ? , product_quantity =? , product_btu = ? WHERE product_id =?"
  
  const product_id =req.params.product_id;
  db.query(sql,[req.body.product_name,req.body.product_type_id,req.body.product_brand_id,req.body.product_price,req.body.product_quantity,req.body.product_btu,product_id],(err,result)=>{
    if(err) return res.json("error") 
    return res.json({updated: true})
  })  

})



////////////////Quatation////////////////


app.get('/get/quotation', (req, res) => {
  db.query("SELECT * FROM quotation", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});

app.post("/post/create", (req, res) => {


  const title_quotation = req.body.title_quotation;
  const date_ = req.body.date_;
  const id_tax_user = req.body.id_tax_user;
  const id_tax_admin = req.body.id_tax_admin;
  const annotation = req.body.annotation;
  const phone_admin = req.body.phone_admin;
  const phone_user = req.body.phone_user;
  const address_user = req.body.address_user;
  const email = req.body.email;
  const product_id = req.body.product_id;

  db.query(
    "INSERT INTO quotation (title_quotation,date_,id_tax_user,id_tax_admin,annotation,phone_admin,phone_user,address_user,email,product_id) VALUES(?,?,?,?,?,?,?,?,?,?) ",
    [title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email, product_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

//  // API Endpoint เพื่อดึงข้อมูล product_brands จากตาราง product
// app.get('/product_brand', (req, res) => {
//   const sql = 'SELECT DISTINCT product_brand_name FROM product_brand'; // Query SQL สำหรับดึงข้อมูล product_brands
//   db.query(sql, (error, results, fields) => { // ใช้ db.query แทน connection.query
//     if (error) {
//       console.error('Error fetching product brands:', error);
//       res.status(500).send('Error fetching product brands');
//       return;
//     }
//     res.json(results); // ส่งข้อมูล product_brands กลับไปยัง React ในรูปแบบ JSON
//   });
// });

// app.get('/product_type', (req, res) => {
//   const sql = 'SELECT DISTINCT product_type_name FROM product_type'; 
//   db.query(sql, (error, results, fields) => { 
//     if (error) {
//       console.error('Error fetching product types:', error);
//       res.status(500).send('Error fetching product types');
//       return;
//     }
//     res.json(results); 
//   });
// });

// drop down หน้า 
app.get("/product_ID", (req, res) => {
  db.query("SELECT * FROM product", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// แสดงรายละเอียดสินค้าในใบเสนอราคา

app.get('/quotation_detail/:no_quotation', (req, res) => {
  const no_quotation = req.params.no_quotation;
  const sql = 'SELECT quotation.*, product.product_name, product.product_price, product.product_btu FROM quotation JOIN product ON quotation.product_id = product.product_id WHERE quotation.no_quotation = ?';
  db.query(sql, [no_quotation], (error, results, fields) => {
      if (error) {
          console.error('Error fetching product:', error);
          res.status(500).send('Error fetching product');
          return;
      }
      res.json(results);
  });
});


//ลบ
app.delete('/delete/quotation/:no_quotation', (req, res) => {
  const no_quotation = req.params.no_quotation;
  db.query("DELETE FROM quotation WHERE no_quotation = ?", no_quotation, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})


//Edit
app.get('/editquotation/:no_quotation',(req,res)=>{
  const no_quotation = req.params.no_quotation
  db.query("SELECT * FROM quotation WHERE no_quotation = ?",no_quotation,(err,result)=>{
    if (err){
      console.log(err)
    }else{
      res.send(result)
    }
  })
  
})

app.put('/updatequ/:no_quotation',(req,res)=>{
  
  const sql = "UPDATE quotation SET title_quotation = ? , date_ = ?,id_tax_user = ?,id_tax_admin = ?,annotation = ?,phone_admin = ?,phone_user = ?,address_user = ?,email = ? WHERE no_quotation =?"
  
  const no_quotation =req.params.no_quotation;
  db.query(sql,[req.body.title_quotation,req.body.date_,req.body.id_tax_user,req.body.phone_admin,req.body.annotation,req.body.phone_admin,req.body.phone_user,req.body.address_user,req.body.email,no_quotation],(err,result)=>{
    if(err) return res.json("error") 
    return res.json({updated: true})
  })  

})



////////////////Employee////////////////

app.get('/get/employee', (req, res) => {
  db.query("SELECT * FROM employee", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});

app.post("/post/employee", (req, res) => {


  const employee_name = req.body.employee_name;
  const employee_surname = req.body.employee_surname;
  const employee_phone = req.body.employee_phone;
  const employee_position = req.body.employee_position;
  const employee_address = req.body.employee_address;
  const line = req.body.line;
  const salary = req.body.salary;
  const team_number = req.body.team_number;
  const subdistrict_id = req.body.subdistrict_id;
  const province_id = req.body.province_id;
  const district_id = req.body.district_id;




  db.query(
    "INSERT INTO employee (employee_name,employee_surname,employee_phone,employee_position,employee_address,line,salary,team_number,subdistrict_id,province_id,district_id) VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
    [employee_name,employee_surname,employee_phone,employee_position,employee_address,line,salary,team_number,subdistrict_id,province_id,district_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.delete('/delete/employee/:employee_id', (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employee WHERE employee_id = ?", employee_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

//Edit Employee
 app.get('/editemployee/:employee_id',(req,res)=>{
  const employee_id = req.params.employee_id
  db.query("SELECT * FROM employee WHERE employee_id = ?",employee_id,(err,result)=>{
    if (err){
      console.log(err)
    }else{
       res.send(result)
     }
   })
  
 })

app.put('/updateemployee/:employee_id',(req,res)=>{
  
  const sql = "UPDATE employee SET employee_name = ?,employee_surname = ?,employee_phone = ?,employee_position = ?,employee_address=?,line = ?,salary = ?,team_number = ?, subdistrict_id = ?,province_id = ?,district_id = ? WHERE employee_id =?"
  
  const employee_id =req.params.employee_id;
  db.query(sql,[req.body.employee_name,req.body.employee_surname,req.body.employee_phone,req.body.employee_position,req.body.employee_address,req.body.line,req.body.salary,req.body.team_number,req.body.subdistrict_id,req.body.province_id,req.body.district_id,employee_id],(err,result)=>{
    if(err) return res.json("error") 
    return res.json({updated: true})
  })  

})

//////Check status///////////

app.get('/get/checkstatus', (req, res) => {
  db.query("SELECT * FROM purchase", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});


app.get('/editcheckstatus/:purchase_id', (req, res) => {
  const purchase_id = req.params.purchase_id;
  db.query(
      "SELECT purchase.*, ordering.product_id, ordering.quantity, product.product_name, product.product_btu " +
      "FROM purchase " +
      "JOIN ordering ON purchase.purchase_id = ordering.purchase_id " +
      "JOIN product ON ordering.product_id = product.product_id " +
      "WHERE purchase.purchase_id = ?",
      purchase_id,
      (err, result) => {
          if (err) {
              console.log(err);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              res.json(result);
          }
      }
  );
});

app.put('/updatecheckstatus/:purchase_id',(req,res)=>{
  
  const sql = "UPDATE purchase SET payment_status = ?,work_status = ?  WHERE purchase_id =?"
  
  const purchase_id =req.params.purchase_id;
  db.query(sql,[req.body.payment_status,req.body.work_status,purchase_id],(err,result)=>{
    if(err) return res.json("error") 
    return res.json({updated: true})
  })  

})

//////Check work status///////////

app.get('/get/workstatus', (req, res) => {
  db.query("SELECT * FROM ordering WHERE work_status = 'ดำเนินงาน' ", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});
//edit work status
app.get('/Editworkstatus/:purchase_id',(req,res)=>{
  const purchase_id = req.params.purchase_id
  db.query("SELECT * FROM purchase WHERE purchase_id = ?",purchase_id,(err,result)=>{
    if (err){
      console.log(err)
    }else{
      res.send(result)
    }
  })
  
})

app.put('/updateworkstatus/:purchase_id',(req,res)=>{
  
  const sql = "UPDATE purchase SET work_status = ?,team_number = ?,email = ?  WHERE purchase_id =?"
  
  const purchase_id =req.params.purchase_id;
  db.query(sql,[req.body.work_status,req.body.team_number,req.body.email,purchase_id],(err,result)=>{
    if(err) return res.json("error") 
    return res.json({updated: true})
  })  

})
//////Check Finish status///////////
app.get('/get/finishstatus', (req, res) => {
  db.query("SELECT * FROM purchase WHERE work_status = 'สำเร็จ' ", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});

//Line

app.post('/notify', async (req, res) => {
  const message = req.body.message;
  try {
      await axios.post(
          'https://notify-api.line.me/api/notify',
          `message=${message}`,
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
              }
          }
      );
      res.status(200).json({ success: true });
  } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ success: false, error: 'Error sending notification' });
  }
});

//email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'thanaree.satang@gmail.com', // ใส่อีเมล์ของคุณที่นี่
      pass: 'xwnythxjudoryuyo' // ใส่รหัสผ่านของคุณที่นี่
  }
});

// ใช้ body-parser middleware
app.use(bodyParser.json());

// เส้นทาง URL notifyEmail
app.post('/notifyEmail', (req, res) => {
  const { email, message } = req.body;

  // กำหนดข้อความอีเมล์
  const mailOptions = {
      from: 'thanaree.satang@gmail.com', // ใส่อีเมล์ของคุณที่นี่
      to: email,
      subject: 'แสงทองแอร์ แอนด์ เซอร์วิส',
      text: message
  };

  // ส่งอีเมล์
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          res.status(500).send('Internal Server Error');
      } else {
          console.log('Email sent:', info.response);
          res.status(200).send('Email Sent Successfully');
      }
  });
});





//P start
app.get("/product_type", (req, res) => {
  db.query("SELECT * FROM product_type", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/buy-product", (req, res) => {
  
  // console.log("req---> ", req.body);
  const date = new Date
  let sum = 0
  for (let i = 0; i < req.body.length; i++) {
    sum += req.body[i].quantity * req.body[i].product_price;
  }
  db.query(
    " INSERT INTO purchase (email, date, payment_amount,  pay_type,  time_book,payment_status,work_status) VALUES(?,?,?,?,NOW(),?,?) ",
    [
      req.body[0].email,
      date,
      sum,
      req.body[0].pay_type,
       "รอตรวจสอบ",
        "รอตรวจสอบ",
    ],
    (err, result) => {
      if (err) {
        console.log("error ---> ", err);
        // return res.json(err)
      } else {
        for (let i = 0; i < req.body.length; i++) {
          db.query(
            "INSERT INTO ordering (product_id, purchase_id, price, quantity,date_book,timestart_book,timestop_book,type) VALUES(?,?,?,?,?,?,?,?) ",
            [
              req.body[i].product_id,
              result.insertId,
              req.body[i].quantity * req.body[i].product_price,
              req.body[i].quantity,
              req.body[i].needDate,
              req.body[i].timeStart,
              req.body[i].timeStop,
              req.body[i].type
            ],
            (err, result) => {
              if (err) {
                console.log("error ---> ", err);
              }
            }
          );
          db.query(
            "UPDATE product SET product_quantity = product_quantity - ? WHERE product_id = ?",
            [req.body[i].quantity, req.body[i].product_id],
            (err, result) => {
              if (err) {
                console.log("error ---> ", err);
              }
            }
          );

          // res.send("Values Inserted");
        }
      }
    }
  );

  res.send("success");
});

////////////////////////////////// login register ///////////////////////////////
app.post('/register', (req, res) => {



  ////1.เช็ค user
  const usernameTofind = req.body.username
  const sqlfind = `SELECT * FROM user WHERE username = '${usernameTofind}'`;
  db.query(sqlfind, (err, result, fields) => {
    if (err) {
      console.error('Error', err);
      return
    };
    if (result.length > 0) {
      console.log('user found', result[0]);
      res.send('มีชื่อผู้ใช้นี้อยู่แล้ว')

    } else {
      const sql = "INSERT INTO user (username,password,address,email,subdistrict_id,province_id,district_id) VALUES(?)"
      const password = req.body.password
      bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
        if (err) {
          console.log(err)
        }
        const values = [
          req.body.username,
          hash,
          req.body.address,
          req.body.email,
          req.body.subdistrict_id,
          req.body.province_id,
          req.body.district_id
        ]
        db.query(sql, [values], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        })
      })




    }
  })
})


app.post('/login', (req, res) => {
  const sql = "SELECT * FROM user WHERE email = ?"
  db.query(sql, [req.body.email], (err, data) => {
    if (err) { return res.json("ERROR"); }
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, isLogin) => {
        if (isLogin) {
          var token = jwt.sign({ username: data[0].username }, secret);
          return res.json({ status: 'ok', message: "Success", token });
        } else {
          return res.json("Fail");
        }
      })
    }
  })
})

app.post('/authen', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // ดึง token จาก header
    var decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});


// app.post('/login', (req,res)=>{
//   const sql = "SELECT * FROM user WHERE email = ? AND password = ?";

//   db.query(sql,[req.body.email,req.body.password],(err,data)=>{
//     if(err){
//       return res.json("Error");
//     }
//     if(data.length > 0 ){

//       return res.json("Success")
//     }else{
//       return res.json("Fail")
//     }
//   })
// })

app.listen('3001', () => {
  console.log('server is running on port 3001');
}) 