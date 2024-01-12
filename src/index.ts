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

app.post("/api/postAdd", async (req, res) => {
  var keterangan = req.body.description;
  var sensor = req.body.distance;
  var status = req.body.status;

 await pool.query(`INSERT INTO dist (description, distance, status) VALUES ('${keterangan}', '${sensor}', '${status}')`, (err, result) => {
    if (!err) {
      res.status(201).send("posted!");
    }
    else {
      res.status(400).send(err.message);
      throw err;
    }
  });
});

app.post("api/postUpdate", async(req, res) => {
  await pool.query(`UPDATE dist SET description = "test put" WHERE status = "bad"`, (err, result) =>{
    if (!err) {
      res.status(201).send(result);
    } else {
      res.status(400).send(err.message);
    }
  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
