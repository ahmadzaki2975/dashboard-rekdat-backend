const express = require("express");
const app = express();
const port = 5000;
const knex = require("knex");

const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error catcher
db.on('error', (err) => {
  console.error('Unexpected error on idle db client', err);
  process.exit(-1);
});

// app.get("/bmkg", (req, res) => {
//   const { sdate, edate, city } = req.query;
//   // format from YYYY-MM-DD date to utc
//   const start_date = new Date(sdate).toISOString();
//   const end_date = new Date(edate).toISOString();
//   console.log(start_date, end_date);
//   try {
//     db.select("*")
//       .from("bmkg")
//       .whereBetween("jamcuaca", [start_date, end_date])
//       .andWhere("kota", city)
//       .then((data) => {
//         res.json(data);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/iqair", (req, res) => {
//   const { sdate, edate, city } = req.query;
//   // format from YYYY-MM-DD date to utc
//   const start_date = new Date(sdate).toISOString();
//   const end_date = new Date(edate).toISOString();
//   console.log(start_date, end_date, city);
//   if (!city) {
//     return res.send("Please specify city");
//   }
//   try {
//     db.select("*")
//       .from("iqair")
//       .whereBetween("accessed", [start_date, end_date])
//       .andWhere("kota", city)
//       .then((data) => {
//         res.json(data);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.get("/join", (req, res) => {
  const { sdate, edate, city } = req.query;
  // format from YYYY-MM-DD date to utc
  // prevent injections
  if (
    sdate.includes("'") ||
    edate.includes("'") ||
    city.includes("'") ||
    sdate.includes(";") ||
    edate.includes(";") ||
    city.includes(";")
  ) {
    return res.send("Mau SQL injection ya mas?");
  }
  if (!sdate || !edate) {
    return res.send("Please specify start date and end date");
  }
  const start_date = new Date(sdate).toISOString();
  const end_date = new Date(edate).toISOString();

  if (!city) {
    return res.send("Please specify city");
  }
  console.log(start_date, end_date);

  try {
    db.select("*")
      .from("join_table")
      .whereBetween("jamcuaca", [start_date, end_date])
      .andWhere("kota", city)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("Internal server error");
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
