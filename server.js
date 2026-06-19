//!!!!! ATTENTION, LANCE LE SERVER AVEC la commande 'node server.js' avant d'essayer d'appeller les endpoints !!!!!// 

require("dotenv").config();
const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

app.get("/getActualUser", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            "SELECT id, nom, email FROM utilisateurs"
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

app.post("/registerUser", async (req, res) => {
    const { nom, email } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        const result = await conn.query(
            "INSERT INTO utilisateurs (nom, email) VALUES (?, ?)",
            [nom, email]
        );

        res.json({
            success: true,
            message: "Utilisateur enregistré avec succès",
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

app.post("/loginUser", async (req, res) => {
    const { nom, email } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            "SELECT id, nom, email FROM utilisateurs WHERE nom = ? AND email = ?",
            [nom, email]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Connexion réussie",
            user: rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

app.listen(3000, () => {
    console.log("API démarrée sur http://localhost:3000");
});