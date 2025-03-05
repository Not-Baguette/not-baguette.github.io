const avatars = [
    "assets/logo.jpeg",
    "assets/reaper.gif",
    "assets/avatar3.png",
    "assets/avatar4.png",
];

let currentAvatarIndex = 0;

const avatarImage = document.getElementById("avatarImage");
const prevAvatar = document.getElementById("prevAvatar");
const nextAvatar = document.getElementById("nextAvatar");
const submitBtn = document.getElementById("submitBtn");
const usernameInput = document.getElementById("username");

prevAvatar.addEventListener("click", () => {
    currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
    avatarImage.src = avatars[currentAvatarIndex];
});

nextAvatar.addEventListener("click", () => {
    currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
    avatarImage.src = avatars[currentAvatarIndex];
});

submitBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    if (username) {
        window.location.href = `index.html?avatar=${currentAvatarIndex}&username=${username}`;
    } else {
        alert("Please enter a username.");
    }
});