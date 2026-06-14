async function loadCurrentUser() {
    const response = await fetch("http://localhost:3000/getActualUser");
    const users = await response.json();
    console.log(users);
    return users;
}


const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});