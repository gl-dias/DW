function validateForm() {
    
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let telefone = document.getElementById("telefone").value;
    let errorMessage = document.getElementById("error-message");

    // Reset error message
    errorMessage.textContent = "";

    // Basic validation checks
    if (nome === "") {
        errorMessage.textContent = "Name is required";
        return false;
    }

    if (!validateEmail(email)) {
        errorMessage.textContent = "Invalid email address";
        return false;
    }

    if (!validatePhone(telefone)) {
        errorMessage.textContent = "Invalid phone number. Please use the format 99 99999-9999";
        return false;
    }

    // Exibir os dados na interface
    displayUserData(nome, email, telefone);

    return true;
}

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase())};

// Phone validation function
function validatePhone(telefone) {
    const re = /^\d{2} \d{5}-\d{4}$/;
    return re.test(telefone);
}
    
// Apply mask function
function applyMask(input) {
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numericos
    if (value.length <= 2) {
        input.value = value.replace(/(\d{2})/, '$1'); // Formato: 99
    } else if (value.length <= 7) {
        input.value = value.replace(/(\d{2})(\d{5})/, '$1 $2'); // Formato: 99 99999
    } else {
        input.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3'); // Formato: 99 99999-9999
    }
}

// Função para exibir os dados recebidos na interface
function displayUserData(nome, email, telefone) {
    // Exibir o contêiner de dados
    document.getElementById("userDataDisplay").style.display = "block";

    // Preencher os dados no contêiner
    document.getElementById("displayNome").textContent = "Nome: " + nome;
    document.getElementById("displayEmail").textContent = "Email: " + email;
    document.getElementById("displayTelefone").textContent = "Telefone: " + telefone;

    // Manter os dados na tela por 5 segundos e depois esconder
    setTimeout(function() {
        userDataContainer.style.display = "none"; // Esconder os dados após 5 segundos
    }, 5000); // 5000 milissegundos = 5 segundos
}