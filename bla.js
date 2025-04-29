document.addEventListener("DOMContentLoaded", loadUsers)

const botaoSalvar = document.getElementById("botao");

botaoSalvar.addEventListener("click", async function(event) {
    event.preventDefault(); 

  const titulo = document.querySelector('#titulo').value;
  const autor = document.querySelector('#autor').value;
  const ano_publicacao = document.querySelector('#data').value;
  const genero = document.querySelector('#genero').value;
  const resumo = document.querySelector('#Resumo').value;

    if (!titulo || !autor || !ano_publicacao || !genero || !resumo) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch('http://192.168.1.5:3000/livros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo:titulo,
                autor: autor,
                ano_publicacao: ano_publicacao,
                genero: genero,
                resumo: resumo
            }),
        });
        alert("Cadastrado com sucesso!")
        loadUsers();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro na conexão. Tente novamente.");
    }
});

//para aparecer os livros cadastrados
async function loadUsers() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    try {
        const response = await fetch('http://192.168.1.5:3000/livrosCad'); 
        const livros = await response.json();

        if (!Array.isArray(livros) || livros.length === 0) {
            container.innerHTML = "<p style='colo dr:white;text-align:center;'>Nenhum livro cadastrado ainda.</p>";
            return;
        }

        livros.forEach(livro => {
            const card = document.createElement("div");
            card.classList.add("livro-card");

            card.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Data de Publicação:</strong> ${livro.data}</p>
                <p><strong>Gênero:</strong> ${livro.genero}</p>
                <p><strong>Resumo:</strong> ${livro.resumo}</p>
                <button onclick="excluirLivro('${livro.id}')">Excluir</button>
                <p>Data de Inserção: ${new Date(livro.datainserida).toLocaleString()}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
        container.innerHTML = "<p>Erro ao carregar livros.</p>";
    }
}
