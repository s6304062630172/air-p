const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios'); // เพิ่มบรรทัดนี้
app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'tk-login'

///add-on//
app.use(express.urlencoded({ extended: true }));
const LINE_NOTIFY_TOKEN = 'qTTR3oIOBQVR2BLrbjGoiyEE2IjJO5o0wY8fXKq3Wqm'; // นำเข้า LINE_NOTIFY_TOKEN
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
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
app.get('/test', (req, res) => {
  db.query("SELECT * FROM test", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});
app.get('/userCalendar/:ordering_id', (req, res) => {
  const ordering_id = req.params.ordering_id;
  db.query(" SELECT user.username , user.email , user.address FROM user JOIN purchase ON user.email = purchase.email JOIN ordering ON purchase.purchase_id = ordering.purchase_id WHERE ordering.ordering_id = ?;", ordering_id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching purchase data.");
    } else {
      res.send(result);
    }
  });
});

// app.post("/test/create", (req, res) => {
//   const title = req.body.title;
//   const detail = req.body.detail;
//   const name = req.body.name;
//   const date_start = req.body.date_start;
//   const date_end = req.body.date_end;

//   db.query(
//     "INSERT INTO test (title,detail,name,date_start,date_end) VALUES(?,?,?,?,?) ",
//     [title, detail, name, date_start, date_end],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send("values Inserte");
//       }
//     })

// })

app.get('/morning', (req, res) => {
  db.query("SELECT date_book FROM ordering WHERE timestart_book = '09:00:00'", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching user data.");
    } else {
      res.send(result);
    }
  });
});
app.get('/everning', (req, res) => {
  db.query("SELECT date_book FROM ordering WHERE timestart_book = '13:00:00'", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching user data.");
    } else {
      res.send(result);
    }
  });
});


