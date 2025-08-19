"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const crypto = require("crypto");
const childs_process = require("child_process");
const Util = require("util");
const app = express();
const PORT = 4000;
const SECRET = "Jeanine-Banza_vps_secret_key";
const SCRIPT_PATH = '/home/eruvinga/Desktop/work/Jeanine/api';
// change exec function to async function
const execAsync = Util?.promisify(childs_process?.exec);
// Middleware JSON
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
//function 
async function deploy() {
    try {
        const { stdout, stderr } = await execAsync(`bash ${SCRIPT_PATH}/auto_deploy.sh`);
        console.log("STDOUT:", stdout);
        console.error("STDERR:", stderr);
    }
    catch (err) {
        console.error("Erreur déploiement:", err);
    }
}
// test Route
app.get("/", (req, res) => {
    res.send("🚀 webhook github server test!");
});
//web Hooks endpoint
app.post("/webhook", (req, res) => {
    // get Signature in Headers Querry
    const signature = req.headers["x-hub-signature-256"];
    if (!signature || !req.rawBody)
        return res.status(400).send("Signature manquante");
    // get Signature
    const expectedSignature = "sha256=" +
        crypto.createHmac("sha256", SECRET).update(req.rawBody).digest("hex");
    // compare signatures
    if (signature !== expectedSignature) {
        return res.status(401).send("Signature invalide");
    }
    //Execute script
    console.log("✅ Webhook vérifié, payload:", req.body);
    //Deploy App
    deploy();
    res.send("ok");
});
// listen server datas
app.listen(PORT, () => {
    console.log(`✅ server started to http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map