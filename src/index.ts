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

app.post("/api/post", async (req, res) => {
  var data = {desc: "new post", distance: 5}
  await pool.query("INSERT INTO distance SET ?",data, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
