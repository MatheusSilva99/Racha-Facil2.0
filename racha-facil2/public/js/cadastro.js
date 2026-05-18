document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch("/cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Usuário cadastrado com sucesso!");

        window.location.href = "/login.html";
    } else {
        alert(data.erro);
    }
});