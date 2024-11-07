const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submit-btn');
const spinner = document.getElementById('spinner');

// Desabilitar botão até que todos os campos sejam preenchidos
function checkAllFieldsFilled() {
    submitButton.disabled = ![...form.elements].every(input => input.value.trim() !== '');
}
form.addEventListener('input', checkAllFieldsFilled);

// Função de validação do formulário
function validateForm() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let telefone = document.getElementById("telefone").value;
    let assunto = document.getElementById("assunto").value;
    let message = document.getElementById("message").value;
    let imagem = document.getElementById("imagem").files[0];
    let errorMessage = document.getElementById("error-message");

    // Limpa mensagem de erro anterior
    errorMessage.textContent = "";

    // Validação do nome
    if (name === "") {
        errorMessage.textContent = "Nome é obrigatório";
        return false;
    }

    // Validação do email
    if (!validateEmail(email)) {
        errorMessage.textContent = "Email inválido";
        return false;
    }

    // Validação do telefone
    if (!validatePhone(telefone)) {
        errorMessage.textContent = "Telefone inválido. Use o formato:(99) (99) 99999-9999";
        return false;
    }

    // Validação do assunto
    if (assunto === "") {
        errorMessage.textContent = "Selecione um assunto";
        return false;
    }

    // Validação da mensagem
    if (message === "") {
        errorMessage.textContent = "Mensagem é obrigatória";
        return false;
    }

    if (message.length < 100) {
        errorMessage.textContent = "Mensagem deve ter pelo menos 100 caracteres";
        return false;
    }

    // Validação opcional da imagem
    if (imagem && !validateImage(imagem)) {
        errorMessage.textContent = "Arquivo deve ser uma imagem PNG";
        return false;
    }

    return true;
}

// Função para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Função para validar telefone
function validatePhone(phone) {
    const re = /^\(\d{2}\)\s\(\d{2}\)\s\d{5}-\d{4}$/;
    return re.test(phone);
}

// Validação de imagem (somente PNG)
function validateImage(file) {
    return file && file.type === "image/png";
}

// Máscara do telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', function() {
    let value = telefoneInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    
    // Aplica a máscara para (99) (99) 99999-9999
    if (value.length > 11) value = value.slice(0, 13); // Limita a 11 dígitos
    if (value.length > 6) {
        value = `(${value.slice(0, 2)}) (${value.slice(2, 4)}) ${value.slice(4, 9)}-${value.slice(9)}`;
    } else if (value.length > 4) {
        value = `(${value.slice(0, 2)}) (${value.slice(2, 4)}) ${value.slice(4)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) (${value.slice(2)}`;
    } else {
        value = `(${value}`;
    }
    
    telefoneInput.value = value;
});

// Visualização da imagem
document.getElementById("imagem").addEventListener("change", function() {
    const file = this.files[0];
    const preview = document.getElementById("preview");

    if (file && validateImage(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            preview.style.width = '150px'; // Define a largura da imagem
            preview.style.height = 'auto'; // Ajusta a altura para manter a proporção
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        showError(this, "Apenas arquivos PNG são permitidos");
    }
});

// Verificar preenchimento de campos
form.addEventListener("input", validateForm);

// Envio do formulário
form.addEventListener("submit", async function(e) {
    e.preventDefault();  // Impede o envio tradicional do formulário
    
    // Verifica se o formulário é válido
    if (validateForm()) {
        // Exibe o spinner e desabilita o botão
        spinner.style.display = 'block';  // Exibe o spinner
        submitButton.disabled = true;  // Desabilita o botão
        submitButton.style.backgroundColor = '#ccc';  // Torna o botão cinza (feedback visual)

        try {
            // Simula o tempo de processamento do envio
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Exibe mensagem de sucesso
            alert("Formulário enviado com sucesso!");

            // Oculta a imagem de pré-visualização
            const preview = document.getElementById("preview");
            preview.style.display = 'none';
            preview.src = '';  // Limpa a imagem da pré-visualização

            // Aguarda 2 segundos antes de redirecionar
            setTimeout(() => {
                // Redireciona para a página de sucesso
                window.location.href = 'sucesso.html';  
            }, 2000);  // Delay de 2 segundos para garantir que o alerta tenha tempo de ser exibido

        } catch (error) {
            alert("Erro ao enviar formulário: " + error.message);
        } finally {
            // Esconde o spinner e reabilita o botão
            spinner.style.display = 'none';
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '';  // Restaura a cor original do botão
        }
    }
});
//nem tudo esta funcionando não consegui fazer algumas