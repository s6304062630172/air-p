const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'tk-login'
const axios = require('axios');//เพิ่มบรรทัดนี้
///add-on//
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const LINE_NOTIFY_TOKEN = 'qTTR3oIOBQVR2BLrbjGoiyEE2IjJO5o0wY8fXKq3Wqm'; // นำเข้า LINE_NOTIFY_TOKEN
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const e = require('express');
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "air-con",
})
app.get('/product', (req, res) => {
  db.query("SELECT product.*, product_type.product_type_name,product.product_btu, product_brand.product_brand_name FROM product JOIN product_type ON product.product_type_id = product_type.product_type_id JOIN product_brand ON product.product_brand_id = product_brand.product_brand_id;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get('/userInfo/:username', (req, res) => {
  const username = req.params.username;
  db.query("SELECT email, username, address FROM user WHERE username = ?", username, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result);
    }
  });
});

app.get('/userCalendar/:ordering_id', (req, res) => {
  const ordering_id = req.params.ordering_id;
  db.query(" SELECT user.username , user.email,user.phone_number , user.address,user.name,purchase.*,ordering.* FROM user JOIN purchase ON user.email = purchase.email JOIN ordering ON purchase.purchase_id = ordering.purchase_id WHERE ordering.ordering_id = ?", ordering_id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching purchase data.");
    } else {
      res.send(result);
    }
  });
});

////////ประวัติการใช้บริการ///////
app.get('/history/:email', (req, res) => {
  const email = req.params.email;
  db.query("SELECT * FROM purchase WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  }
  )
})

app.get('/usercheckstatus/:purchase_id', (req, res) => {
  const purchase_id = req.params.purchase_id;
  db.query("SELECT ordering.*,product.product_name FROM ordering JOIN product ON ordering.product_id = product.product_id WHERE purchase_id = ?", [purchase_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  }
  )
})
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


