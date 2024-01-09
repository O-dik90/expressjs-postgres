import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  const {rows} = await pool.query("SELECT NOW()");
  res.send(`Hello world!`);
});

app.get("/api/get", async (req, res) => {
  const {rows} = await pool.query("SELECT * FROM distance");
  res.send(rows);
});

app.post("/api/post", (req, res) => {
  pool.query("INSERT INTO termo (desc, humidity, termometer) VALUES ('test company', 9, 6)")
  res.send("ok!")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
