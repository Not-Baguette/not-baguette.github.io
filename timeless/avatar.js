// avatar 1-4 (index 0-3)
const avatars = [
    "assets/characters/KEVIN.png",
    "assets/characters/REGINA.png",
    "assets/characters/LINA.png",
    "assets/characters/BASTIAN.png",
];

let currentAvatarIndex = 0; // current avatar

// Get elements
const avatarImage = document.getElementById("avatarImage");
const prevAvatar = document.getElementById("prevAvatar");
const nextAvatar = document.getElementById("nextAvatar");
const submitBtn = document.getElementById("submitBtn");
const usernameInput = document.getElementById("username");

// Function to get the greeting based on the current time
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 4) {
        return "You're up late";
    } else if (hours < 12) {
        return "Good morning";
    } else if (hours < 18) {
        return "Good afternoon";
    } else if (hours < 22) {
        return "Good evening";
    } else {
        return "Don't forget to take a rest";
    }
}

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

// Set the greeting message
const greetingMessage = `${getGreeting()}! Welcome to Timeless Adventure!`;
document.getElementById("greeting").innerText = greetingMessage;
