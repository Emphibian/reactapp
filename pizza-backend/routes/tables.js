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

module.exports = router;
