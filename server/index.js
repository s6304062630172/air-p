const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());



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
  const quotation_product_type = req.body.quotation_product_type;
  const quotation_product_brand = req.body.quotation_product_brand;


  db.query(
    "INSERT INTO quotation (title_quotation,date_,id_tax_user,id_tax_admin,annotation,phone_admin,phone_user,address_user,email,quotation_product_type,quotation_product_brand) VALUES(?,?,?,?,?,?,?,?,?,?.?) ",
    [title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email,quotation_product_type,quotation_product_brand],
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
  const quotation_product_type = req.body.quotation_product_type;
  const quotation_product_brand = req.body.quotation_product_brand;


  db.query(
    "INSERT INTO quotation (title_quotation,date_,id_tax_user,id_tax_admin,annotation,phone_admin,phone_user,address_user,email,quotation_product_type,quotation_product_brand) VALUES(?,?,?,?,?,?,?,?,?,?.?) ",
    [title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email,quotation_product_type,quotation_product_brand],
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



  db.query(
    "INSERT INTO employee (employee_name,employee_surname,employee_phone,employee_position) VALUES(?,?,?,?) ",
    [employee_name,employee_surname,employee_phone,employee_position],
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

//Edit
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
  
  const sql = "UPDATE employee SET employee_name = ?,employee_surname = ?,employee_phone = ?,employee_position = ? WHERE employee_id =?"
  
  const employee_id =req.params.employee_id;
  db.query(sql,[req.body.employee_name,req.body.employee_surname,req.body.employee_phone,req.body.employee_position,employee_id],(err,result)=>{
    if(err) return res.json("error") 
    return res.json({updated: true})
  })  

})

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
  for (let i = 0; i < req.body.length; i++) {
    db.query(
      " INSERT INTO purchase (email, date, time, payment_amount, timestart_book, timestop_book, pay_type, date_book, payment_status) VALUES(?,?,?,?,?,?,?,?,?) ",
      [
        "test@outlook.com",
        date,
        date,
        req.body[i].quantity * req.body[i].product_price,
        req.body[i].timeStart,
        req.body[i].timeStop,
        req.body[i].pay_type,
        req.body[i].needDate,
        "รอดำเนินการ",
      ],
      (err, result) => {
        if (err) {
          console.log("error ---> ", err);
          // return res.json(err)
        } else {
          db.query(
            "INSERT INTO ordering (product_id, purchase_id, price, quantity) VALUES(?,?,?,?) ",
            [
              req.body[i].product_id,
              result.insertId,
              req.body[i].quantity * req.body[i].product_price,
              req.body[i].quantity,
            ],
            (err, result) => {
              if (err) {
                console.log("error ---> ", err);
              }
            }
          );
          // res.send("Values Inserted");
        }
      }
    );
  }

  res.send("success");
});

app.listen('3001', () => {
  console.log('server is running on port 3001');
}) 