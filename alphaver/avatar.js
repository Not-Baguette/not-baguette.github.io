// avatar 1-4 (index 0-3) TODO: change this to actual avatars
const avatars = [
    "assets/GreenKnight.png",
    "assets/PinkMage.png",
    "assets/RedKnight.png",
    "assets/PinkMage.png",
];

let currentAvatarIndex = 0; // current avatar

// Get elements
const avatarImage = document.getElementById("avatarImage");
const prevAvatar = document.getElementById("prevAvatar");
const nextAvatar = document.getElementById("nextAvatar");
const submitBtn = document.getElementById("submitBtn");
const usernameInput = document.getElementById("username");

// event listeners for prev and next buttons
prevAvatar.addEventListener("click", () => {
    currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
    avatarImage.src = avatars[currentAvatarIndex];
});

nextAvatar.addEventListener("click", () => {
    currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
    avatarImage.src = avatars[currentAvatarIndex];
});

// event listener for submit button
submitBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    if (username) {
        //+1 so range is 1-4
        window.location.href = `index.html?avatar=${currentAvatarIndex+1}&username=${username}`;
    } else {
        alert("Please enter a username.");
    }
});