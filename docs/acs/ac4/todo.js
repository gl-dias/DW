let tarefas = [];

function comandos() {
  console.log("1 - Adicionar tarefa");
  console.log("2 - Remover tarefa");
  console.log("3 - Listar tarefas");
  console.log("4 - Sair");
}

function adTarefa() {
  const novaTarefa = prompt("Digite a nova tarefa:");
  tarefas.push(novaTarefa);
  console.log(`Tarefa "${novaTarefa}" adicionada.`);
}

function removerTarefa() {
  const index = parseInt(prompt("Digite o índice da tarefa a ser removida:")) - 1; /* -1 pois começa em 0 */
  if (index >= 0 && index < tarefas.length) {
    const removed = tarefas.splice(index, 1);
    console.log(`Tarefa "${removed}" removida.`);
  } else {
    console.log("Índice inválido.");
  }
}

function listarTarefas() {
  console.log("Lista de Tarefas:");
  tarefas.forEach((tarefas, index) => {
    console.log(`${index + 1}. ${tarefas}`);
  });
}

function main() {
  let escolha;
  while (escolha !== 4) {
    comandos();
    escolha = parseInt(prompt("Escolha uma opção:"));
    switch (escolha) {
      case 1:
        adTarefa();
        break;
      case 2:
        removerTarefa();
        break;
      case 3:
        listarTarefas();
        break;
      case 4:
        console.log("Saindo...");
        break;
      default:
        console.log("Opção inválida.");
    }
  }
}

main()