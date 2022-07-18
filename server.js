const express =require("express")
const app = express()
const router =require("./routes/routes")
const weapon= require("./scraping/scraping")
const port =  5000
app.use(express.json())
app.use("/",router)

app.listen(port , console.log("Sevidor escuchando en puerto "+ port))

const mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;
const mydb = "EldenRing";

// weapon.coordenadas();

// const myobj = { "nombre": weapon., "clase": weapon.clase, "peso": weapon.peso };

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db(mydb);
    
//     dbo.collection(coleccion).insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("Documento insertado");
//         db.close();
//     });
//     });