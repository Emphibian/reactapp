var express = require("express");
var router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("tables.db");

router.get("/normal", function (req, res, next) {
  db.all("SELECT booked FROM normal", (err, rows) => {
    if (err) throw err;
    res.send(JSON.stringify(rows));
  });
});

router.get("/lounge", function (req, res, next) {
  db.all("SELECT booked FROM lounge", (err, rows) => {
    if (err) throw err;
    res.send(JSON.stringify(rows));
  });
});

router.get("/outdoor", function (req, res, next) {
  db.all("SELECT booked FROM outdoor", (err, rows) => {
    if (err) throw err;
    res.send(JSON.stringify(rows));
  });
});

router.post('/update', function(req, res, next) {
  let {table_type, table_num} = req.body;

  if (table_type==="Normal") {
    db.run("UPDATE normal SET booked = 1 WHERE num = ?", table_num);
  } else if (table_type==="Lounge") {
    db.run("UPDATE lounge SET booked = 1 WHERE num = ?", table_num);
  } else {
    db.run("UPDATE outdoor SET booked = 1 WHERE num = ?", table_num);
  }
});

router.get('/reset', function(req, res, next) {
  let tables = ["normal", "outdoor", "lounge"];
  tables.map((table) => {
    db.all(`SELECT num FROM ${table} WHERE booked = 1`, (err, rows) => {
      if (err) throw err;
      rows.map((info) => db.run(`UPDATE ${table} SET booked = 0 WHERE num = ?`, info.num));
    });
  });
});
module.exports = router;
