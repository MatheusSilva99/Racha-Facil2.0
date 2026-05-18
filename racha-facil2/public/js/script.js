async function dividir() {

  const valor = parseFloat(
    document.getElementById('valor').value
  );

  const pessoas = document
    .getElementById('pessoas')
    .value
    .split(',')
    .map(p => p.trim())
    .filter(p => p !== '');

  if (!valor || pessoas.length === 0) {
    alert('Preencha os campos!');
    return;
  }

  try {

    const resposta = await fetch('/conta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valor,
        pessoas
      })
    });

    const dados = await resposta.json();

    let html = '';

    dados.forEach(pessoa => {
      html += `
        <p>
          <strong>${pessoa.nome}</strong>
          deve R$ ${pessoa.deve.toFixed(2)}
        </p>
      `;
    });

    document.getElementById('resultado').innerHTML = html;

  } catch (erro) {
    alert('Erro ao calcular');
    console.log(erro);
  }
}