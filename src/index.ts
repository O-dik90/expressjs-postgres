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
  const {rows} = await pool.query("SELECT * FROM measure");
  res.send(rows);
});

app.get("/api/postAdd", async (req, res) => {
  var keterangan = req.body.description;
  var sensor = req.body.distance;
  var status = req.body.status;

 await pool.query(`INSERT INTO measure (distance, status, description) VALUES ('${sensor}', '${status}','${keterangan}')`, (err, result) => {
    if (!err) {
      res.status(201).send("posted!");
    }
    else {
      res.status(400).send(err.message);
      throw err;
    }
  });
});

app.post("/api/:id", async (req, res) => {
  var id = req.params.id;
  
  await pool.query(`SELECT * FROM measure WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.send(err.message);
      throw err;
    } else {
      res.send(result);
    }
  });
});

app.get("/update", (req,res) =>{
  res.status(201).send("update");
})

app.put("/api/update/:id", (req, res) => {
  var id = parseInt(req.params.id);
  
  pool.query(`UPDATE "measure" SET "description" = $1`, ["check update"], (err, result) => {
    if (err) {
      res.send(err.message);
      throw err;
    }
    res.send(`update id = ${id}`);
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