app.get("/ordering", (req, res) => {
  db.query("SELECT * FROM ordering", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result)
    }
  })
})
app.get("/ordering_calendar", (req, res) => {
  db.query("SELECT ordering.* FROM ordering INNER JOIN purchase ON ordering.purchase_id = purchase.purchase_id WHERE purchase.payment_status = 'ชำระสำเร็จ'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
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
  db.query(sql, [req.body.address, email], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
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
      [title_quotation, date_, id_tax_user, id_tax_admin, annotation, phone_admin, phone_user, address_user, email, total_vat, vat],
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
  const sql = 'SELECT cartquo.product_id,cartquo.cart_id, product.product_name, product.product_btu, cartquo.quantity, cartquo.price FROM cartquo JOIN product ON cartquo.product_id = product.product_id WHERE cartquo.no_quotation = ?';
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
app.put('/changeprice', (req, res) => {
  const cart_id = req.body.cart_id
  const price = req.body.price;
  const sql = "UPDATE cartquo SET price=? WHERE cart_id=?";
  db.query(sql, [price, cart_id], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
  });
});

/////////////////User quotation///////////////////////////
app.post('/userquo', (req, res) => {
  const {
    date_,
    id_tax_user,
    phone_user,
    address_user,
    email,
    products,
  } = req.body;

  // Start a database transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // Insert quotation record
    db.query('INSERT INTO quotation (date_, id_tax_user, phone_user, address_user, email) VALUES (?, ?, ?, ?, ?)',
      [date_, id_tax_user, phone_user, address_user, email],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);
            res.status(500).json({ error: "Failed to insert quotation record" });
          });
        }

        const quotationId = result.insertId;

        // Insert products into cartquo table
        const values = products.map((product) => [quotationId, product.product_id, product.quantity]);
        db.query('INSERT INTO cartquo (no_quotation, product_id, quantity) VALUES ?', [values], (err, result) => {
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





app.put('/up_team_ordering', (req, res) => {
  const sql = "UPDATE ordering SET team_number = ? WHERE ordering_id =?"
  db.query(sql, [req.body.team_number, req.body.ordering_id], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
  })
})
app.post("/post/employee", (req, res) => {
  const employee_name = req.body.employee_name;
  const employee_surname = req.body.employee_surname;
  const employee_phone = req.body.employee_phone;
  const employee_position = req.body.employee_position;
  const employee_address = req.body.employee_address;
  const line = req.body.line;
  const salary = req.body.salary;
  const team_number = req.body.team_number;
  db.query(
    "INSERT INTO employee (employee_name,employee_surname,employee_phone,employee_position,employee_address,line,salary,team_number) VALUES(?,?,?,?,?,?,?,?) ",
    [employee_name, employee_surname, employee_phone, employee_position, employee_address, line, salary, team_number],
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
  const employee_id = req.params.employee_id;
  db.query("DELETE FROM employee WHERE employee_id = ?", employee_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})
//Edit
app.get('/editemployee/:employee_id', (req, res) => {
  const employee_id = req.params.employee_id
  db.query("SELECT * FROM employee WHERE employee_id = ?", employee_id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
app.put('/updateemployee/:employee_id', (req, res) => {
  const sql = "UPDATE employee SET employee_name = ?,employee_surname = ?,employee_phone = ?,employee_position = ?,employee_address = ?,line = ?,salary = ?,team_number = ? WHERE employee_id =?"
  const employee_id = req.params.employee_id;
  db.query(sql, [req.body.employee_name, req.body.employee_surname, req.body.employee_phone, req.body.employee_position, req.body.employee_address, req.body.line, req.body.salary, req.body.team_number, employee_id], (err, result) => {
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
  const date = new Date
  let sum = 0
  for (let i = 0; i < req.body.length; i++) {
    sum += req.body[i].quantity * req.body[i].product_price;
  }
  db.query(
    " INSERT INTO purchase (email, date, payment_amount,  pay_type,  time_book,payment_status,payment_img,banking) VALUES(?,?,?,?,NOW(),?,?,?) ",
    [
      req.body[0].email,
      date,
      sum,
      req.body[0].pay_type,
      "รอตรวจสอบ",
      req.body[0].payment_img,
      req.body[0].banking,
    ],
    (err, result) => {
      if (err) {
        console.log("error ---> ", err);
        // return res.json(err)
      } else {
        for (let i = 0; i < req.body.length; i++) {
          const needDate = req.body[i].needDate
          let dateString = new Date(needDate);
          dateString.setDate(dateString.getDate() + 1);
          let newDateString = dateString.toISOString().split('T')[0];
          const product_type_id = req.body[i].product_type_id;
          let type = "";
          if (product_type_id === "A5") {
            type = "ซ่อม";
          } else if (product_type_id === "A6") {
            type = "ล้าง";
          } else {
            type = "ติดตั้ง";
          }
          db.query(
            "INSERT INTO ordering (product_id, purchase_id, price, quantity,date_book,timestart_book,timestop_book,type,work_status,detail_user) VALUES(?,?,?,?,?,?,?,?,?,?) ",
            [
              req.body[i].product_id,
              result.insertId,
              req.body[i].quantity * req.body[i].product_price,
              req.body[i].quantity,
              newDateString,
              req.body[i].timeStart_book,
              req.body[i].timeStop_book,
              type,
              "รอตรวจสอบ",
              req.body[i].detail_user,
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

app.post("/cart", (req, res) => {
  db.query("INSERT INTO cart (product_id,needDate,quantity,timeStart_book,timeStop_book,email,detail_user) VALUES (?,?,?,?,?,?,?)",
    [req.body.product_id,
    req.body.needDate,
    req.body.quantity,
    req.body.timeStart,
    req.body.timeStop,
    req.body.email,
    req.body.detail_user
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred while adding data to cart");
      } else {
        res.send("add success")
      }
    }
  );
});

app.post("/repair", (req, res) => {
  const date = new Date();
  db.query("INSERT INTO repair (date_book, timestop_book, timestart_book, name, phone_number, address, issue_type, issue_detail,email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.needDate,
      req.body.timeStop,
      req.body.timeStart,
      req.body.name,
      req.body.phone,
      req.body.address,
      req.body.type,
      req.body.detail,
      req.body.email,
    ],
    (err, repairResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error occurred while adding data to repair table");
      } else {
        db.query("INSERT INTO purchase (email, date, payment_amount, pay_type, time_book, payment_status, payment_img, banking) VALUES (?,?,?,?,NOW(),?,?,?)",
          [
            req.body.email,
            date,
            300,
            req.body.payment_type,
            "รอตรวจสอบ",
            req.body.payment_img,
            req.body.banking,
          ],
          (purchaseErr, purchaseResult) => {
            if (purchaseErr) {
              console.log(purchaseErr);
              return res.status(500).send("Error occurred while adding data to purchase table");
            } else {
              db.query("INSERT INTO ordering (product_id, purchase_id, price, quantity, date_book, timestart_book, timestop_book, type,work_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
                [
                  "01",
                  purchaseResult.insertId,
                  300,
                  1,
                  req.body.needDate,
                  req.body.timeStart,
                  req.body.timeStop,
                  "ซ่อม",
                  "รอตรวจสอบ"
                ],
                (orderingErr, orderingResult) => {
                  if (orderingErr) {
                    console.log(orderingErr);
                    return res.status(500).send("Error occurred while adding data to ordering table");
                  } else {
                    return res.send("add success");
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});


app.get("/getcart/:email", (req, res) => {
  const email = req.params.email;
  db.query("SELECT cart.*,product.* FROM cart JOIN user ON cart.email = user.email JOIN product ON cart.product_id = product.product_id WHERE user.email = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.delete('/deletecart/:email', (req, res) => {
  const email = req.params.email;
  db.query("DELETE FROM cart WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})
app.delete('/deletecartProduct/:cart_id', (req, res) => {
  const cart_id = req.params.cart_id;
  db.query("DELETE FROM cart WHERE cart_id = ?", [cart_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})



////////////////////////////////// login register ///////////////////////////////
app.post('/register', (req, res) => {
  ////1.เช็ค user
  const usernameTofind = req.body.email
  const sqlfind = `SELECT * FROM user WHERE email = '${usernameTofind}'`;
  db.query(sqlfind, (err, result, fields) => {
    if (err) {
      console.error('Error', err);
      return
    };
    if (result.length > 0) {
      console.log('user found', result[0]);
      res.send('มีชื่อผู้ใช้นี้อยู่แล้ว')
    } else {
      const sql = "INSERT INTO user (username,password,address,email,name,phone_number) VALUES(?)"
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
          req.body.name,
          req.body.phone_number
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
  db.query("SELECT purchase.*, user.name, user.address, user.phone_number, product.product_name, ordering.quantity, ordering.price FROM purchase JOIN user ON purchase.email = user.email JOIN ordering ON purchase.purchase_id = ordering.purchase_id JOIN product ON ordering.product_id = product.product_id WHERE purchase.purchase_id = ?",
    [purchase_id],
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

app.get('/editcheckstatus_order/:purchase_id', (req, res) => {
  const purchase_id = req.params.purchase_id;
  db.query("SELECT ordering.*, product.product_name FROM purchase JOIN ordering ON purchase.purchase_id = ordering.purchase_id JOIN product ON ordering.product_id = product.product_id WHERE purchase.purchase_id = ? ",
    [purchase_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    }
  )
});


app.put('/updatecheckstatus/:purchase_id', (req, res) => {
  const purchaseId = req.params.purchase_id;
  const workStatus = req.body.work_status;
  const paymentStatus = req.body.payment_status;
  const payment_img = req.body.payment_img;

  const updateOrderingSql = "UPDATE ordering SET work_status = ? WHERE purchase_id = ?";
  db.query(updateOrderingSql, [workStatus, purchaseId], (orderingErr, orderingResult) => {
    if (orderingErr) {
      console.error("Error updating work_status in ordering table:", orderingErr);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการทำงานในตาราง ordering" });
    }

    const updatePurchaseSql = "UPDATE purchase SET payment_status = ?,payment_img =? WHERE purchase_id = ?";
    db.query(updatePurchaseSql, [paymentStatus,payment_img, purchaseId], (purchaseErr, purchaseResult) => {
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
  db.query("SELECT ordering.*,product.*, user.username FROM ordering INNER JOIN purchase ON ordering.purchase_id = purchase.purchase_id INNER JOIN user ON purchase.email = user.email INNER JOIN product ON product.product_id = ordering.product_id WHERE ordering.work_status = 'ดำเนินงาน'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//edit work status
app.get('/Editworkstatus/:ordering_id', (req, res) => {
  const ordering_id = req.params.ordering_id;
  db.query("SELECT ordering.*,product.product_name,user.username,user.email,user.name,user.phone_number,user.address FROM ordering JOIN purchase ON purchase.purchase_id = ordering.purchase_id JOIN user ON purchase.email = user.email JOIN product ON ordering.product_id = product.product_id WHERE ordering_id = ?", ordering_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});






//change booking
app.put('/changebook/:ordering_id', (req, res) => {
  const date_book = req.body.date_book;
  const timestart_book = req.body.timestart_book;
  const timestop_book = req.body.timestop_book;

  const sql = "UPDATE ordering SET date_book=?, timestart_book=?, timestop_book=? WHERE ordering_id = ?";
  const ordering_id = req.params.ordering_id;
  db.query(sql, [date_book, timestart_book, timestop_book, ordering_id], (err, result) => {
    if (err) return res.json("error")
    return res.json({ updated: true })
  });
});
app.get('/emailchange/:ordering_id', (req, res) => {
  const ordering_id = req.params.ordering_id;
  const sql = "SELECT ordering.*, purchase.email FROM ordering JOIN purchase ON ordering.purchase_id = purchase.purchase_id WHERE ordering.ordering_id = ?";

  db.query(sql, [ordering_id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.json({ error: "An error occurred" });
    }
    return res.json(result);
  });
});
app.put('/updateworkstatus/:ordering_id', (req, res) => {
  const orderingId = req.params.ordering_id; // เปลี่ยน purchase_id เป็น ordering_id
  const workStatus = req.body.work_status;
  const detail = req.body.detail;
  const date_book = req.body.date_book
  const updateOrderingSql = "UPDATE ordering SET work_status = ?,  detail = ? , date_book=? WHERE ordering_id = ?";
  db.query(updateOrderingSql, [workStatus, detail, date_book, orderingId], (err, result) => {
    if (err) {
      console.error("Error updating work_status and team_number in ordering table:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะการทำงานและ team_number ในตาราง ordering" });
    }

    const email = req.body.email;
    const updatePurchaseSql = "UPDATE purchase SET email = ? WHERE purchase_id = ?";
    db.query(updatePurchaseSql, [email, orderingId], (purchaseErr, purchaseResult) => {
      if (purchaseErr) {
        console.error("Error updating email in purchase table:", purchaseErr);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตอีเมลในตาราง purchase" });
      }
      return res.json({ updated: true });
    });
  });
});
// Check Finish status
app.get('/get/finishstatus', (req, res) => {
  db.query("SELECT ordering.*,purchase.*, user.username FROM ordering  JOIN purchase ON ordering.purchase_id = purchase.purchase_id INNER JOIN user ON purchase.email = user.email WHERE ordering.work_status = 'สำเร็จ'", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.send(result);
    }
  });
});

// View finish
app.get('/Viewfinish/:ordering_id', (req, res) => {
  const ordering_id = req.params.ordering_id;
  db.query("SELECT user.username,user.phone_number,user.name, ordering.*, purchase.*,product.product_name FROM ordering JOIN purchase ON purchase.purchase_id = ordering.purchase_id JOIN user ON purchase.email = user.email JOIN product ON ordering.product_id = product.product_id WHERE ordering.ordering_id = ?", ordering_id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
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

app.post('/notifyEmail', (req, res) => {
  const { email, userName, purchase_id, payment_status, products, payment_amount } = req.body;

  const productsHtml = products.map(product => {
    return `
          <tr>
              <td>${product.product_name}</td>
              <td>${product.quantity}</td>
              <td>${product.price}</td>
          </tr>
      `;
  }).join('');

  const mailOptions = {
    from: 'thanaree.satang@gmail.com',
    to: email,
    subject: 'แสงทองแอร์ แอนด์ เซอร์วิส',
    html: `
          <html>
          <head>
          <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #eaf3ff ; /* สีฟ้าอ่อน */
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             
          }
          h2 {
              color: #333333;
            
              padding: 10px;
              border-radius: 5px;
              margin-bottom: 15px;
         text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
          }
          p {
              margin-bottom: 10px;
          }
          .special-p {
              margin-top: 20px; /* เว้นย่อหน้าด้านบน */
             margin-bottom: 20px; /* เว้นย่อหน้าด้านบน */
        padding-left: 20px; /* เว้นย่อหน้าด้านซ้าย */
          }
        .ber{
        padding-left: 20px; /* เว้นย่อหน้าด้านซ้าย */
        }
           .blue-bg {
   
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 15px;
         align-items: center;
         display: flex;
              flex-direction: column;
        }
        table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
          }
          th, td {
              padding: 8px;
              border-bottom: 1px solid #ddd;
              text-align: left;
          }
          th {
              background-color: #f2f2f2;
          }
      </style>
          </head>
          <body>
              <div class="container">
                  <h2>แจ้งเตือนการสั่งซื้อสินค้า/บริการ</h2>
                  <p><strong>เรียนคุณลูกค้า:</strong> ${userName}</p>
                  <p><strong>จากร้านแสงทองแอร์ แอนด์เซอร์วิส ขอบคุณสำหรับการใช้บริการ ขณะนี้รายการสั่งซื้อและการยืนยันการชำระเงิน ถูกอนุมัติแล้ว</strong></p>
                  <div class="blue-bg">
                      <table>
                          <tr>
                              <th>สินค้า</th>
                              <th>จำนวน</th>
                              <th>ราคา</th>
                          </tr>
                          ${productsHtml}
                      </table>
                  </div>
                  <p><strong>ราคารวม:</strong> ${payment_amount}</p>
                  <p><strong>สถานะการชำระเงิน:</strong> ${payment_status}</p>
                  <p>หากมีปัญหาสามารถติดต่อได้ที่เบอร์ 081-752-2599 ,081-924-1451 ร้านแสงทองแอร์ แอนด์เซอร์วิส</p>
                  <h2>ขอบคุณที่ใช้บริการ</h2>
              </div>
          </body>
          </html>
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email notification:', error);
      res.status(500).json({ message: 'Failed to send email' });
    } else {
      console.log('Email notification sent successfully');
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});
///////////////dashboard///////////////////////
//แสดงแบรนด์ขายดี
app.get('/dashboard', (req, res) => {
  db.query(`
  SELECT pb.product_brand_name, pb.brand_img, SUM(o.quantity) AS total_sold 
  FROM ordering o 
  JOIN product p ON o.product_id = p.product_id 
  JOIN product_brand pb ON p.product_brand_id = pb.product_brand_id 
  GROUP BY pb.product_brand_name, pb.brand_img 
  ORDER BY total_sold DESC
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
  WEEK(p.date) = WEEK(CURDATE()) AND YEAR(p.date) = YEAR(CURDATE()) AND p.payment_status = 'ชำระสำเร็จ'
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


app.get('/api/totalSale', (req, res) => {
  db.query(" SELECT SUM(payment_amount) AS total_payment FROM purchase WHERE payment_status = 'ชำระสำเร็จ' ", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
});


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
          YEAR(p.date) = YEAR(CURDATE()) AND p.payment_status = 'ชำระสำเร็จ'
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
//total type
app.get('/api/totaltype', (req, res) => {
  db.query(`
  SELECT 'ซ่อม' AS type, SUM(ordering.price) AS total_payment
  FROM ordering
  INNER JOIN purchase ON ordering.purchase_id = purchase.purchase_id
  WHERE ordering.type = 'ซ่อม' AND purchase.payment_status = 'ชำระสำเร็จ'
  UNION ALL
  SELECT 'ล้าง' AS type, SUM(ordering.price) AS total_payment
  FROM ordering
  INNER JOIN purchase ON ordering.purchase_id = purchase.purchase_id
  WHERE ordering.type = 'ล้าง' AND purchase.payment_status = 'ชำระสำเร็จ'
  `, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      const totalSales = {};
      result.forEach(row => {
        totalSales[row.type] = row.total_payment;
      });
      res.send(totalSales);
    }
  });
});

app.listen('3001', () => {
  console.log('server is running on port 3001');
}) 