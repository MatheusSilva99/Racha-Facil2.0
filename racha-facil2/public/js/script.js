let despesas = [];

// ADICIONAR DESPESA
async function adicionarDespesa() {

    const descricao =
        document.getElementById("descricao").value;

    const valor = parseFloat(
        document.getElementById("valor").value
    );

    const pagador =
        document.getElementById("pagador").value;

    const participantes =
        document.getElementById("participantes")
            .value
            .split(",")
            .map(p => p.trim());

    if (
        !descricao ||
        !valor ||
        !pagador ||
        participantes.length === 0
    ) {

        alert("Preencha todos os campos!");

        return;
    }

    const despesa = {
        descricao,
        valor,
        pagador,
        participantes
    };

    await fetch("/despesas", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(despesa)
    });

    despesas.push(despesa);

    atualizarHistorico();

    limparCampos();
}

// MOSTRAR SALDOS
function mostrarSaldos() {

    let saldos = {};

    despesas.forEach(despesa => {

        const valorPorPessoa =
            despesa.valor /
            despesa.participantes.length;

        despesa.participantes.forEach(pessoa => {

            if (!saldos[pessoa]) {

                saldos[pessoa] = 0;
            }

            saldos[pessoa] -= valorPorPessoa;
        });

        if (!saldos[despesa.pagador]) {

            saldos[despesa.pagador] = 0;
        }

        saldos[despesa.pagador] += despesa.valor;
    });

    let resultadoHTML = "<h2>Saldos</h2>";

    for (let pessoa in saldos) {

        resultadoHTML += `
            <p>
                ${pessoa}: R$ ${saldos[pessoa].toFixed(2)}
            </p>
        `;
    }

    document.getElementById("resultado").innerHTML =
        resultadoHTML;
}

// HISTÓRICO
function atualizarHistorico() {

    const historico =
        document.getElementById("historico");

    historico.innerHTML = "";

    despesas.forEach(despesa => {

        historico.innerHTML += `
            <div class="item-historico">

                <strong>${despesa.descricao}</strong><br>

                Valor: R$ ${despesa.valor.toFixed(2)}<br>

                Pagador: ${despesa.pagador}<br>

                Participantes:
                ${despesa.participantes.join(", ")}

            </div>
        `;
    });
}

// LIMPAR CAMPOS
function limparCampos() {

    document.getElementById("descricao").value = "";

    document.getElementById("valor").value = "";

    document.getElementById("pagador").value = "";

    document.getElementById("participantes").value = "";
}

// LIMPAR HISTÓRICO
document
    .getElementById("btnLimparHistorico")
    .addEventListener("click", () => {

        despesas = [];

        document.getElementById("historico").innerHTML = "";

        document.getElementById("resultado").innerHTML = "";
    });