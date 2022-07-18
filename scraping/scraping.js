

const puppeteer = require("puppeteer");
const express = require('express');
const bodyParser = require('body-parser');
// const { search } = require("../routes/routes");
const app = express();
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;
const mydb = "EldenRing";

async function busqueda() {

    const browser = await puppeteer.launch({
        headless: false,
    });

    const viewAll = ["#link_button-221-2224", "#link_button-251-2224", "#link_button-258-2224", "#link_button-275-2224", "#link_button-282-2224", "#link_button-289-2224", "#link_button-301-2224", "#link_button-454-2224", "#link_button-478-2224", "#link_button-486-2224", "#link_button-494-2224", "#link_button-346-2224"]

    for (let i = 0; i < viewAll.length; i++) {
        for (let j = 1; j <= 3; j++) {
            const page = await browser.newPage();

            // Para ir a una página en concreto.
            await page.goto("https://eldenring.miyawiki.com/weapons");

            // Para hacer click al mensaje de cookies.
            //   await page.click("#sp-cc-accept");

            //Acceder al buscador de amazon po su selector. ('Selector','Búsqueda').
            // await page.type("#spf", "darkmoon greatsword");

            // //Click del botón de la búsqueda.
            // #mw-content-text > div > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a

            // //Esperamos que se cargue la página, ya que sino no encuentra nada.
            await page.waitForTimeout(1000);

            //   Recogemos en un array de las imágenes de los libros
            await page.click(viewAll[i]);
            // #link_button-221-2224
            // #link_button-251-2224
            // #link_button-258-2224
            // #mw-content-text > div > div:nth-child(9) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a
            await page.waitForTimeout(1000);

            // #shortcode-455-2253 > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a
            // #shortcode-455-2253 > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > a

            // #page-title-content

            // // console.log(document.querySelector("tbody tr"))

            await page.click(`#shortcode-455-2253 > div > table > tbody > tr:nth-child(${j}) > td:nth-child(2) > a`);

            await page.waitForTimeout(1000);

            // //Recogemos en un array los títulos
            // const titulos = await page.$$eval(".a-size-base-plus, .a-color-base, .a-text-normal", (titles) =>
            //     titles.map((title) => title.innerText)
            // );

            //Recogemos en un array el precio
            const name = await page.$eval("#page-title-content", (nombre) => nombre.innerText)
                ;
            const clase = await page.$eval("#code_block-102-2080", (clase) => clase.innerText);

            const weight = await page.$eval("#span-175-2080", (peso) => peso.innerText);

            // #code_block-102-2080


            var datosArma = {
                titulo: name,
                clase: clase,
                peso: weight
            };
            // document.getElementById('nombre').innerText=name
            console.log(datosArma);



            const myobj = { "nombre": datosArma.titulo, "clase": datosArma.clase, "peso": datosArma.peso };

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(mydb);

                dbo.collection("Armas").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("Documento insertado");
                    db.close();
                });
            });
        }

    }
    await browser.close();
    // Si headless esta en true, se oculta e chromium


    // Es como abrir una nueva página/pestaña en el navegador

    // //Se cierra el navegador


};

async function coordenadas() {

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();


    // Para ir a una página en concreto.
    await page.goto("https://eldenring.wiki.fextralife.com/Interactive+Map");

    // Para hacer click al mensaje de cookies.
    //   await page.click("#sp-cc-accept");
    await page.waitForTimeout(1000);
    //Acceder al buscador de amazon po su selector. ('Selector','Búsqueda').
    await page.type("#searchtext9", "dark moon greatsword");

    await page.click('#666');

    await page.waitForTimeout(1000);

    await page.click('#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img');


    //Recogemos en un array el precio
    const name = await page.$eval("#map > div.leaflet-control-container > div.leaflet-bottom.leaflet-center > div", (coord) => coord.innerText)
        ;


    // #code_block-102-2080

    // document.getElementById('nombre').innerText=name
    console.log(name);



    const myobj = { "nombre": datosArma.titulo, "clase": datosArma.clase, "peso": datosArma.peso };

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mydb);

        dbo.collection("Armas").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("Documento insertado");
            db.close();
        });
    });

    await browser.close();
    // Si headless esta en true, se oculta e chromium


    // Es como abrir una nueva página/pestaña en el navegador

    // //Se cierra el navegador


};

const datosArma = {
    busqueda: busqueda,
    coordenadas: coordenadas
}

module.exports = datosArma;