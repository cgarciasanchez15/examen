const express = require('express');
const router = express.Router();
const parse = require('csv-parse');
const fs = require('fs');
const baseData = [];
let initialResponseData = {};

fs.createReadStream('assets/RadiobasesExamen2019.csv').pipe(
    parse({
        delimiter: ','
    })
).on('data', dataRow => {
    baseData.push(dataRow);
}).on('end', p => {
    initialResponseData = dataFormatter(baseData);

});

router.get('/', function (req, res, next) {
    res.send(initialResponseData)
});

router.get('/region/:id', function (req, res, next) {
    const region = req.params.id;
    const fd = baseData.filter(bd => bd[2] == region);
    res.send(dataFormatter(fd))
});

router.get('/base/:id', function (req, res, next) {
    const baseId = req.params.id;
    const fd = baseData.filter(bd => bd[0].indexOf(baseId) != -1);
    res.send(dataFormatter(fd))
});

module.exports = router;

function dataFormatter(data) {
    const dateTracker = {};
    const baseTracker = {};
    const dateArray = [];
    const regionesArray = [];
    const regionesTracker = {};
    for (dataRow of data) {
        const trafico = +dataRow[3];
        /**
         * Guarda el estado de para el semaforo
         * 0 gris
         * 1 verde
         * 2 amarillo
         * 3 naranja
         * 4 rojo
         * @type {number}
         */
        let actualState = 0;

        if (trafico <= 15) {
            actualState = 4;
        } else if (trafico > 15 && trafico <= 40) {
            actualState = 3;
        } else if (trafico > 40 && trafico <= 90) {
            actualState = 2;
        } else if (trafico > 90) {
            actualState = 1;
        }

        if (!dateTracker[dataRow[1]]) {
            dateTracker[dataRow[1]] = 0;
        }
        if (!regionesTracker[dataRow[2]]) {
            regionesTracker[dataRow[2]] = 0;
        }

        if (!baseTracker[dataRow[0]]) {
            baseTracker[dataRow[0]] = {
                fechas: {}
            }
        }
        baseTracker[dataRow[0]].fechas[dataRow[1]] = {
            trafico: +dataRow[3],
            region: +dataRow[2],
            estado: actualState
        };
    }
    for (k in dateTracker) {
        dateArray.push(k)
    }
    for (k in regionesTracker) {
        regionesArray.push(k)
    }

    return {
        fechas: dateArray,
        regiones: regionesArray,
        bases: baseTracker
    }
}