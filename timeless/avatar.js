// avatar 1-4 (index 0-3)
const avatars = [
    { src: "assets/characters/KEVIN.png", name: "Kevin", 
        description: `Kevin was once the Empire's most revered knight. He stood for the imperial will his entire life. 
        However, this changed after the Purge of Ponorogo. Where the Imperial command demanded the execution of Ponorogo 
        citizens. Among them were Kevin's ailed father and his younger sister. On the dawn of the execution day, 
        the people watched as the Empire's perfect weapon fire upon his own family. \n\n
        With a single sword draw, Kevin cuts cleanly with precision that branded him as the Empire's Perfect Weapon.\n
        But it was not his family that he cut. It was the executioner's blade. Kevin decided to betray the Empire and 
        escaped with his family, outpacing the Imperial Guards. Now, he wanders through cities, fighting against evil 
        wherever he could despite the people he protect calling him a traitor.` },
    { src: "assets/characters/REGINA.png", name: "Regina", 
        description: `Regina was a member of the Imperial Family. She is the daughter of the Emperor, Regina is skilled 
        on archery, However, this became an irony as the emperor was assassinated by the Demon Queen's forces by a 
        poisoned arrow. \n\n She vows to make things right by shooting the same arrow through the heart of the Demon Queen.
        Recently, she has caught rumours of the queen's presence in Ponorogo. Will she reach her?` },
    { src: "assets/characters/LINA.png", name: "Lina", 
        description: `Lina is a powerful mage within the Imperial Guards. She questioned the will of the Emperor her 
        entire life. Despising the lavish life that the emperor enjoyed. She grew close to a knight called Kevin. As time 
        goes on, Kevin and Lina became close friends. Lina was one of the key orchestrator of Kevin's escape with his family.
        \n\n Her appearance might suggests otherwise, but she is one of the strongest mage on the continent. She recently 
        hear a rumor of a Knight that travels from city through city. Fighting monsters. \n Hearing this, Lina decided to 
        resign from her position and embark a journey to find a long lost friend.` },
    { src: "assets/characters/BASTIAN.png", name: "Bastian",
        description: `Never gonna give you up, never gonna let you down. Never gonna go around and desert you. 
        Never gonna make you cry. Never gonna say goodbye~` }, // TODO: add lore, remove rickroll
];

let currentAvatarIndex = 0; // current avatar

// elements
const elements = {
    avatarImage: document.getElementById("avatarImage"),
    leftAvatar: document.getElementById("leftAvatar"),
    currentAvatar: document.getElementById("currentAvatar"),
    rightAvatar: document.getElementById("rightAvatar"),
    characterName: document.querySelector("#characterStoryContainer h2"),
    characterDescription: document.querySelector("#characterStoryContainer p"),
    characterStoryContainer: document.getElementById("characterStoryContainer"),
    avatarSelectionContainer: document.getElementById("avatarSelectionContainer"),
};

