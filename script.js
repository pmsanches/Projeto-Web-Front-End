const STORAGE_KEY = 'reaproveita_users';

// Funções de Leitura e Escrita no Local Storage
function read() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function write(v) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referências aos Elementos DOM
    const form = document.getElementById('userForm');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const list = document.getElementById('userList');
    const search = document.getElementById('searchInput');
    
    // Novos botões
    const delAllBtn = document.getElementById('delAllBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Função para Limpar os campos do formulário
    function clearForm() {
        nome.value = '';
        email.value = '';
    }

    // 2. Função de Renderização da Lista (Listagem e Pesquisa)
    function render() {
        const q = (search.value || '').toLowerCase();
        list.innerHTML = '';
        
        // Aplica a pesquisa (filtra pelo nome OU e-mail)
        read()
            .filter(u => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
            .forEach(u => {
                const li = document.createElement('li');
                
                // Formata a data para exibição (Condição: mostrar data de envio)
                const dateString = new Date(u.date).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                // Conteúdo da linha: Nome — E-mail — Data
                li.innerHTML = `
                    <span>
                        <strong>${u.name}</strong> — ${u.email}
                        <br><small>Data: ${dateString}</small>
                    </span>
                `;

                // Botão de Excluir Individual
                const del = document.createElement('button');
                del.textContent = 'Excluir';
                del.className = 'btn-delete'; // Para estilização opcional

                // Lógica de Exclusão Individual (mais robusta usando o timestamp 'date' como ID)
                del.onclick = () => {
                    const arr = read();
                    // Encontra o índice exato do usuário com base no timestamp (ID único)
                    const indexToDelete = arr.findIndex(item => item.date === u.date);
                    
                    if (indexToDelete > -1) {
                        arr.splice(indexToDelete, 1); // Exclui o item
                        write(arr);
                        render(); // Atualiza a lista
                    }
                };
                
                li.appendChild(del);
                list.appendChild(li);
            });
    }

    // 3. Funcionalidade de Cadastro (Adicionar ao Local Storage)
    form.onsubmit = e => {
        e.preventDefault();
        
        const arr = read();
        // Adiciona um novo usuário, incluindo o timestamp atual para a data de envio
        arr.push({
            name: nome.value,
            email: email.value,
            date: Date.now() // timestamp (Usado como ID)
        });
        
        write(arr);
        clearForm(); // Condição: Limpar campos após o envio
        render();
    };

    // 4. Opção para Limpar Campos do Formulário
    clearBtn.onclick = clearForm;

    // 5. Opção para Excluir Todos os Itens
    delAllBtn.onclick = () => {
        if (confirm("Tem certeza que deseja EXCLUIR TODOS os usuários? Esta ação é irreversível.")) {
            localStorage.removeItem(STORAGE_KEY); // Remove a chave do Local Storage
            render(); // Atualiza a lista (que estará vazia)
        }
    };

    // 6. Opção de Pesquisa
    search.oninput = render;
    
    // Inicializa a lista ao carregar a página
    render();
});
