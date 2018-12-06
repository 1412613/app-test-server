"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const crmRoutes_1 = require("./routes/crmRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
class App {
    constructor() {
        this.routePrv = new crmRoutes_1.Routes();
        this.mongoUrl = 'mongodb://vqtuan:tuan123@ds159459.mlab.com:59459/qlda';
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('connect to mongodb successful');
            }
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map