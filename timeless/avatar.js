// avatar 1-4 (index 0-3)
const avatars = [
    { src: "assets/characters/KEVIN.png", name: "Kevin", 
        description: `Kevin is a descendant of a great knight family from Ponorogo. He used to live happily with his parents in Ponorogo before "the incident" that caused monsters from the underworld to crawl to the surface and occupy several key cities, one of them, Ponorogo. Kevin was evacuated to Jakarta and spent the rest of his life training himself to be a good knight. Now he's ready for a new journey to take back what he had lost!` },
    { src: "assets/characters/REGINA.png", name: "Regina", 
        description: `Regina is a daughter of a noble in Jambi, since she was a kid, she always wanted to become a mage. But after several rejections from her noble family, she ran away to Jakarta and learn magic herself to prove that her parents were wrong. After "the incident" occurred, she finally had a chance to prove herself worthy and began her new journey!` },
    { src: "assets/characters/LINA.png", name: "Lina", 
        description: `Lina is a daughter of a famous trader from Pontianak. Lina is also known for her skilled stealth with dagger and sword. During "the incident", her father died after being attacked by several monsters, and Lina was forced to evacuate to Jakarta. She grew as a fighter to avenge her father and left her normal life for a new journey ahead!` },
    { src: "assets/characters/BASTIAN.png", name: "Bastian",
        description: `Bastian is an orphan in Jakarta, since he was little he developed his interest in magic and spells. He's often nicknamed a kid prodigy and wonder boy for he is a skilled caster. After "the incident" occurred, he saw the opportunity to use his power for greater good, after all he loves a little journey!` },
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

// Try preloading all assets to improve server runtime performance
function preloadAssets(){
    const imagePromises = avatars.map(avatar => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Failed to load image: ${avatar.src}`);
            img.src = avatar.src;
        });
    });

    return Promise.all(imagePromises)
        .then(() => console.log('All image assets preloaded successfully'))
        .catch(error => console.warn(error));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    preloadAssets().then(() => {
        console.log('Assets preloaded. Waiting for user interaction to start the game.');

        // Show the BGM button
        const bgmButton = document.getElementById('enableBgmButton');
        bgmButton.classList.remove('hidden');

        // Play background music when the button is clicked
        bgmButton.addEventListener('click', () => {
            const backgroundMusic = document.getElementById('backgroundMusic');
            backgroundMusic.volume = 0.3; // Jesus this was loud
            backgroundMusic.play().catch(error => console.warn('Failed to play background music:', error));
            bgmButton.classList.add('hidden'); // Hide the button after enabling BGM
        });
        preloadAssets();
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
});

// Toggle container visibility
function toggleContainer(container, show = true){
    container.classList.toggle('hidden', !show);
    
    const clickSound = document.getElementById('clickSound');
    clickSound.volume = 1;
    clickSound.play();
}

/* ===== Avatars ===== */
// Update the avatar selection display
function updateAvatarDisplay(){
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
function navigateAvatars(direction){
    currentAvatarIndex = (currentAvatarIndex + direction + avatars.length) % avatars.length;
    updateAvatarDisplay();
}

// Show character story
function handleAvatarClick(){
    const current = avatars[currentAvatarIndex];
    elements.characterName.textContent = `${current.name}'s Story`;
    elements.characterDescription.textContent = current.description;
    toggleContainer(elements.characterStoryContainer);
}

// Handle avatar selection confirm
function handleAvatarSelect(index){
    currentAvatarIndex = index;
    elements.avatarImage.src = avatars[index].src;
    toggleContainer(elements.avatarSelectionContainer, false);
}

/* ===== Intro Sequence ===== */
// Start game if username is already set
function handleStartGame(){
    const username = document.getElementById('avatarName').value;
    if (!username) return alert('Please enter a username.');
    const introSequence = document.getElementById('introSequence');
    const bgmButton = document.getElementById('enableBgmButton');
    // Stop the background music if it's playing
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic.paused) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset to the beginning
    }

    // Show the intro sequence & hide the Enable BGM button
    introSequence.classList.remove('hidden');
    bgmButton.classList.add('hidden');

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
function startIntroSequence(username){
    const introMusic = document.getElementById('introMusic');
    const introText = document.getElementById('introText');
    const introLogo = document.getElementById('introLogo');
    const presentsText = document.getElementById('presentsText');

    const messages = [
        "Once upon a time...",
        "There was once a legendary traveler,",
        `Their name was ${username}.`,
        `Listen, for their tale is filled with labor and strife...`,
    ];

    introMusic.volume = 0.1; // too loud...
    introMusic.play();

    const fade = (element, type, duration = 500) => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = type === 'in' ? 1 : 0;
    };

    const showPresentsText = () => {
        presentsText.textContent = "Timeless Inc. presents";
        presentsText.classList.add('glow');
        fade(presentsText, 'in', 2000);

        setTimeout(() => fade(presentsText, 'out', 2000), 2000);
    };

    typeOrderedMessages(introText, messages, () => {
        fade(introText, 'out', 500);

        setTimeout(() => {
            introText.classList.add('hidden');
            showPresentsText();

            setTimeout(() => {
                fade(introLogo, 'in', 1000);

                // Stop intro music and transition to the game
                setTimeout(() => {
                    introMusic.pause(); // Stop intro music
                    introMusic.currentTime = 0; // Reset to the beginning
                    window.location.href = `index.html?username=${username}&avatar=${currentAvatarIndex + 1}`;
                }, 2000);
            }, 3000);
        }, 500);
    });
}

// Type messages in a sequence elegantly :3
function typeOrderedMessages(element, messages, onComplete){
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