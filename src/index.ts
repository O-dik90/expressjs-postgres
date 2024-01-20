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

app.get("/api/measureget", async (req, res) => {
  const {rows} = await pool.query("SELECT * FROM measure");
  res.send(rows);
});

app.post("/api/measureadd", async (req, res) => {
  var keterangan = req.body.description;
  var sensor = req.body.distance;
  var status = req.body.status;

 await pool.query(`INSERT INTO measure (distance, status, description) VALUES ('${sensor}', '${status}','${keterangan}')`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
   res.status(201).json({mesagge: "success add new data"});
  });
});

app.get("/api/measure/:id", async (req, res) => {
  var id = req.params.id;
  
  await pool.query(`SELECT * FROM measure WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.put("/api/measureupdate/:id", async (req,res) => {
  var id = req.params.id;
  var newKeterangan = req.body.description;
  var newSensor = req.body.distance;
  var newStatus = req.body.status;
  
  await pool.query(`UPDATE measure SET description = '${newKeterangan}', distance = '${newSensor}', status = '${newStatus}' WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(201).json({mesagge: "success update data"});
  });
});

app.delete("/api/measuredelete/:id", async (req, res) => {
  var id = req.params.id;

  await pool.query(`DELETE FROM measure WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
    }
    res.status(201).json({ message: "success delete data measure" });
  })
});

app.post("/api/relayadd", async (req, res) => {
  
  await pool.query(`INSERT INTO relay (value, description) VALUES (False, 'new Description')`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(201).json({mesagge: "success add new data relay"});
  });
});

app.get("/api/relayget/:id", async (req, res) => {
  var id = req.params.id;
  
  await pool.query(`SELECT * FROM relay where id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(200).send(result.rows[0]);
  });
});

app.put("/api/relayupdate/:id", async (req,res) => {
  var id = req.params.id;
  var newKeterangan = req.body.description;
  var newValue = req.body.value;
  var newDuration = req.body.duration;
  
  await pool.query(`UPDATE relay SET description = '${newKeterangan}', value = '${newValue}', duration = '${newDuratioon}' WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(201).json({mesagge: "success update data relay"});
  });
});

app.get("/api/termoget", async (req, res) => {
  await pool.query(`SELECT * FROM termo`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(200).send(result.rows);
  })
})

app.post("/api/termoadd", async (req, res) => {
  var newKeterangan = req.body.description;
  var newKelembaban = req.body.humidity;
  var newSuhu = req.body.temperature;
  var newPH = req.body.pH;
  var newUoM = req.body.satuan;
  var newStatus = false;
  
  await pool.query(`INSERT INTO termo (description, humidity, temperature, ph, status, satuan) VALUES ('${newKeterangan}', ${newKelembaban}, '${newSuhu}','${newPH}', '${newStatus}', '${newUoM}')` ,(err, result) => {
    if(err) {
      res.status(400).send(err.message);
    }
    res.status(201).json({message : "success add new data termo"})
  })
})

app.put("/api/termoupdate/:id", async (req, res) => {
  var id = req.params.id;
  var newKeterangan = req.body.description;
  var newKelembaban = req.body.humidity;
  var newSuhu = req.body.temperature;
  var newPH = req.body.pH;
  var newUoM = req.body.satuan;
  var newStatus = false;

  await pool.query(`UPDATE termo SET description = '${newKeterangan}', humidity = '${newKelembaban}', temperature = '${newSuhu}', ph= '${newPH}', satuan = '${newUoM}', status = '${newStatus}' WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(201).json({mesagge: "success update data termo"});
  })
})

app.delete("/api/termodelete/:id", async (req, res) => {
  var id =req.params.id;

  await pool.query(`DELETE FROM termo WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
    }
    res.status(201).json({ message: "success delete data termo" });
  })
})

app.delete("/api/alldatadelete", async (req, res) => {
  await pool.query(`DELETE FROM measure, termo`, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
      throw err;
    }
    res.status(201).json({message: "success delete all data from measure, termo"})
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
