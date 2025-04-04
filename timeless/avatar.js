// avatar 1-4 (index 0-3)
const avatars = [
    { src: "assets/characters/KEVIN.png", name: "Kevin", 
        description: "Kevin is a brave warrior." },
    { src: "assets/characters/REGINA.png", name: "Regina", 
        description: "Regina is a skilled archer." },
    { src: "assets/characters/LINA.png", name: "Lina", 
        description: "Lina is a powerful mage." },
    { src: "assets/characters/BASTIAN.png", name: "Bastian", // TODO: DELETE BEE SCRIPT ONCE PLACEHOLDER IS NO LONGER NEEDED
        description: `根據所有已知的法律
的航空，

  
有沒有辦法蜜蜂
應該能飛。

  
它的翅膀太小了
它的脂肪小身體離地。

  
蜜蜂，當然，蒼蠅無論如何

  
因為蜜蜂不在乎
人類認為是不可能的。

  
黃色，黑色。黃色，黑色。
黃色，黑色。黃色，黑色。

  
哦，黑色和黃色！
讓我們搖一搖它。

  
巴里！早餐準備好了！

  
Ooming！

  
稍等一下。

  
你好？

  
- 巴里？
- 亞當？

  
- 你相信這是發生嗎？
- 我不能。我會接你。

  
看起來鋒利。

  
使用樓梯。你的父親
付出好錢的那些。

  
抱歉。我很興奮。

  
這是畢業生。
我們為你自豪，兒子。

  
完美的報告卡，所有B的。

  
很自豪。

  
嘛！我有一件事在這裡。

  
- 你的絨毛上有絨毛。
- Ow！那是我！

  
- 波到我們！我們將在第118,000行。
- 再見！

  
巴里，我告訴你，
停止在房子裡飛行！` },
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
    
    window.location.href = `index.html?username=${username}&avatar=${currentAvatarIndex+1}`;
}