app.get("/ordering",(req,res)=>{
  db.query("SELECT * FROM ordering",(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
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
    [product_img, product_name, product_type_id, product_brand_id, product_detail, product_price, product_quantity, product_btu],
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
app.get('/editproduct/:product_id', (req, res) => {
  const product_id = req.params.product_id
  db.query("SELECT * FROM product WHERE product_id = ?", product_id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
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
app.put('/update/:product_id', (req, res) => {
  const sql = "UPDATE product SET product_name = ? , product_type_id = ? , product_brand_id = ? , product_price = ? , product_quantity =? , product_btu = ? WHERE product_id =?"
  const product_id = req.params.product_id;
  db.query(sql, [req.body.product_name, req.body.product_type_id, req.body.product_brand_id, req.body.product_price, req.body.product_quantity, req.body.product_btu, product_id], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
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
// app.post('/quotation/create', (req, res) => {
//   const {
//       title_quotation,
//       date_,
//       id_tax_user,
//       id_tax_admin,
//       annotation,
//       phone_admin,
//       phone_user,
//       address_user,
//       email,
//       product_id,
//       price,
//       quantity
//   } = req.body;

//   // Start a database transaction
//   db.beginTransaction((err) => {
//       if (err) {
//           throw err;
//       }

//       // Insert ใบเสนอ
//       db.query('INSERT INTO quotation (title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
//           [title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email],
//           (err, result) => {
//               if (err) {
//                   return db.rollback(() => {
//                       console.error(err);
//                       res.status(500).send('Error occurred, transaction rolled back');
//                   });
//               }

//               // Get the ID of the inserted quotation
//               const quotationId = result.insertId;

//               // Insert into 'cartquo' table
//               db.query('INSERT INTO cartquo (no_quotation, product_id, price, quantity) VALUES (?, ?, ?, ?)',
//                   [quotationId, product_id, price, quantity],
//                   (err, result) => {
//                       if (err) {
//                           return db.rollback(() => {
//                               console.error(err);
//                               res.status(500).send('Error occurred, transaction rolled back');
//                           });
//                       }

//                       // Commit the transaction
//                       db.commit((err) => {
//                           if (err) {
//                               return db.rollback(() => {
//                                   console.error(err);
//                                   res.status(500).send('Error occurred, transaction rolled back');
//                               });
//                           }

//                           // Send a success response
//                           res.send('Quotation and Cartquo values inserted successfully');
//                       });
//                   });
//           });
//   });
// });
app.post('/quotation/create', (req, res) => {
  const {
      title_quotation,
      date_,
      id_tax_user,
      id_tax_admin,
      annotation,
      phone_admin,
      phone_user,
      address_user,
      email,
      total_vat,
      vat,
      products
  } = req.body;

  // Start a database transaction
  db.beginTransaction((err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to start transaction" });
      }

      // Insert quotation record
      db.query('INSERT INTO quotation (title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email,total_vat,vat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email,total_vat,vat],
          (err, result) => {
              if (err) {
                  return db.rollback(() => {
                      console.error(err);
                      res.status(500).json({ error: "Failed to insert quotation record" });
                  });
              }

              const quotationId = result.insertId;

              // Insert products into cartquo table
              const values = products.map(product => [quotationId, product.product_id, product.price, product.quantity]);
              db.query('INSERT INTO cartquo (no_quotation, product_id, price, quantity) VALUES ?', [values], (err, result) => {
                  if (err) {
                      return db.rollback(() => {
                          console.error(err);
                          res.status(500).json({ error: "Failed to insert products into cartquo table" });
                      });
                  }

                  // Commit the transaction
                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              console.error(err);
                              res.status(500).json({ error: "Failed to commit transaction" });
                          });
                      }

                      res.status(200).json({ message: "Quotation and products inserted successfully" });
                  });
              });
          });
  });
});

//drop down product_id
app.get('/selectproduct', (req, res) => {
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
  const sql = 'SELECT cartquo.product_id, product.product_name, product.product_btu, cartquo.quantity, cartquo.price FROM cartquo JOIN product ON cartquo.product_id = product.product_id WHERE cartquo.no_quotation = ?';
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

  // Start a database transaction
  db.beginTransaction((err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to start transaction" });
      }

      // Delete from cartquo table
      db.query('DELETE FROM cartquo WHERE no_quotation = ?', [no_quotation], (err, result) => {
          if (err) {
              return db.rollback(() => {
                  console.error(err);
                  res.status(500).json({ error: "Failed to delete products from cartquo table" });
              });
          }

          // Delete from quotation table
          db.query('DELETE FROM quotation WHERE no_quotation = ?', [no_quotation], (err, result) => {
              if (err) {
                  return db.rollback(() => {
                      console.error(err);
                      res.status(500).json({ error: "Failed to delete quotation record" });
                  });
              }

              // Commit the transaction
              db.commit((err) => {
                  if (err) {
                      return db.rollback(() => {
                          console.error(err);
                          res.status(500).json({ error: "Failed to commit transaction" });
                      });
                  }

                  res.status(200).json({ message: "Quotation and related products deleted successfully" });
              });
          });
      });
  });
});
//Edit
app.get('/editquotation/:no_quotation', (req, res) => {
  const no_quotation = req.params.no_quotation
  db.query("SELECT * FROM quotation WHERE no_quotation = ?", no_quotation, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
app.put('/updatequ/:no_quotation', (req, res) => {
  const sql = "UPDATE quotation SET title_quotation = ? , date_ = ?,id_tax_user = ?,id_tax_admin = ?,annotation = ?,phone_admin = ?,phone_user = ?,address_user = ?,email = ?,total_vat = ?,vat = ? WHERE no_quotation =?"
  const no_quotation = req.params.no_quotation;
  db.query(sql, [req.body.title_quotation, req.body.date_, req.body.id_tax_user, req.body.phone_admin, req.body.annotation, req.body.phone_admin, req.body.phone_user, req.body.address_user, req.body.email, req.body.total_vat, req.body.vat, no_quotation], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
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
    [employee_name, employee_surname, employee_phone, employee_position],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});
app.delete('/delete/employee/:id', (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employee WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})
//Edit
app.get('/editemployee/:id', (req, res) => {
  const id = req.params.id
  db.query("SELECT * FROM employee WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
app.put('/updateemployee/:id', (req, res) => {
  const sql = "UPDATE employee SET employee_name = ?,employee_surname = ?,employee_phone = ?,employee_position = ? WHERE id =?"
  const id = req.params.id;
  db.query(sql, [req.body.employee_name, req.body.employee_surname, req.body.employee_phone, req.body.employee_position, id], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
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
  const date = new Date();
  let sum = 0;
  for (let i = 0; i < req.body.length; i++) {
    sum += req.body[i].quantity * req.body[i].product_price;
  }
  db.query(
    "INSERT INTO purchase (email, date, payment_amount, pay_type, time_book, payment_status) VALUES (?, ?, ?, ?, NOW(), ?)",
    [
      req.body[0].email,
      date,
      sum,
      req.body[0].pay_type,
      "รอตรวจสอบ",
    ],
    (err, purchaseResult) => {
      if (err) {
        console.log("error ---> ", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกการซื้อสินค้า" });
      } else {
        for (let i = 0; i < req.body.length; i++) {
          db.query(
            "INSERT INTO ordering (product_id, purchase_id, price, quantity, date_book, timestart_book, timestop_book, type, work_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              req.body[i].product_id,
              purchaseResult.insertId,
              req.body[i].quantity * req.body[i].product_price,
              req.body[i].quantity,
              req.body[i].needDate,
              req.body[i].timeStart,
              req.body[i].timeStop,
              req.body[i].type,
              "รอตรวจสอบ",
            ],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.log("error ---> ", insertErr);
              }
            }
          );
          db.query(
            "UPDATE product SET product_quantity = product_quantity - ? WHERE product_id = ?",
            [req.body[i].quantity, req.body[i].product_id],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.log("error ---> ", updateErr);
              }
            }
          );
        }
        res.status(200).send("success");
      }
    }
  );
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

///////////////////////////////////////////////////////////////////////////////////////////////////ST//////////////////////////////////
/////Check status///////////

app.get('/get/checkstatus', (req, res) => {
  db.query("SELECT purchase.*, user.username FROM purchase INNER JOIN user ON purchase.email = user.email", (err, result) => {
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

app.put('/updatecheckstatus/:purchase_id', (req, res) => {
  const purchaseId = req.params.purchase_id;
  const workStatus = req.body.work_status;
  const paymentStatus = req.body.payment_status;

  const updateOrderingSql = "UPDATE ordering SET work_status = ? WHERE purchase_id = ?";
  db.query(updateOrderingSql, [workStatus, purchaseId], (orderingErr, orderingResult) => {
    if (orderingErr) {
      console.error("Error updating work_status in ordering table:", orderingErr);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการทำงานในตาราง ordering" });
    }

    const updatePurchaseSql = "UPDATE purchase SET payment_status = ? WHERE purchase_id = ?";
    db.query(updatePurchaseSql, [paymentStatus, purchaseId], (purchaseErr, purchaseResult) => {
      if (purchaseErr) {
        console.error("Error updating payment_status in purchase table:", purchaseErr);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงินในตาราง purchase" });
      }

      return res.json({ updated: true });
    });
  });
});
//////Check work status///////////

app.get('/get/workstatus', (req, res) => {
  db.query("SELECT ordering.*, user.username FROM ordering INNER JOIN purchase ON ordering.purchase_id = purchase.purchase_id INNER JOIN user ON purchase.email = user.email WHERE ordering.work_status = 'ดำเนินงาน'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//edit work status
app.get('/Editworkstatus/:purchase_id', (req, res) => {
  const purchase_id = req.params.purchase_id;
  db.query("SELECT purchase.email, user.username, user.address, ordering.type ,ordering.detail FROM purchase INNER JOIN user ON purchase.email = user.email INNER JOIN ordering ON purchase.purchase_id = ordering.purchase_id WHERE purchase.purchase_id = ?", purchase_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//team
app.get('/teams', (req, res) => {
  db.query("SELECT * FROM team", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put('/updateworkstatus/:purchase_id', (req, res) => {
  const purchaseId = req.params.purchase_id;
  const workStatus = req.body.work_status;
  const teamNumber = req.body.team_number; // เพิ่มการรับค่า team_number
  const detail = req.body.detail;

  const updateOrderingSql = "UPDATE ordering SET work_status = ?, team_number = ? , detail = ? WHERE purchase_id = ?";
  db.query(updateOrderingSql, [workStatus, teamNumber,detail, purchaseId], (err, result) => {
    if (err) {
      console.error("Error updating work_status and team_number in ordering table:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการทำงานและ team_number ในตาราง ordering" });
    }

    const email = req.body.email;
    const updatePurchaseSql = "UPDATE purchase SET email = ? WHERE purchase_id = ?";
    db.query(updatePurchaseSql, [email, purchaseId], (purchaseErr, purchaseResult) => {
      if (purchaseErr) {
        console.error("Error updating email in purchase table:", purchaseErr);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตอีเมลในตาราง purchase" });
      }

      return res.json({ updated: true });
    });
  });
});
//////Check Finish status///////////
app.get('/get/finishstatus', (req, res) => {
  db.query("SELECT ordering.*, user.username FROM ordering INNER JOIN purchase ON ordering.purchase_id = purchase.purchase_id INNER JOIN user ON purchase.email = user.email WHERE ordering.work_status = 'สำเร็จ'", (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
    }
  });

});
//view finish
app.get('/Viewfinish/:purchase_id', (req, res) => {
  const purchase_id = req.params.purchase_id;
  db.query("SELECT purchase.email, user.username, user.address, ordering.type ,ordering.detail, ordering.work_status, ordering.team_number FROM purchase INNER JOIN user ON purchase.email = user.email INNER JOIN ordering ON purchase.purchase_id = ordering.purchase_id WHERE purchase.purchase_id = ?", purchase_id, (err, result) => {
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

///////////////dashboard///////////////////////
//แสดงแบรนด์ขายดี
app.get('/dashboard', (req, res) => {
  db.query(`
      SELECT
          p.product_id,
          p.product_name,
          pb.product_brand_name,
          pb.brand_img,
          SUM(o.quantity) AS total_sold
      FROM
          ordering o
      JOIN
          product p ON o.product_id = p.product_id
      JOIN
          product_brand pb ON p.product_brand_id = pb.product_brand_id
      GROUP BY
          o.product_id
      ORDER BY
          total_sold DESC
      LIMIT 3;
  `, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
      }
      res.json(result);
  });
});
//ยอดขายรายสัปดาห์
app.get('/api/weekly-sales', (req, res) => {
  db.query(`
      SELECT
          DAYNAME(p.date) AS day_name,
          SUM(o.quantity) AS total_sold
      FROM
          purchase p
      JOIN
          ordering o ON p.purchase_id = o.purchase_id
      WHERE
          WEEK(p.date) = WEEK(CURDATE()) AND YEAR(p.date) = YEAR(CURDATE())
      GROUP BY
          DAYNAME(p.date)
      ORDER BY
          FIELD(day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  `, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
      }
      res.json(result);
  });
});
// app.get('/api/weekly-sales', (req, res) => {
//   const { week } = req.query;
//   let weekQuery = week ? parseInt(week) : null;

//   if (!weekQuery || isNaN(weekQuery) || weekQuery < 1 || weekQuery > 52) {
//       res.status(400).json({ message: 'Invalid week number' });
//       return;
//   }

//   const weekStartDate = getWeekStartDate(weekQuery);
//   const weekEndDate = new Date(weekStartDate);
//   weekEndDate.setDate(weekEndDate.getDate() + 6);

//   db.query(`
//       SELECT
//           DAYNAME(p.date) AS day_name,
//           SUM(o.quantity) AS total_sold
//       FROM
//           purchase p
//       JOIN
//           ordering o ON p.purchase_id = o.purchase_id
//       WHERE
//           p.date BETWEEN ? AND ?
//       GROUP BY
//           DAYNAME(p.date)
//       ORDER BY
//           FIELD(day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
//   `, [weekStartDate, weekEndDate], (err, result) => {
//       if (err) {
//           console.error(err);
//           res.status(500).json({ message: 'Internal server error' });
//           return;
//       }
//       res.json(result);
//   });
// });

//ยอดขายรายเดือน
app.get('/api/monthly-sales', (req, res) => {
  db.query(`
      SELECT
          MONTHNAME(p.date) AS month_name,
          SUM(o.quantity) AS total_sold
      FROM
          purchase p
      JOIN
          ordering o ON p.purchase_id = o.purchase_id
      WHERE
          YEAR(p.date) = YEAR(CURDATE())
      GROUP BY
          MONTH(p.date)
      ORDER BY
          MONTH(p.date);
  `, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
      }
      res.json(result);
  });
});
app.listen('3001', () => {
  console.log('server is running on port 3001');
}) 