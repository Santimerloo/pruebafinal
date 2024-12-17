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
        options: ["Javier Milei", "Alberto Fernandez", "Carlos Saul Menem", "Lionel Andres Messi"],
        correct: 0
    },
    {
        question: "¿Cuántas provincias tiene Argentina?",
        options: ["23", "21", "16", "24"],
        correct: 0
    },
    {
        question: "¿En qué año fue la Revolución de Mayo?",
        options: ["1810", "1816", "1820", "1830"],
        correct: 0
    },
    {
        question: "¿En qué batalla murió Cabral?",
        options: ["San Lorenzo", "Maypu", "Chacabuco", "Ayacucho"],
        correct: 0
    },
    {
        question: "¿Qué localidad es conocida como la ciudad de las diagonales?",
        options: ["La Plata", "Colegiales", "Belgrano", "La Boca"],
        correct: 0
    },
    {
        question: "¿Dónde se encuentra la Casa Rosada?",
        options: ["Ciudad de Buenos Aires", "Córdoba Capital", "San Miguel de Tucumán", "Rosario"],
        correct: 0
    },
    {
        question: "¿De que pais se independizo Argentina?",
        options: ["Estados Unidos", "Inglaterra", "España", "Francia"],
        correct: 2
    },
    {
        question: "¿Quien es el creador de la bandera argentina?",
        options: ["San Martin", "Mariano Moreno", "Cornelio Savedra", "Manuel Belgrano"],
        correct: 3
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
        // Verificar si el usuario ya existe
        if (users.some(user => user.username === username)) {
            Swal.fire('Error', 'El usuario ya está registrado', 'error');
            return;
        }
        users.push({ username, password, score: 0 });
        localStorage.setItem('users', JSON.stringify(users));
        Swal.fire('Éxito', 'Usuario registrado exitosamente', 'success');
        showLogin();
    } else {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
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
        Swal.fire('Credenciales incorrectas');
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

    loadInitialUsers().then(() => {
        loadQuestion();
        updateRanking();
    });
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

    // Guardar puntaje del usuario actual
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.score = score;

    // Actualizar puntaje del usuario actual
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex].score = score; // Actualizar puntaje en el array de usuarios
    }

    // Guardar los cambios en localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Mostrar ranking actualizado
    updateRanking();
}

// Actualizar ranking
function updateRanking() {
    const sortedUsers = users.sort((a, b) => b.score - a.score); // Ordenar por puntaje descendente
    const rankingTable = document.querySelector('#rankingTable tbody');

    // Limpiar la tabla
    rankingTable.innerHTML = '';

    // Insertar usuarios y puntajes
    sortedUsers.forEach((user, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.score}</td>
            </tr>
        `;
        rankingTable.innerHTML += row;
    });
}

// Cargar usuarios desde el JSON y combinarlos con localStorage
async function loadInitialUsers() {
    try {
        const response = await fetch('JS/users.json');
        const jsonUsers = await response.json();

        // Obtener usuarios del localStorage
        const localUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Evitar duplicados y combinar usuarios
        jsonUsers.forEach(jsonUser => {
            if (!localUsers.find(user => user.username === jsonUser.username)) {
                localUsers.push(jsonUser);
            }
        });

        // Guardar usuarios combinados en localStorage
        localStorage.setItem('users', JSON.stringify(localUsers));
        users = localUsers;


    } catch (error) {
        console.error('Error al cargar usuarios desde JSON:', error);
    }
}
