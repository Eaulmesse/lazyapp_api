"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const audits_1 = __importDefault(require("./routes/audits"));
const app = (0, express_1.default)();
app.use("/api/audits", audits_1.default);
app.get("/", (request, response) => {
    console.log("MYSQL_URI: ", config_1.MYSQL_URI);
    response.status(200).send("Hello World");
});
app.listen(config_1.PORT, () => {
    console.log("Server running at PORT: ", config_1.PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
