document.getElementById("signInForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;
    const rememberMe = document.getElementById("remember").checked;

    // Validate inputs
    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Send login request
    fetch("http://localhost:5050/api/v1/auth/signIn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to authenticate. Please check your credentials.");
            }

            return response.json();
        })
        .then((data) => {
            const token = data.token;
            console.log(token)
            if (rememberMe) {
                localStorage.setItem("jwtToken", token);
            } else {
                sessionStorage.setItem("jwtToken", token);
            }

            alert("Login successful!");
            window.location.href = "./pages.html";
        })
        .catch((error) => {
            console.error("Error during login:", error);
            alert(error.message);
        });
});


function showSignUp() {
    alert("Redirecting to sign-up page...");
    window.location.href = "/signup.html";
}
