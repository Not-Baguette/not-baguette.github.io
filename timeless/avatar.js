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

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    avatarImage.src = avatars[currentAvatarIndex].src;
    updateAvatarSelection();
});

// Get elements
const avatarImage = document.getElementById("avatarImage");
const characterModal = document.getElementById("characterModal");
const closeModal = document.getElementById("closeModal");
const characterName = document.getElementById("characterName");
const characterDescription = document.getElementById("characterDescription");
const avatarLore = document.getElementById("avatarLore");
const characterStoryModal = document.getElementById("characterStoryModal");
const closeStoryModal = document.getElementById("closeStoryModal");
const avatarSelection = document.getElementById("avatarSelection");
const avatarSelectionModal = document.getElementById("avatarSelectionModal");
const closeAvatarSelectionModal = document.getElementById("closeAvatarSelectionModal");
const prevAvatar = document.getElementById("prevAvatar");
const nextAvatar = document.getElementById("nextAvatar");

// Function to add the hidden class
function addHidden(element) {
    element.classList.add("hidden");
}

// Function to remove the hidden class
function removeHidden(element) {
    element.classList.remove("hidden");
};

// Function to open the character story modal
function openCharacterStoryModal() {
    const currentAvatar = avatars[currentAvatarIndex];
    characterStoryModal.querySelector('h2').textContent = `${currentAvatar.name}'s Story`;
    characterStoryModal.querySelector('p').textContent = currentAvatar.description;
    removeHidden(characterStoryModal);
}

// Function to select an avatar
function selectAvatar(index) {
    currentAvatarIndex = index;
    avatarImage.src = avatars[index].src;
    addHidden(avatarSelectionModal);
}

// Function to update avatar selection display
function updateAvatarSelection() {
    // Calculate indices for left and right avatars (circular)
    const leftIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
    const rightIndex = (currentAvatarIndex + 1) % avatars.length;
    
    // Get the avatar elements
    const leftAvatar = document.getElementById('leftAvatar');
    const currentAvatar = document.getElementById('currentAvatar');
    const rightAvatar = document.getElementById('rightAvatar');
    
    // Set the src attributes
    leftAvatar.src = avatars[leftIndex].src;
    currentAvatar.src = avatars[currentAvatarIndex].src;
    rightAvatar.src = avatars[rightIndex].src;
    
    // Set alt attributes for accessibility
    leftAvatar.alt = avatars[leftIndex].name;
    currentAvatar.alt = avatars[currentAvatarIndex].name;
    rightAvatar.alt = avatars[rightIndex].name;
    
    // Apply styles to indicate the current selection
    leftAvatar.classList.add('blurred');
    leftAvatar.style.transform = 'scale(0.8)';
    
    currentAvatar.classList.remove('blurred');
    currentAvatar.style.transform = 'scale(1)';
    
    rightAvatar.classList.add('blurred');
    rightAvatar.style.transform = 'scale(0.8)';
}

// Function to show the next avatar
function showNextAvatar() {
    currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
    updateAvatarSelection();
}

// Function to show the previous avatar
function showPrevAvatar() {
    currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
    updateAvatarSelection();
}

// Event listener for character image click
avatarImage.addEventListener("click", () => {
    openCharacterStoryModal(currentAvatarIndex);
});

// Event listener for "Character's Story" menu option
avatarLore.addEventListener("click", openCharacterStoryModal);

// Event listener for "Select Avatar" menu option
avatarSelection.addEventListener("click", () => {
    removeHidden(avatarSelectionModal);
    updateAvatarSelection();
});

// Event listener for close button in avatar selection modal
closeAvatarSelectionModal.addEventListener("click", () => addHidden(avatarSelectionModal));

// Clear the previous event listeners and add new ones
document.getElementById('leftAvatar').addEventListener('click', () => {
    selectAvatar((currentAvatarIndex - 1 + avatars.length) % avatars.length);
});

function confirmCurrentAvatar() {
    selectAvatar(currentAvatarIndex);
}

// Add event listeners using the shared function
document.getElementById('confirmAvatar').addEventListener('click', confirmCurrentAvatar);
document.getElementById('currentAvatar').addEventListener('click', confirmCurrentAvatar);

document.getElementById('rightAvatar').addEventListener('click', () => {
    selectAvatar((currentAvatarIndex + 1) % avatars.length);
});

// Remove previous listeners setup to avoid conflicts
// The following code replaces the previous event listeners for avatar selection
/*
document.querySelectorAll('.avatar-selection').forEach((element, index) => {
    element.addEventListener('click', () => {
        selectAvatar(index);
    });
});
*/

// Event listener for next and previous buttons
nextAvatar.addEventListener("click", showNextAvatar);
prevAvatar.addEventListener("click", showPrevAvatar);

// Event listener for close button in story modal
closeStoryModal.addEventListener("click", () => addHidden(characterStoryModal));

// Set the initial avatar image and update selection on page load
document.addEventListener('DOMContentLoaded', () => {
    avatarImage.src = avatars[currentAvatarIndex].src;
    updateAvatarSelection();
});

document.getElementById('startGame').addEventListener('click', () => {
    // Get the current username
    const username = document.getElementById('avatarName').value || 'Player';
    
    if (username === '') {
        alert('Please enter a username.');
        return;
    }
    // Create URL with parameters - use the index instead of name/src
    const gameUrl = 'index.html';
    const params = new URLSearchParams({
        username: username,
        avatar: currentAvatarIndex+1
    });
    
    // Navigate to the game page with parameters
    window.location.href = `${gameUrl}?${params.toString()}`;
});

/* */
// Get elements for credits modals
const creditsButton = document.getElementById('credits');
const creditsModal = document.getElementById('creditsModal');
const closeCreditsModal = document.getElementById('closeCreditsModal')
const showMoreCreditsButton = document.getElementById('showMoreCredits');
// Event listener for Credits button
creditsButton.addEventListener('click', () => {
    removeHidden(creditsModal);
});

// Event listener for close button in credits modal
closeCreditsModal.addEventListener('click', () => {
    addHidden(creditsModal);
});