"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
// Middleware JSON
app.use(express.json());
app.get("/", (req, res) => {
    res.send("🚀 webhook github server test!");
});
app.listen(PORT, () => {
    console.log(`✅ server started to http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map