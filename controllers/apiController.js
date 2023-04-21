var config = require("../config");
var pgp = require("pg-promise")();
var db = pgp(config.getDbConnectionString());
module.exports = function (app) {
    app.get("/api/rooms", function (req, res) {
        db.any("SELECT DISTINCT room FROM controller_sensor")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });

    app.get("/api/room/:number/sensors", function (req, res) {
        db.any(
            "SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id " +
            "WHERE controller_sensor.room=" + req.params.number + ":: varchar"
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });

    app.get("/api/controller", function (req, res) {
        db.any("SELECT DISTINCT controllername FROM controller")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });

    app.get("/api/controller/sensors", function (req, res) {
        const id_controller = req.params.id;
        db.any(
            "SELECT controller.controllername, sensor.sensorname FROM public.controller_sensor JOIN public.sensor ON controller_sensor.id_sensor = sensor.id JOIN public.controller ON controller.id = controller_sensor.id_controller")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any sensors for the specified controller",
                    error: err,
                });
            });


    });

    app.get("/api/data/today/room/44", function (req, res) {
        db.any(`
            SELECT datasensor.date_time, sensor.sensorname, datasensor.data, typevalue.valuetype, typevalue.dimension
            FROM public.datasensor
            JOIN public.controller_sensor ON datasensor.id_controllersensor = controller_sensor.id
            JOIN public.sensor ON controller_sensor.id_sensor = sensor.id
            JOIN public.typevalue ON datasensor.id_typevalue = typevalue.id
            WHERE controller_sensor.room = '44';
        `)
        .then(function (data) {
            res.json({
                status: "success",
                data: data,
            });
        })
        .catch((err) => {
            res.json({
                description: "Can’t find any sensors for the specified controller",
                error: err,
            });
        });
    });
    
      





};
