const API_URL = "http://localhost:3000";

const apiRoute = {
    registerUser: (nom, email) =>
        request(`${API_URL}/registerUser`, "POST", { nom, email }),

    loginUser: (nom, email) =>
        request(`${API_URL}/loginUser`, "POST", { nom, email }),

    getUsers: () =>
        request(`${API_URL}/users`)
};

const request = async (url, method = "GET", body = null) => {
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || data.message || `Erreur HTTP ${res.status}`);
    }

    return data;
};

// Menu hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Éléments du formulaire d'authentification
const connexionButton = document.getElementById('connexion-button');
const formulaireCard = document.querySelector('.formulaire-card');
const authForm = document.getElementById('auth-form');
const formulaireTitre = document.getElementById('formulaire-titre');
const submitButton = document.getElementById('submit-button');
const toggleModeText = document.getElementById('toggle-mode-text');
const toggleModeLink = document.getElementById('toggle-mode-link');
const logoutButton = document.getElementById('logout-button');
const playButton = document.getElementById('play-button');

// État en mémoire (perdu au rechargement de page)
let currentUser = null;
let formMode = "inscription"; // "inscription" ou "connexion"

// Bascule entre les modes inscription / connexion
const setFormMode = (mode) => {
    formMode = mode;
    authForm.style.display = 'flex';
    logoutButton.style.display = 'none';

    if (mode === "inscription") {
        formulaireTitre.textContent = "Inscription";
        submitButton.textContent = "S'inscrire";
        toggleModeText.textContent = "Déjà inscrit ?";
        toggleModeLink.textContent = "Se connecter";
    } else {
        formulaireTitre.textContent = "Connexion";
        submitButton.textContent = "Se connecter";
        toggleModeText.textContent = "Pas encore inscrit ?";
        toggleModeLink.textContent = "S'inscrire";
    }
};

toggleModeLink && toggleModeLink.addEventListener('click', (event) => {
    event.preventDefault();
    setFormMode(formMode === "inscription" ? "connexion" : "inscription");
});

// Met à jour le bouton de la navbar selon l'état de connexion
const updateNavbar = () => {
    connexionButton.textContent = currentUser ? currentUser.nom : "Connexion";
};

// Affiche le formulaire en mode "connecté" (juste le bouton déconnexion)
const showLoggedInView = () => {
    authForm.style.display = 'none';
    logoutButton.style.display = 'block';
    toggleModeText.style.display = 'none';
    toggleModeLink.style.display = 'none';
    formulaireTitre.textContent = `Connecté en tant que ${currentUser.nom}`;
};

// Ouverture / fermeture du formulaire au clic sur le bouton navbar ou "JOUEZ GRATUITEMENT"
const openAuthCard = () => {
    formulaireCard.style.display = 'flex';

    if (currentUser) {
        showLoggedInView();
    } else {
        toggleModeText.style.display = 'inline';
        toggleModeLink.style.display = 'inline';
        setFormMode("connexion");
    }
};

const toggleAuthCard = () => {
    const isVisible = formulaireCard.style.display === 'flex';
    if (isVisible) {
        formulaireCard.style.display = 'none';
    } else {
        openAuthCard();
    }
};

connexionButton && connexionButton.addEventListener('click', toggleAuthCard);
playButton && playButton.addEventListener('click', () => {
    if (!currentUser) {
        openAuthCard();
    }
});

// Déconnexion
logoutButton && logoutButton.addEventListener('click', () => {
    currentUser = null;
    updateNavbar();
    formulaireCard.style.display = 'none';
});

// Soumission du formulaire (inscription OU connexion selon le mode actif)
authForm && authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;

    try {
        let response;

        if (formMode === "inscription") {
            response = await apiRoute.registerUser(nom, email);
            console.log("Inscription réussie :", response);
            currentUser = { nom, email };
        } else {
            response = await apiRoute.loginUser(nom, email);
            console.log("Connexion réussie :", response);
            currentUser = response.user;
        }

        updateNavbar();
        formulaireCard.style.display = 'none';
        authForm.reset();

    } catch (error) {
        console.error("Erreur d'authentification :", error);
        alert("Erreur : " + error.message);
    }
});