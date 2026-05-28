# Racha Fácil 2.0

## Descrição do Projeto

O Racha Fácil 2.0 é uma aplicação web desenvolvida para facilitar a divisão de despesas entre grupos, com funcionamento inspirado em soluções como o Splitwise.

O sistema permite que usuários cadastrem gastos, informem quem pagou, quem participou e calculem automaticamente o saldo de cada pessoa, identificando quem deve e quem tem valores a receber.

O projeto foi desenvolvido com foco em simplicidade, organização financeira e facilidade de uso em cenários como viagens, eventos e contas compartilhadas.

---

## Funcionalidades

### Autenticação de Usuários
- Cadastro de usuários com nome, email e senha
- Criptografia de senha utilizando bcrypt
- Login com validação de credenciais

### Gerenciamento de Despesas
- Cadastro de despesas com:
  - Descrição
  - Valor
  - Pagador
  - Participantes
- Armazenamento das despesas no banco de dados

### Cálculo de Saldos
- Divisão automática do valor entre os participantes
- Cálculo de créditos para o pagador
- Exibição do saldo final de cada participante

### Histórico de Despesas
- Listagem das despesas cadastradas
- Visualização organizada por registros
- Opção de limpar histórico

---

## Lógica de Funcionamento

O cálculo de divisão de despesas segue a seguinte regra:

1. O valor total da despesa é dividido igualmente entre todos os participantes  
2. Cada participante recebe uma dívida proporcional à sua parte  
3. O pagador recebe o crédito total do valor pago  
4. O saldo final de cada pessoa é obtido pela soma de créditos e débitos  

### Exemplo

- Valor total: R$100  
- Participantes: 4 pessoas  
- Cada pessoa deve: R$25  

Resultado:
- Pagador: +R$100  
- Participantes: -R$25 cada  

---

## Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express

### Banco de Dados
- SQLite

### Segurança
- Bcrypt (hash de senha)

---

## Estrutura do Projeto****
project-root
│
├── public
│   ├── css
│   │   └── style.css
│   ├── js
│   │   ├── cadastro.js
│   │   ├── login.js
│   │   └── script.js
│   ├── cadastro.html
│   ├── divisao.html
│   ├── login.html
│   └── index.html
│
├── server.js
├── database.db
├── package.json
└── README.md

---

## Arquitetura

- O frontend se comunica com o backend via requisições HTTP
- O backend processa os dados e acessa o banco
- O SQLite armazena usuários e despesas

---

## Como Executar o Projeto
cd Racha-Facil2.0
npm install
npm start

---

## Melhorias Futuras

- Associar despesas a usuários
- Criar sistema de grupos
- Adicionar edição e exclusão de despesas
- Criar relatórios financeiros
- Realizar deploy em produção

---

## Segurança

- Senhas protegidas com hash utilizando bcrypt
- Validação básica de dados nas requisições
- Restrição de emails duplicados no cadastro

---

## Autor

Matheus Barbosa da Silva  
https://github.com/MatheusSilva99

---

## Conclusão

O Racha Fácil 2.0 é uma aplicação funcional para divisão de despesas, com uma base sólida e organizada, permitindo evolução para um sistema mais completo e escalável, seguindo padrões utilizados em aplicações de mercado.
