
const API_URL = "http://localhost:3000";

const apiRoute = {
    registerUser: (nom, email) =>
        request(`${API_URL}/registerUser`, "POST", { nom, email }),

    getUsers: () =>
        request(`${API_URL}/users`)
};

const request = async (url, method = "GET", body = null) => {
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null
    });

    return res.json();
};

const handleRegisterUser = async (nom, email) => {
    try {
        const response = await apiRoute.registerUser(nom, email);
        console.log("Utilisateur enregistré avec succès :");
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    }
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

const connexionButton = document.getElementById('connexion-button');
const formulaireCard = document.querySelector('.formulaire-card');

connexionButton && connexionButton.addEventListener('click', () => {
    const isVisible = formulaireCard.style.display === 'flex';
    formulaireCard.style.display = isVisible ? 'none' : 'flex';
});

const registerForm = document.getElementById('register-form');
registerForm && registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;

    await handleRegisterUser(nom, email);
    console.log("Formulaire soumis :", { nom, email });
});