// Try preloading the image to improve server runtime performance
function preloadImages() {
    return Promise.all(avatars.map(avatar => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Failed to load image: ${avatar.src}`);
            img.src = avatar.src;
        });
    }))
    .then(() => console.log('All avatar images preloaded successfully'))
    .catch(error => console.warn(error));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    elements.avatarImage.src = avatars[currentAvatarIndex].src;
    updateAvatarDisplay();
    
    // Set up event listeners
    elements.avatarImage.addEventListener("click", handleAvatarClick);
    document.getElementById("avatarLore").addEventListener("click", handleAvatarClick);
    document.getElementById("avatarSelection").addEventListener("click", () => {
        toggleContainer(elements.avatarSelectionContainer);
        updateAvatarDisplay();
    });
    
    // Avatar selection
    document.getElementById('prevAvatar').addEventListener("click", () => navigateAvatars(-1));
    document.getElementById('nextAvatar').addEventListener("click", () => navigateAvatars(1));
    document.getElementById('leftAvatar').addEventListener('click', () => handleAvatarSelect((currentAvatarIndex - 1 + avatars.length) % avatars.length));
    document.getElementById('rightAvatar').addEventListener('click', () => handleAvatarSelect((currentAvatarIndex + 1) % avatars.length));
    document.getElementById('confirmAvatar').addEventListener('click', () => handleAvatarSelect(currentAvatarIndex));
    document.getElementById('currentAvatar').addEventListener('click', () => handleAvatarSelect(currentAvatarIndex));
    
    // Close buttons
    document.getElementById('closeAvatarSelectionContainer').addEventListener("click", () => toggleContainer(elements.avatarSelectionContainer, false));
    document.getElementById('closeStoryContainer').addEventListener("click", () => toggleContainer(elements.characterStoryContainer, false));
    document.getElementById('closeCreditsContainer').addEventListener("click", () => toggleContainer(document.getElementById('creditsContainer'), false));
    
    // Start game and credits button
    document.getElementById('credits').addEventListener('click', () => toggleContainer(document.getElementById('creditsContainer')));
    document.getElementById('startGame').addEventListener('click', handleStartGame);
});

// Toggle container visibility
function toggleContainer(container, show = true) {
    container.classList.toggle('hidden', !show);
}

// Update the avatar selection display
function updateAvatarDisplay() {
    const leftIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length; // circular index
    const rightIndex = (currentAvatarIndex + 1) % avatars.length;
    
    // Update avatar images
    elements.leftAvatar.src = avatars[leftIndex].src;
    elements.currentAvatar.src = avatars[currentAvatarIndex].src;
    elements.rightAvatar.src = avatars[rightIndex].src;
    
    [elements.leftAvatar, elements.rightAvatar].forEach(el => { // Update VFX (FOr all characters on the left/right side)
        el.classList.add('blurred');
        el.style.transform = 'scale(0.8)';
    });
    
    // Update current avatar
    elements.currentAvatar.classList.remove('blurred');
    elements.currentAvatar.style.transform = 'scale(1)';
}

// Handle avatar navigation
function navigateAvatars(direction) {
    currentAvatarIndex = (currentAvatarIndex + direction + avatars.length) % avatars.length;
    updateAvatarDisplay();
}

// Show character story
function handleAvatarClick() {
    const current = avatars[currentAvatarIndex];
    elements.characterName.textContent = `${current.name}'s Story`;
    elements.characterDescription.textContent = current.description;
    toggleContainer(elements.characterStoryContainer);
}

// Handle avatar selection confirm
function handleAvatarSelect(index) {
    currentAvatarIndex = index;
    elements.avatarImage.src = avatars[index].src;
    toggleContainer(elements.avatarSelectionContainer, false);
}

// Start game if username is already set
function handleStartGame() {
    const username = document.getElementById('avatarName').value;
    if (!username) return alert('Please enter a username.');

    // Show the intro sequence
    const introSequence = document.getElementById('introSequence');
    introSequence.classList.remove('hidden');

    setTimeout(() => {
        introSequence.style.transition = 'background-color 1s ease';
        introSequence.style.backgroundColor = '#1a202c';
    }, 10);

    // Start the sequence after background fade
    setTimeout(() => {
        startIntroSequence(username);
    }, 1000);
}

// Show the intro sequence after the user presses start game
function startIntroSequence(username) {
    const introText = document.getElementById('introText');
    const introLogo = document.getElementById('introLogo');
    const presentsText = document.getElementById('presentsText');

    const messages = [
        "Once upon a time...",
        "There was once a legendary traveler",
        `Their name was ${username}`,
        `Listen, for their tale is filled with pain`,
    ];

    // Helper to fade an element in or out
    const fade = (element, type, duration=500) => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = type === 'in' ? 1 : 0; // in = 1, out = 0
    };

    // helper for "Timeless Inc. presents" text
    const showPresentsText = () => {
        presentsText.textContent = "Timeless Inc. presents";
        presentsText.classList.add('glow');
        fade(presentsText, 'in', 2000);

        setTimeout(() => fade(presentsText, 'out', 2000), 2000); // Show for 2 seconds
    };

    // Start the intro sequence
    typeOrderedMessages(introText, messages, () => {
        fade(introText, 'out', 500); // Fade out intro text (from typeorderedMessages function)

        setTimeout(() => {
            introText.classList.add('hidden');
            showPresentsText(); // Show "Timeless Inc. presents"

            setTimeout(() => {
                fade(introLogo, 'in', 1000); // Fade in logo

                // Transition to the game
                setTimeout(() => {
                    window.location.href = `index.html?username=${username}&avatar=${currentAvatarIndex + 1}`;}, 2000);
            }, 3000);
        }, 500);
    });
}

// Type messages in a sequence elegantly :3
function typeOrderedMessages(element, messages, onComplete) {
    let currentMessage = 0;

    // yes this function is recursive, no i wont make it iterative
    const typeNextMessage = () => {
        if (currentMessage >= messages.length) { // If all messages are done
            onComplete(); // Call whatever function is passed when all messages are done
            return;
        }

        const message = messages[currentMessage];
        element.textContent = ''; // Clear the element incase of clutter
        element.style.borderRight = '.15em solid white'; // Add a typing cursor to be more immersive

        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex < message.length) {
                element.textContent += message[charIndex]; // Add one character at a time
                charIndex++;
            } else {
                // once done, stop typing, remove the cursor and wait for 2000ms before typing the next message
                clearInterval(typingInterval);
                element.style.borderRight = 'none';

                setTimeout(() => {
                    currentMessage++;
                    typeNextMessage(); // Move to the next message/continue if done
                }, 2000);
            }
        }, 50); // Type one character every 50ms
    };

    typeNextMessage(); // Start typing the first message
}