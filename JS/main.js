// Variables
const questions = [
    {
        question: "¿Cuál es la capital de Argentina?",
        options: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
        correct: 0
    },
    {
        question: "¿Qué animal es símbolo de Argentina?",
        options: ["Cóndor", "León", "Tigre", "Águila"],
        correct: 0
    },
    {
        question: "¿Quien es el actual presidente de Argentina?",
        options: [" Javier Milei", "Alberto Fernandez", "Carlos Saul Menem", "Lionel Andres Messo"],
        correct: 0
    },
    {
        question: "¿Cuatas provincias tiene Argentina?",
        options: ["23", "21", "16", "24"],
        correct: 0
    },
    {
        question: "En que año fue la revolucion de mayo",
        options: ["1810", "1816", "1820", "1830"],
        correct: 0
    },
    {
        question: "En que batalla murio Cabral",
        options: ["San Lorenzo", "Maypu", "Chacabuco ", "Ayacucho "],
        correct: 0
    },
    {
        question: "Que localidad es conocida como la ciudad de las diagonales",
        options: ["La Plata", "Colegiales", "Belgrano", "La boca"],
        correct: 0
    },
    {
        question: "Donde se encuentra la casa rosada",
        options: ["Ciudad de Buenos Aires", "Cordoba Capital", "San Miguel De Tucuman", "Rosario"],
        correct: 0
    },
];

let currentQuestion = 0;
let score = 0;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Función de registro
function register() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    
    if (username && password) {
        users.push({ username, password, score: 0 });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Usuario registrado exitosamente');
        showLogin();
    } else {
        alert('Por favor complete todos los campos');
    }
}

// Función de login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showGame();
    } else {
        alert('Credenciales incorrectas');
    }
}

// Mostrar vista de login
function showLogin() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
}

// Mostrar vista de registro
function showRegister() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
}

// Mostrar juego
function showGame() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    loadQuestion();
}

// Cargar pregunta
function loadQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').innerText = question.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        answersDiv.appendChild(button);
    });
}

// Verificar respuesta
function checkAnswer(selected) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('#answers button');
    
    buttons.forEach((button, index) => {
        if (index === selected) {
            if (index === question.correct) {
                button.classList.add('correct');
                score++;
            } else {
                button.classList.add('incorrect');
            }
        } else {
            if (index === question.correct) {
                button.classList.add('correct');
            }
        }
    });

    // Avanzar a la siguiente pregunta
    document.getElementById('next').style.display = 'block';
}

// Pasar a la siguiente pregunta
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
        document.getElementById('next').style.display = 'none';
    } else {
        endGame();
    }
}

// Finalizar juego
function endGame() {
    document.getElementById('score').style.display = 'block';
    document.getElementById('score').innerText = `Tu puntaje es: ${score}`;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.score = score;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    updateRanking();
}
