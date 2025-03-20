"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.get("/error", (req, res) => {
    res.status(500).send("Hello world");
});
app.get("/not-found", (req, res) => {
    res.status(404).send("Hello world");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
