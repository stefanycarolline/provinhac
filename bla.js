//Isso garante que os livros já cadastrados sejam mostrados assim que a página for aberta.
document.addEventListener("DOMContentLoaded", loadUsers)

//Quando o botão for clicado, essa função será executada.
const botaoSalvar = document.getElementById("botao");
botaoSalvar.addEventListener("click", async function(event) {
  
 // Impede que o formulário (caso esteja dentro de um) recarregue a página ao clicar no botão.
    event.preventDefault(); 

    //Esses comandos capturam o conteúdo dos inputs do formulário (os dados do livro que o usuário quer cadastrar).
  const titulo = document.querySelector('#titulo').value;
  const autor = document.querySelector('#autor').value;
  const ano_publicacao = document.querySelector('#data').value;
  const genero = document.querySelector('#genero').value;
  const resumo = document.querySelector('#Resumo').value;

  //Se qualquer um dos campos estiver vazio, exibe um alerta e interrompe a execução.
    if (!titulo || !autor || !ano_publicacao || !genero || !resumo) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    //Envia os dados do livro para a API usando o método POST.
    //Os dados são enviados em formato JSON.
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
        //Exibe mensagem de sucesso e chama a função loadUsers() para atualizar a lista de livros na tela.
        alert("Cadastrado com sucesso!")
        loadUsers();
        
//Se houver erro ao tentar se comunicar com o servidor, ele avisa no console e exibe um alerta.
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro na conexão. Tente novamente.");
    }
});

//para aparecer os livros cadastrados
async function loadUsers() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";
//Converte a resposta JSON para um objeto JavaScript.
    try {
        const response = await fetch('http://192.168.1.5:3000/livrosCad'); 
        const livros = await response.json();
//Se não for uma lista válida ou estiver vazia, mostra uma mensagem dizendo que não há livros cadastrados.
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
        //Se algo der errado ao buscar os livros, mostra uma mensagem de erro.
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
        container.innerHTML = "<p>Erro ao carregar livros.</p>";
    }
}
