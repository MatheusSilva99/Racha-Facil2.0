const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let contas = [];

// Criar uma conta
app.post('/conta', (req, res) => {
  const { nome, valor, pessoas } = req.body;

  const valorPorPessoa = valor / pessoas.length;

  const resultado = pessoas.map(p => ({
    nome: p,
    deve: valorPorPessoa
  }));

  contas.push({ nome, resultado });

  res.json(resultado);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});