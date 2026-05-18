const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Banco SQLite
const db = new sqlite3.Database("./database.db");

// Criar tabela
db.run(`
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
)
`);

// Página inicial → login
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// Cadastro
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        db.run(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, senhaHash],
            function (err) {
                if (err) {
                    return res.status(400).json({
                        erro: "Email já cadastrado"
                    });
                }

                res.json({
                    mensagem: "Usuário cadastrado com sucesso"
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            erro: "Erro no servidor"
        });
    }
});

// Login
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    erro: "Erro no servidor"
                });
            }

            if (!usuario) {
                return res.status(401).json({
                    erro: "Usuário não encontrado"
                });
            }

            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    erro: "Senha incorreta"
                });
            }

            res.json({
                mensagem: "Login realizado com sucesso"
            });
        }
    );
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});