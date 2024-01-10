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
  const {rows} = await pool.query("SELECT * FROM dist");
  res.send(rows);
});

app.post("/api/post", async (req, res) => {
  const sql = "SELECT * FROM dist WHERE status = 'ok'";
  await pool.query(sql, (err,result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post("/api/post1", (req, res) => {
  var keterangan = "new test";
  var sensor = "6";
  var status = "ok";

  pool.query(`INSERT INTO dist (description, distance, status) VALUES (${keterangan}, ${sensor}, ${status})`, (err, result) => {
    if (!err) {
      res.send(result);
    }
    else {
      res.status(400).send(err.message);
      throw err;
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
