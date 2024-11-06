const artigo = document.querySelector('#art')

const button = document.createElement('button')
button.textContent = 'ok'

artigo.appendChild(button);

button.addEventListener('click', () => {
    alert('Você clicou no botão!');
});