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

// =========================
// TABELAS
// =========================

db.serialize(() => {

    // Usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT UNIQUE,
            senha TEXT
        )
    `);

    // Despesas
    db.run(`
        CREATE TABLE IF NOT EXISTS despesas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            valor REAL,
            pagador TEXT,
            participantes TEXT,
            data DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// =========================
// CADASTRO
// =========================

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    db.run(
        `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
        `,
        [nome, email, senhaHash],
        function (erro) {

            if (erro) {
                return res.status(400).json({
                    erro: "Email já cadastrado"
                });
            }

            res.json({
                mensagem: "Usuário cadastrado"
            });
        }
    );
});

// =========================
// LOGIN
// =========================

app.post("/login", (req, res) => {

    const { email, senha } = req.body;

    db.get(
        `
        SELECT * FROM usuarios
        WHERE email = ?
        `,
        [email],
        async (erro, usuario) => {

            if (erro || !usuario) {
                return res.status(400).json({
                    erro: "Usuário não encontrado"
                });
            }

            const senhaValida = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaValida) {
                return res.status(400).json({
                    erro: "Senha incorreta"
                });
            }

            res.json({
                mensagem: "Login realizado"
            });
        }
    );
});

// =========================
// ADICIONAR DESPESA
// =========================

app.post("/despesa", (req, res) => {

    const {
        descricao,
        valor,
        pagador,
        participantes
    } = req.body;

    if (
        !descricao ||
        !valor ||
        !pagador ||
        participantes.length === 0
    ) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    db.run(
        `
        INSERT INTO despesas
        (descricao, valor, pagador, participantes)
        VALUES (?, ?, ?, ?)
        `,
        [
            descricao,
            valor,
            pagador,
            participantes.join(",")
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao salvar despesa"
                });
            }

            res.json({
                mensagem: "Despesa adicionada"
            });
        }
    );
});

// =========================
// CALCULAR SALDOS
// =========================

app.get("/saldo", (req, res) => {

    db.all(
        `
        SELECT * FROM despesas
        `,
        [],
        (erro, despesas) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar despesas"
                });
            }

            const saldos = {};

            despesas.forEach((despesa) => {

                const participantes =
                    despesa.participantes.split(",");

                const valorPorPessoa =
                    despesa.valor / participantes.length;

                // Quem pagou ganha crédito
                if (!saldos[despesa.pagador]) {
                    saldos[despesa.pagador] = 0;
                }

                saldos[despesa.pagador] += despesa.valor;

                // Participantes ganham dívida
                participantes.forEach((pessoa) => {

                    if (!saldos[pessoa]) {
                        saldos[pessoa] = 0;
                    }

                    saldos[pessoa] -= valorPorPessoa;
                });
            });

            const resultado = [];

            for (let pessoa in saldos) {

                resultado.push({
                    nome: pessoa,
                    saldo: saldos[pessoa]
                });
            }

            res.json(resultado);
        }
    );
});

// =========================
// LISTAR DESPESAS
// =========================

app.get("/despesas", (req, res) => {

    db.all(
        `
        SELECT * FROM despesas
        ORDER BY data DESC
        `,
        [],
        (erro, rows) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar despesas"
                });
            }

            res.json(rows);
        }
    );
});

// =========================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});