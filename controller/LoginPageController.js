const users = [
    { email: "sawani.wh@gmail.com", password: "1" },
    { email: "thiwandika.whs@gmail.com", password: "123" }
];

document.querySelector('#loginBtn').addEventListener('click', handleLogin);

function checkCredentials(email, password) {
    return users.some(user => user.email === email && user.password === password);
}

function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.querySelector('#emailLogin');
    const passwordInput = document.querySelector('#passwordLogin');
    const email = emailInput.value;
    const password = passwordInput.value;

    if (checkCredentials(email, password)) {
        alert('Login successful!');
        window.location.href = 'pages.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}



