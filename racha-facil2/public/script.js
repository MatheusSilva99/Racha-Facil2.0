function dividir() {
  const valor = parseFloat(document.getElementById('valor').value);

  const pessoas = document.getElementById('pessoas').value
    .split(',')
    .map(p => p.trim());

  fetch('/conta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: 'Conta',
      valor: valor,
      pessoas: pessoas
    })
  })
  .then(res => res.json())
  .then(dados => {

    let html = "";

    dados.forEach(pessoa => {
      html += `<p><strong>${pessoa.nome}</strong> deve R$ ${pessoa.deve.toFixed(2)}</p>`;
    });

    document.getElementById("resultado").innerHTML = html;
  });
}