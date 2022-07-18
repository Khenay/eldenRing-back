const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'EldenRing'
});
const functions = require("../functions/functions.js");
const mydb = "eldenRing";

const jwt = require("jsonwebtoken");
const sendMail = require("../email")




const SECRET = "miyazaki";

const passRecovery = {

    //next con req,res
    confirmedUser: async (req, res) => {
        let emailUser = req.body.email;

        let queryE = `SELECT email from Usuarios WHERE email = '${emailUser}' `;


        connection.query(queryE, async (err, rowsE) => {
            if (err) throw err;


            if (rowsE != null) {


                const payload = {
                    email: emailUser,


                };
                const token = jwt.sign(payload, SECRET, { expiresIn: "45m" });

                const link = `<a href="http://localhost:3000/recoveryReset/${emailUser}/${token}">Cambiar contraseña</a>`;
                console.log(link);
                sendMail("gottskalkraud@gmail.com", `${emailUser}`, "Recuperación de contraseña", `${link}`)

                res.json({
                    message: "Check your email account in order to retrieve your password"
                })
            } else {
                res.json({
                    message: "User not registered"
                });
                console.log('El usuario no existe')
            }

        });




    },




    checkUserPost: async (req, res) => {



        const { email, pass, token } = req.body;

        console.log(email)
        console.log(pass)
        console.log(token)

        let queryE = `SELECT * from Usuarios WHERE email = '${email}' `;

        //hacer dos búsquedas
        connection.query(queryE, async (err, rowsE) => {
            if (err) throw err;

            console.log(rowsE)
            if (rowsE[0].email == email) {
                console.log('el email coincide')

                try {
                    const check = jwt.verify(token, SECRET);


                    let updateQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                    let query4 = mysql.format(updateQuery, ["Usuarios", "pass", `${functions.SHA1(pass)}`, "id", `${rowsE[0].id}`]);

                    connection.query(query4, (err, response) => {
                        if (err) throw err;



                        //connection.end();
                    });

                    sendMail("gottskalkraud@gmail.com", `${email}`, "Cambio de contraseña", 'Tu contraseña se ha cambiado con éxito')
                    res.json({
                        message: 'Password changed succesfuly, you can now close this tab',

                    })

                    console.log('TOKEN OK')





                } catch (error) {
                    console.log(error)

                    res.json({
                        message: 'Could not confirm your user. Perhaps your token is invalid'
                    })
                }
            }
        });












    },

    confirmUserGet: async (req, res) => {
        const { email, token } = req.params;

        let queryE = `SELECT * from Usuarios WHERE email = '${req.body.email}' `;

        connection.query(queryE, async (err, rowsE) => {
            if (err) throw err;

            if (rowsE[0].email == email) {
                console.log('el email coincide')
            } else {
                console.log('el email no coincide')
            }

            try {
                const check = jwt.verify(token, SECRET);
                res.json(window.location.assign("/recoveryReset"), { email: email })

                console.log('TOKEN OK')
            } catch (error) {
                console.log(error)
            }

        });



    },





}

module.exports = passRecovery;