const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'EldenRing'
});
const functions = require("../functions/functions.js");
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;
const mydb = "EldenRing";

const sendMail = require("../email")

const user = {

    listaClases: (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(mydb);

            dbo.collection("Clases").find({}).toArray(function (err, result) {
                if (err) throw err;

                res.json({
                    data: result
                })

                // db.close();
            });
        });
    },

    register: (req, res) => {

        let queryE = `SELECT email from Usuarios WHERE email = '${req.body.email}' `;
        let queryN = `SELECT nic from Usuarios WHERE nic = '${req.body.nic}'`;
        //hacer dos búsquedas
        connection.query(queryE, async (err, rowsE) => {
            if (err) throw err;

            connection.query(queryN, async (err, rowsN) => {
                if (err) throw err;

                console.log(rowsE)
                console.log(rowsN)
                if (rowsE[0] == undefined && rowsN[0] == undefined) {


                    const sql = `INSERT INTO Usuarios VALUES (null,'${req.body.nic}',false,'${req.body.email}','${req.body.build}',SHA('${req.body.pass}'))`;
                    connection.query(sql, (err, response) => {
                        if (err) throw err;

                        res.json({
                            message: 'right'
                        });
                    });


                } else {
                    res.json({
                        message: 'wrong'
                    });
                }
            });
        });


        // console.log('hola')
        //da fallo de proxy al actualizar
        //el documento unicamente después de
        //haberle dado al botón
    },
    login: (req, res) => {







        //contraseña encriptada
        let query = `SELECT * from Usuarios WHERE email = '${req.body.email}'`;
        // let queryI = `SELECT id from Usuarios WHERE email = '${req.body.email}'`;


        connection.query(query, async (err, rows) => {
            if (err) throw err;

            if (rows[0].id != undefined) {

                if (rows[0].pass != undefined) {

                    if (rows[0].pass == functions.SHA1(req.body.pass)) {


                        // res.json({
                        //     name: result.nombre,
                        //     class: result.clase
                        // })
                        res.json({
                            message: 'right',
                            nic: rows[0].nic,
                            build: rows[0].build
                        });
                    } else {
                        res.json({
                            message: 'wrong'
                        });
                    }
                } else {
                    res.json({
                        message: 'wrong'
                    });
                }
                // db.close();

            } else {
                res.json({
                    message: 'wrong'
                });
            }



        });
    },
    weapon: (req, resultado) => {







        //contraseña encriptada
        let query = `SELECT * from Usuarios WHERE nic = '${req.body.user}'`;
        // let queryI = `SELECT id from Usuarios WHERE email = '${req.body.email}'`;


        connection.query(query, async (err, rows) => {
            if (err) throw err;

            console.log(rows[0].id)
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(mydb);

                dbo.collection("Armas").findOne({ nombre: req.body.weapon }, async function (err, result) {
                    if (err) throw err;

                    console.log(result)
                    const myobj = { "nombre": await result.nombre, "clase": await result.clase, "peso": await result.peso, "usuario": await rows[0].id };

                    dbo.collection("ArmasColeccionadas").insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("Documento insertado");
                        resultado.json({
                            message: 'Weapon acquired'
                        })
                    });

                    // db.close();
                });
            });
            // db.close();
        });






    },

    legendaryWeapon: (req, resultado) => {




        console.log('hola')


        //contraseña encriptada
        let query = `SELECT * from Usuarios WHERE nic = '${req.body.user}'`;
        // let queryI = `SELECT id from Usuarios WHERE email = '${req.body.email}'`;


        connection.query(query, async (err, rows) => {
            if (err) throw err;

            console.log(rows[0].id)
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(mydb);

                dbo.collection("ArmasLegendarias").findOne({ nombre: req.body.weapon }, async function (err, result) {
                    if (err) throw err;
                    ;
                    console.log(result)
                    const myobj = { "nombre": await result.nombre, "clase": await result.clase, "peso": await result.peso };

                    const insertquery = `INSERT INTO ArmasLegendarias VALUES (null,'${myobj.nombre}','${myobj.clase}','${myobj.peso}',${rows[0].id})`;

                    connection.query(insertquery, async (err, rows) => {
                        if (err) throw err;

                        console.log("Documento insertado");
                        resultado.json({
                            message: 'Weapon acquired'
                        })
                        // db.close();
                    });

                    // db.close();
                });
            });
            // db.close();
        });






    },
    profileWeapon: (req, resultado) => {


        let query = `SELECT * from Usuarios WHERE nic = '${req.body.user}'`;



        connection.query(query, async (err, rows) => {
            if (err) throw err;


            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(mydb);

                dbo.collection("ArmasColeccionadas").find({ usuario: rows[0].id }).toArray(function (err, result) {
                    if (err) throw err;
                    //res.send(result)

                    resultado.json({
                        datos: result
                    })

                    //db.close();
                });


            });
            // db.close();
        });

    },

    profileWeaponL: (req, resultado) => {


        let query1 = `SELECT * from Usuarios WHERE nic = '${req.body.user}'`;




        connection.query(query1, async (err, rows1) => {
            if (err) throw err;



            let query2 = `SELECT * from ArmasLegendarias WHERE fk_id_usuario = ${rows1[0].id}`;

            connection.query(query2, async (err, rows2) => {
                if (err) throw err;



                resultado.json({
                    datos: rows2
                })
                // db.close();
            });
            // db.close();
        });

    },
    allWeapons: (req, resultado) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(mydb);

            dbo.collection("Armas").find({}).toArray(function (err, result) {
                if (err) throw err;
                dbo.collection("ArmasLegendarias").find({}).toArray(function (err, resultL) {
                    if (err) throw err;
                    //res.send(result)

                    resultado.json({
                        datos: result,
                        datosL: resultL
                    })

                    //db.close();
                });



                //db.close();
            });


        });


    },
    change: (req, resultado) => {

        for (let i = 1; i <= 9; i++) {


            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(mydb);

                var ranNumX = Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1)

                var myqueryX = { "id": i };
                var newvaluesX = { $set: { "x": ranNumX } };

                dbo.collection("ArmasLegendarias").updateOne(myqueryX, newvaluesX, function (err, res) {
                    if (err) throw err;
                    console.log("Documento actualizado");
                    // db.close();
                });
            });
        }

        for (let i = 1; i <= 9; i++) {


            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(mydb);

                var ranNumY = Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1)

                var myqueryY = { "id": i };
                var newvaluesY = { $set: { "y": ranNumY } };

                dbo.collection("ArmasLegendarias").updateOne(myqueryY, newvaluesY, function (err, res) {
                    if (err) throw err;
                    console.log("Documento actualizado");
                    // db.close();
                });
            });
        }







    },
    contact: (req, resultado) => {

        if (req.body.email) {
            let emailUser = req.body.email

            sendMail("gottskalkraud@gmail.com", "gottskalkraud@gmail.com", "Suggestions", `From: ${emailUser} \n
            ${req.body.text}`)
            resultado.json({
                message: 'Thank you for your input!'
            })
        }
        if (req.body.nic) {
            let nic = req.body.nic

            let queryE = `SELECT email from Usuarios WHERE nic = '${nic}' `;

            connection.query(queryE, async (err, rowsE) => {
                if (err) throw err;

                sendMail("gottskalkraud@gmail.com", "gottskalkraud@gmail.com", "Suggestions", `From: ${rowsE[0].email} \n
                ${req.body.text}`)

                resultado.json({
                    message: 'Thank you for your input!'
                })
            });

        }


    }

    // profile: (req, res) => {



    //     res.json({
    //         nic: 'wilfredo',
    //         build: 'blood mage'
    //     });
    // }
};

module.exports = user;