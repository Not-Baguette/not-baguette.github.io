/*  ----------------- */
/*       INIT VAR     */
/*  ----------------- */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // 2D rendering context
const avatarIndex = getUrlParam("avatar");
const usernameParam = getUrlParam("username");
let keysPressed = {}; // store the keys pressed by the user for keyboard support
let moveDirection = {dx: 0, dy: 0}; // Store the current movement direction
let inGameTime = new Date(); // ingame time
let moveInterval; // button movement interval
let lastHour; // store the last hour for day-night cycle & status decay
let isDead = false; // player death status
let isPaused = false; // game pause status
// tutorial
let currentTutorialStep = 0;
let isTutorialActive = true;
const TutorialContainer = document.createElement("div");
TutorialContainer.className = "tutorial-overlay hidden";
document.body.appendChild(TutorialContainer); // this is not supposed to be here but it works, so i'll just leave it be

// Constants
const PLAYERDEFAULT = {
    x: 360,
    y: 50,
    size: 80,
    speed: 2,
    happiness: 50,
    energy: 50,
    hygiene: 50,
    hunger: 50,
    money: 0,
    area: "Home"
};

const AREAIMG = {
    "Home": "assets/cities/Jakarta.png",
    "Pontianak": "assets/cities/Pontianak.png",
    "Jayapura": "assets/cities/Jayapura.png",
    "Padang": "assets/cities/Padang.png",
    "Ponorogo": "assets/cities/Ponorogo.png",
    "Secret": "assets/cities/Secret.png",
    "Jambi": "assets/cities/Jambi.png"
};

const PLAYERIMG = {
    0: "assets/logo.jpeg", // player null easter egg
    1: "assets/characters/GreenKnight.png",
    2: "assets/characters/PinkMage.png",
    3: "assets/characters/RedKnight.png",
    4: "assets/characters/BlueMage.png"
};

const AVATARIMG = {
    "1": "assets/characters/KEVIN.png",
    "2": "assets/characters/REGINA.png",
    "3": "assets/characters/LINA.png",
    "4": "assets/characters/BASTIAN.png",
    "default": "assets/logo.jpeg" // player null easter egg
};

const BGAREAIMG = {
    "normal": "assets/backgrounds/Main.png",
    "winter": "assets/backgrounds/Winter.png",
    "hell": "assets/backgrounds/Boss.png",
    "default": "assets/backgrounds/Main.png"
};

const BGIMGSRC = "assets/backgrounds/BackgroundMap.png";
const LOCKEDSRC = "assets/cities/locked.png";

// Player stats
let player = {...PLAYERDEFAULT}; // clone the player object
let lastValidPosition = {x: player.x, y: player.y, area: player.area}; // for drag-and-drop

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isMoving = false;
let destination = null;
let visitedAreas = new Set(["Home"]);
let maxDebt = -100; // minimum money to do basic stuff, for easter egg
let effectIntervals = []; // store the effect ids for clearing later

const STATSTOOLTIP = [
   {id: "happinessContainer", text: "Represents the player's overall mood and satisfaction." },
   {id: "energyContainer", text: "Energy: Indicates the player's stamina and ability to perform actions." },
   {id: "hygieneContainer", text: "Hygiene: Reflects the player's cleanliness and health." },
   {id: "hungerContainer", text: "Hunger: Shows the player's need for food and nourishment." }
];

const TUTORIALSTEPS = [{
        text: "Welcome to the game! Let's learn how to play this game!",
        element: null,
    },
    {
        text: "For Desktop users, feel free to use the arrow keys or WASD to move your character!",
        element: null,
    },
    {
        text: "For Mobile users, use the buttons on the bottom to move your character or click to other areas to move!",
        element: "controls",
    },
    {
        text: "These are your stats. Keep them above 0 or you'll die! On Desktop, Hover over them to learn more.",
        element: "statExample",
    },
    {
        text: "This is the map. Drag your character to different areas to explore them.",
        element: "gameCanvas",
    },
    {
        text: "Each area has different actions you can take. Try them out! There will be a popup to confirm your actions.",
        element: "action2",
    },
    {
        text: "Time affects your stats. At night, your energy drains faster! So be careful and manage your time wisely.",
        element: "clockContainer",   
    },
    {
        text: "In order to win, You need to defeat the boss in Ponorogo. But be careful, you need to unlock the areas first.",
        element: "gameCanvas",
    },
    {
        text: "You can also find a secret area! Good luck! ;)",
        element: "gameCanvas",
    },
    {
        text: "That's it for the tutorial! You can always revisit it by clicking the help button :>",
        element: "helpButton",
}];

// day-night cycle
const backgroundColors = {
    morning: "bg-blue-200",
    afternoon: "bg-[#FFFFDC]",
    evening: "bg-orange-200",
    night: "bg-blue-700"
};

// Area props
const areas = {
    "Home": {
        x: 330,
        y: 50,
        width: 90,
        height: 90,
        cost: 20,
        type: "safe",
        jumping: false,
        region: "normal"
    },
    "Pontianak": {
        x: 140,
        y: 200,
        width: 90,
        height: 90,
        cost: 10,
        type: "enemy",
        jumping: false,
        region: "normal"
    },
    "Jayapura": {
        x: 40,
        y: 450,
        width: 90,
        height: 90,
        cost: 10,
        type: "enemy",
        requires: ["Pontianak"],
        jumping: false,
        region: "normal"
    },
    "Padang": {
        x: 270,
        y: 390,
        width: 90,
        height: 90,
        cost: 10,
        type: "safe",
        requires: ["Pontianak", "Jayapura"],
        jumping: false,
        region: "winter"
    },
    "Ponorogo": {
        x: 650,
        y: 450,
        width: 90,
        height: 90,
        cost: 20,
        type: "enemy",
        requires: ["Pontianak", "Padang", "Jayapura", "Jambi"],
        jumping: false,
        region: "hell"
    },
    "Secret": {
        x: 50,
        y: 50,
        width: 90,
        height: 90,
        cost: 10,
        type: "safe",
        jumping: false,
        region: "normal"
    },
    "Jambi": {
        x: 500,
        y: 180,
        width: 90,
        height: 90,
        cost: 10,
        type: "enemy",
        requires: ["Pontianak", "Padang", "Jayapura"],
        jumping: false,
        region: "winter"
    }
};

const areaActions = {
    "Home": {
        action1: "Rest",
        action2: "Eat",
        action3: "Play"
    },
    "Pontianak": {
        action1: "Fight",
        action2: "Explore",
        action3: ""
    },
    "Jayapura": {
        action1: "Fight",
        action2: "Explore",
        action3: ""
    },
    "Padang": {
        action1: "Stay on an Inn",
        action2: "Go to a Restaurant",
        action3: "Go to a Bathouse"
    },
    "Ponorogo": {
        action1: "",
        action2: "",
        action3: "Fight the Boss"
    },
    "Secret": {
        action1: "",
        action2: "",
        action3: ""
    },
    "Jambi": {
        action1: "Fight",
        action2: "Explore",
        action3: ""
    }
};

// Images
const areaImages = {};
const playerImg = {};
const bgImage = new Image();
const lockedOverlayImage = new Image();
const profilePic = document.getElementById("profilePic");

// Audio elements
const backgroundMusic = document.getElementById("backgroundMusic");
const clickSound = document.getElementById("clickSound");
const gameOverSound = document.getElementById("gameOverSound");
const nightAmbianceSound = document.getElementById("nightAmbianceSound");
const outroMusic = document.getElementById("outroMusic");

// Volume settings
backgroundMusic.volume    = 0.5;
clickSound.volume         = 1.0;
gameOverSound.volume      = 0.5;
nightAmbianceSound.volume = 0.7;
outroMusic.volume         = 1.0;

// Load images
lockedOverlayImage.src = LOCKEDSRC;
bgImage.src = BGIMGSRC;

// Collect all image sources
const allImageSources = [
    BGIMGSRC,
    LOCKEDSRC,
    ...Object.values(AREAIMG),
    ...Object.values(PLAYERIMG),
    ...Object.values(BGAREAIMG),
    ...Object.values(AVATARIMG)
];

Object.keys(AREAIMG).forEach(area =>{
    areaImages[area] = new Image();
    areaImages[area].src = AREAIMG[area];
});

Object.keys(PLAYERIMG).forEach(index =>{
    playerImg[index] = new Image();
    playerImg[index].src = PLAYERIMG[index];
});

/*  ----------------- */
/*   EVENT LISTENERS  */
/*  ----------------- */
// init event listeners
function addEventListeners(){
    // Button movement support, *5 for faster movement in mobile
    document.getElementById("moveUp").addEventListener("mousedown", () => startMoving(0, -player.speed));
    document.getElementById("moveDown").addEventListener("mousedown", () => startMoving(0, player.speed));
    document.getElementById("moveLeft").addEventListener("mousedown", () => startMoving(-player.speed, 0));
    document.getElementById("moveRight").addEventListener("mousedown", () => startMoving(player.speed, 0));

    document.addEventListener("mouseup", stopMoving);
    document.addEventListener("mouseleave", stopMoving);

    // Ensure touch support for mobile devices for buttons
    document.getElementById("moveUp").addEventListener("touchstart", () => startMoving(0, -player.speed));
    document.getElementById("moveDown").addEventListener("touchstart", () => startMoving(0, player.speed));
    document.getElementById("moveLeft").addEventListener("touchstart", () => startMoving(-player.speed, 0));
    document.getElementById("moveRight").addEventListener("touchstart", () => startMoving(player.speed, 0));

    document.addEventListener("touchend", stopMoving);
    document.addEventListener("touchcancel", stopMoving);

    // mobile support
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Keyboard support
    document.addEventListener("keydown", (e) =>{
        // only prevent default for arrow keys
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)){
            e.preventDefault();
        }
        keysPressed[e.key] = true;
    });
    document.addEventListener("keyup", (e) =>{
        delete keysPressed[e.key];
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Tooltip
    document.addEventListener("DOMContentLoaded", () => loadTooltip());
    STATSTOOLTIP.forEach(stat => {
        const element = document.getElementById(stat.id);
        
        // Attach event listeners if the element exists
        element.addEventListener("mouseenter", (e) => {
            const statValue = player[stat.id.replace("Container", "")];
            tooltip.textContent = `${stat.text} Current level: ${statValue}`;
            tooltip.classList.remove("hidden");
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
        element.addEventListener("mousemove", (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
        element.addEventListener("mouseleave", () => {
            tooltip.classList.add("hidden");
        });
    });

    // Bgm button
    document.getElementById("bgmButton").addEventListener("click", toggleBackgroundMusic);

    // Help Button
    document.getElementById("helpButton").addEventListener("click", () => {
        currentTutorialStep = 0;
        isTutorialActive = true;
        startTutorial();
    });

    // Button actions using showPopup, I'm sorry for the shit code below
    document.getElementById("action1").addEventListener("click", () =>{
        const actions = (areaActions[player.area]).action1;
        playClickSound();
        if(player.area === "Home"){
            showPopup(actions, 0, 0, 0, 10, 0); 
        } else if(player.area === "Pontianak"){
            if(!hasEnoughResources(10, 20, 0, 0, maxDebt)) return;
            showPopup(actions, -10, -20, 0, 0, 10);
        } else if(player.area === "Jayapura"){
            if(!hasEnoughResources(20, 30, 0, 0, maxDebt)) return;
            showPopup(actions, -10, -20, 0, 0, 15)
        } else if(player.area === "Padang"){
            if(!hasEnoughResources(0, 0, 0, 0, 5)) return;
            showPopup(actions, 0, 0, 0, 20, -5);
        } else if(player.area === "Jambi"){
            if(!hasEnoughResources(0, 0, 0, 0, 0)) return;
            showPopup(actions, -10, -20, 0, 0, 20);
        }
    });

    document.getElementById("action2").addEventListener("click", () =>{
        const actions = (areaActions[player.area]).action2;
        playClickSound();
        if(player.area === "Home"){
            showPopup(actions, 0, 0, 10, 0, 0);
        } else if(player.area === "Pontianak"){
            if(!hasEnoughResources(0, 0, 0, 20, maxDebt)) return;
            showPopup(actions, 0, 0, 0, -20, 5);
        } else if(player.area === "Jayapura"){
            if(!hasEnoughResources(0, 0, 0, 30, maxDebt)) return;
            showPopup(actions, 0, 0, 0, -30, 10)
        } else if(player.area === "Padang"){
            if(!hasEnoughResources(0, 0, 0, 0, 5)) return;
            showPopup(actions, 0, 0, 20, 0, -5);
        } else if(player.area === "Jambi"){
            if(!hasEnoughResources(0, 0, 0, 0, 0)) return;
            showPopup(actions, 0, 0, 0, -10, 15);
        }
    });

    document.getElementById("action3").addEventListener("click", () =>{
        const actions = (areaActions[player.area]).action3;
        playClickSound();
        if(player.area === "Home"){
            showPopup(actions, 10, 0, 0, 0, 0);
        } else if(player.area === "Padang"){
            showPopup(actions, 0, 20, 0, 0, 0);
        } else if(player.area === "Ponorogo"){
            isDead = false; // hacky fix but should work
            handleBoss();
        } 
    });
}

// Handle hover over the stats
function loadTooltip(){
    const tooltip = document.getElementById("tooltip");

    STATSTOOLTIP.forEach(stat =>{
        const element = document.getElementById(stat.id);
        element.addEventListener("mouseenter", (e) =>{
            const statValue = player[stat.id.replace("Container", "")];
            tooltip.textContent = `${stat.text} Current level: ${statValue}`;
            tooltip.classList.remove("hidden");
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        element.addEventListener("mousemove", (e) =>{
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        element.addEventListener("mouseleave", () =>{
            tooltip.classList.add("hidden");
        });
    });
}

// Toggle background music
function toggleBackgroundMusic() {
    const bgmButton = document.getElementById("bgmButton");

    if (bgmButton.classList.contains("playing")) { // If playing
        bgmButton.classList.remove("playing");
        bgmButton.innerText = "♫"; 
        backgroundMusic.pause(); // Pause the audio
    } else { // If not playing
        bgmButton.classList.add("playing");
        bgmButton.innerText = "■";
        backgroundMusic.play(); // Play the audio
    }
}

function playClickSound() {
    clickSound.currentTime = 0; // Reset to the beginning
    clickSound.play();
}

function playNightAmbiance() {
    if (!nightAmbianceSound.paused) return; // check if it's already playing

    // play the night ambiance sound
    nightAmbianceSound.volume = 0.5; 
    nightAmbianceSound.play();
}

function stopNightAmbiance() {
    nightAmbianceSound.pause();
    nightAmbianceSound.currentTime = 0; // Reset to the beginning
}

// handle button movement
function startMoving(dx, dy){
    moveDirection = {dx, dy}; // Set the movement direction
    if (!moveInterval) {
        moveInterval = requestAnimationFrame(function updateMovement() {
            movePlayer(moveDirection.dx, moveDirection.dy);
            moveInterval = requestAnimationFrame(updateMovement); // Continue the loop
        });
    }
}
function stopMoving(){
    moveDirection = {dx:0, dy:0}; // Reset the movement direction
    if (moveInterval){
        cancelAnimationFrame(moveInterval); // Stop the movement loop
        moveInterval = null;
    }
}

// handle mouse movement
function handleMouseDown(e){
    const{mouseX, mouseY} = getMousePosition(e);
    if(isMouseOverPlayer(mouseX, mouseY)){
        isDragging = true;
        dragOffsetX = mouseX - player.x;
        dragOffsetY = mouseY - player.y;
    }
}
function handleMouseMove(e){
    const{mouseX, mouseY} = getMousePosition(e);
    // if the user is hovering over an area or player
    if (isMouseOverArea(mouseX, mouseY) || 
        isMouseOverPlayer(mouseX, mouseY)){
        canvas.style.cursor = "grab";
    } else{
        canvas.style.cursor = "default";
    }
    // drag the player if isDragging is true
    if (isDragging){
        player.x = mouseX - dragOffsetX;
        player.y = mouseY - dragOffsetY;
    }
}
function handleMouseUp(){
    // stop drag once mouse is no longer clicked
    isDragging = false;
    if(!isPlayerInValidArea()){
        resetPlayerPosition();
    }
}

// get mouse pos relative to the canvas
function getMousePosition(e){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    return{mouseX, mouseY};
}

function isMouseOverPlayer(mouseX, mouseY){
    return mouseX >= player.x && mouseX <= player.x + player.size &&
           mouseY >= player.y && mouseY <= player.y + player.size;
}

// check if the player is in a valid area
function isPlayerInValidArea(){
    const areasContainingPlayer = getAreasContainingPoint(player.x, player.y);
    return areasContainingPlayer.some(({loc}) => isAreaUnlocked(loc)); // true if areas containing player is unlocked
}

// Check if the mouse is over an area
function isMouseOverArea(clientX, clientY){
    const areasContainingMouse = getAreasContainingPoint(clientX, clientY);
    return areasContainingMouse.some(({loc}) => isAreaUnlocked(loc));
}

// return user to last valid position
function resetPlayerPosition(){
    if(isMoving) return;
    // hacky fix for ponorogo bug, I literally cant reproduce this bug without knowing what went wrong
    if (lastValidPosition.area === "ponorogo" && isAreaUnlocked(areas["ponorogo"])){
        lastValidPosition.x = areas["home"].x;
        lastValidPosition.y = areas["home"].y;
        lastValidPosition.area = "home";
    }
    player.x = lastValidPosition.x;
    player.y = lastValidPosition.y;
    player.area = lastValidPosition.area;

}

// handle mobile
function handleClick(e){
    handleInteraction(e.clientX, e.clientY);
}
function handleTouchStart(e){
    if(e.touches.length === 1){
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }
}
function handleTouchEnd(e){
    if(e.changedTouches.length === 1){
        const touch = e.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }
}

/*  ----------------- */
/*  HELPER FUNCTIONS  */
/*  ----------------- */
// check if a point is in an location
function isPointInLocation(x, y, loc){
    return x >= loc.x && x <= loc.x + loc.width &&
           y >= loc.y && y <= loc.y + loc.height;
}

// check if a point is in an area
function getAreasContainingPoint(x, y){
    const containingAreas = [];
    for (const areaName in areas){
        const loc = areas[areaName];
        if (isPointInLocation(x, y, loc)){
            containingAreas.push({name: areaName, loc});
        }
    }
    return containingAreas;
}

// check if an area is unlocked
function isAreaUnlocked(loc){
    return !loc.requires || loc.requires.every(r => visitedAreas.has(r));
}

// get pfp from avatar selection
function updateProfilePic(avatarIndex){
    profilePic.src = AVATARIMG[avatarIndex] || AVATARIMG["default"];
    profilePic.classList.add("pfp-zoom"); // Add the zoom class
}

// get avatar & username from URL
function getUrlParam(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
}

// Helper function to check if the player has enough resources
function hasEnoughResources(happiness, hygiene, hunger, energy, money){
    if(player.happiness < happiness){
        showPopup("", 0, 0, 0, 0, 0, "Not enough happiness.");
        return false;
    }
    if(player.hygiene < hygiene){
        showPopup("", 0, 0, 0, 0, 0, "Not enough hygiene.");
        return false;
    }
    if(player.hunger < hunger){
        showPopup("", 0, 0, 0, 0, 0, "Not enough hunger.");
        return false;
    }
    if(player.energy < energy){
        showPopup("", 0, 0, 0, 0, 0, "Not enough energy.");
        return false;
    }
    if(player.money < money){
        showPopup("", 0, 0, 0, 0, 0, "Not enough money.");
        return false;
    }
    return true;
}

// give player effect for x seconds
function playerEffect(statName, seconds, value){
    // apply effect every second until timeout
    const intervalId = setInterval(() =>{
        player[statName] = Math.min(100, Math.max(0, player[statName] + value));
        updateStats(); // Ensure the stats are updated in the UI
    }, 1000);

    // Store the interval ID on an array so we can clear it later
    effectIntervals.push(intervalId);

    // stop after x seconds
    setTimeout(() =>{
        clearInterval(intervalId);
    }, seconds * 1000);
}

// Create an in-game popup for actions
function showPopup(action="", happiness=0, hygiene=0, hunger=0, energy=0, earnings=0, customMessage = null){
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    if(!customMessage){ // Sophisticate the message for default message
        let costs = [];
        let gains = [];
        // check, if negative then it's a cost, if positive then it's a gain, if 0 then ignore
        if(happiness < 0) costs.push(`${-happiness} happiness`);
        if(hygiene < 0) costs.push(`${-hygiene} hygiene`);
        if(hunger < 0) costs.push(`${-hunger} hunger`);
        if(energy < 0) costs.push(`${-energy} energy`);
        if(earnings < 0) costs.push(`${-earnings} money`);
        if(happiness > 0) gains.push(`${happiness} happiness`);
        if(hygiene > 0) gains.push(`${hygiene} hygiene`);
        if(hunger > 0) gains.push(`${hunger} hunger`);
        if(energy > 0) gains.push(`${energy} energy`);
        if(earnings > 0) gains.push(`${earnings} money`);

        customMessage = `Are you sure you want to ${action}?\n`;
        if(costs.length > 0){
            customMessage += `This will cost you:\n${costs.join(", ")}\n`;
        }
        if(gains.length > 0){
            customMessage += `And earn you:\n${gains.join(", ")}`;
        }
    }

    popupMessage.innerText = customMessage;
    cancelButton.classList.remove("hidden");
    popupContainer.classList.remove("hidden");

    if (action === "nocancel") cancelButton.classList.add("hidden");

    // Function to handle the confirm action
    const confirmAction = () =>{
        player.happiness = Math.min(100, Math.max(0, player.happiness + happiness));
        player.hygiene = Math.min(100, Math.max(0, player.hygiene + hygiene));
        player.hunger = Math.min(100, Math.max(0, player.hunger + hunger));
        player.energy = Math.min(100, Math.max(0, player.energy + energy));
        player.money += earnings;
        playClickSound();
        closePopup();
    };

    // Function to handle the cancel action
    const cancelAction = () =>{
        closePopup();
    };

    // Function to handle keydown events
    const handleKeyDown = (event) =>{
        if(event.key === "Enter"){
            event.preventDefault(); // browsers would see this as them clicking the fight/explore button ffs
            confirmAction();
        } else if(event.key === "Escape"){
            cancelAction();
        }
    };

    // Function to close the popup with animation
    const closePopup = () =>{
        popupContainer.classList.add("closing");
        setTimeout(() =>{
            popupContainer.classList.remove("closing");
            popupContainer.classList.add("hidden");
            document.removeEventListener("keydown", handleKeyDown);
        }, 300); // Match the duration of the closing animation
    };

    // Add event listeners
    confirmButton.onclick = confirmAction;
    cancelButton.onclick = cancelAction;
    document.addEventListener("keydown", handleKeyDown); // Add the event listener for keydown
}

// Showpopup but with extra features
function showPopupAdvanced(timeout, happiness, hygiene, hunger, energy, earnings, message, action="nocancel") {
    // Remove any existing event listeners
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");
    confirmButton.replaceWith(confirmButton.cloneNode(true));
    cancelButton.replaceWith(cancelButton.cloneNode(true));

    const newConfirmButton = document.getElementById("confirmButton");
    const newCancelButton = document.getElementById("cancelButton");

    showPopup(action, happiness, hygiene, hunger, energy, earnings, message);

    // Create a timeout that triggers if the user doesn't click the button
    const timeoutId = setTimeout(() => {
        console.log("Timeout reached! User did not click the button.");
        showPopup("nocancel", 0, 0, 0, 0, 0, "You failed to act in time!");
        player.happiness = Math.max(0, player.happiness + happiness);
        player.hygiene = Math.max(0, player.hygiene + hygiene);
        player.hunger = Math.max(0, player.hunger + hunger);
        player.energy = Math.max(0, player.energy + energy);
        player.money = Math.max(0, player.money + earnings);
    }, timeout);

    // Event listener for the confirm and cancel
    newConfirmButton.addEventListener(
        "click",
        () => {
            clearTimeout(timeoutId);
            console.log("Button clicked! Timeout cleared.");
        },
        {once:true}
    );
    newCancelButton.addEventListener(
        "click",
        () => {
            clearTimeout(timeoutId);
            console.log("Cancel button clicked! Timeout cleared.");
            if (action === "cancel") return; // if cancel then bypass
            player.happiness = Math.max(0, player.happiness + happiness);
            player.hygiene = Math.max(0, player.hygiene + hygiene);
            player.hunger = Math.max(0, player.hunger + hunger);
            player.energy = Math.max(0, player.energy + energy);
            player.money = Math.max(0, player.money + earnings);
        },
        {once:true}
    );
}

/*  ----------------- */
/*  UPDATE FUNCTIONS  */
/*  ----------------- */
// When user is on a locked area
function PlayerInLockedArea(loc){
    let cancelcounter = 0;
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");
    const jumpscare = document.getElementById("jumpscare"); // Define jumpscare element here
    const popupContainer = document.getElementById("popupContainer");

    showPopup("", 0, 0, 0, 0, 0, `You must visit ${loc.requires.join(" and ")} first!`);
    cancelButton.onclick = () =>{
        cancelcounter++;
        if(cancelcounter === 1){
            popupMessage.innerText = `Like I said before, no skipping levels ;>`;
        } else if(cancelcounter === 2){
            popupMessage.innerText = `You're a persistent one aren't you?`;
        } else if(cancelcounter === 3){
            popupMessage.innerText = `Don't cheat peeps.`;
        } else if(cancelcounter === 4){
            popupMessage.innerText = `Now you're just testing my patience.`;
        } else if(cancelcounter > 4){
            popupMessage.innerText = `That's it, I'm putting you on debt.`;
            player.money -= 100;
            jumpscare.src = "assets/easter-egg/broke.gif"; // Add the path to your image
            jumpscare.classList.remove("hidden");
            cancelButton.classList.add("hidden"); // Hide the cancel button
        }
    };

    confirmButton.onclick = () =>{
        jumpscare.classList.add("hidden"); // Hide the jumpscare image
        popupContainer.classList.add("hidden");
    };
}

// Update the clock every second
function updateClock(overrule){
    inGameTime.setMinutes(inGameTime.getMinutes() + 1); // Increment in-game time by 1 minute

    const hours = String(inGameTime.getHours()).padStart(2, "0");
    const minutes = String(inGameTime.getMinutes()).padStart(2, "0");
    const body = document.body;

    // change time display
    document.getElementById("clock").textContent = `${hours}:${minutes}`;
    // faster energy decay at night
    if(hours >= 18 || hours < 6){
        player.energy = Math.max(0, player.energy - 0.1); // Ensure energy doesn't go below 0
    }

    if(hours == lastHour && !overrule) return; // same hour and no overrule = no need to update, for efficiency

    // Remove all possible background colors
    body.classList.remove(...Object.values(backgroundColors)); 

    // day-night cycle

    if (hours < 4 && hours >= 0) {
        body.classList.add(backgroundColors.night); // Use night background for 00:00 to 03:59
        if (nightAmbianceSound.paused) playNightAmbiance();
    } else if (hours < 12) {
        body.classList.add(backgroundColors.morning);
        if (!nightAmbianceSound.paused) stopNightAmbiance();
    } else if (hours < 16) {
        body.classList.add(backgroundColors.afternoon);
        if (!nightAmbianceSound.paused) stopNightAmbiance();
    } else if (hours < 19) {
        body.classList.add(backgroundColors.evening);
        if (!nightAmbianceSound.paused) stopNightAmbiance();
    } else {
        body.classList.add(backgroundColors.night);
        if (nightAmbianceSound.paused) playNightAmbiance();
    }

    if(overrule) return; // prevent overrule from updating the stats, just day-night cycle

    // Decrement energy every hour (status decay)
    player.energy = Math.max(0, player.energy - 10); // Ensure energy doesn't go below 0
    lastHour = hours;
    updateStats(); // Update the stats display
}

// Greeting Function to get the greeting based on the current time
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    if(hours < 4) {
        return "You're up late";
    } else if(hours < 12) {
        return "Good morning";
    } else if(hours < 15) {
        return "Good afternoon";
    } else if(hours < 19) {
        return "Good evening";
    } else{
        return "Don't forget to take a rest";
    }
}

// change bg based on region
function updateBackground(region){
    const body = document.body;
    body.classList.add("background-transition"); // Add transition class

    body.style.backgroundImage = `url(${BGAREAIMG[region] || BGAREAIMG["default"]})`;

    // Remove the transition class after the transition duration
    setTimeout(() =>{
        body.classList.remove("background-transition");
    }, 1000);
}

// Handle arrival when reaching destination
function handleArrival(){
    // Update player position and area
    player.x = destination.x;
    player.y = destination.y;
    player.area = destination.area;

    // Secret area discovery
    if(player.area === "Secret"){
        showPopup("nocancel", 0, 0, 0, 0, 200, "Congratulations, You found a secret area! GET OUT");
    }

    // Update player
    player.hunger = Math.max(0, player.hunger - destination.cost);
    lastValidPosition.x = player.x;
    lastValidPosition.y = player.y;
    lastValidPosition.area = player.area;
    visitedAreas.add(destination.area);
    destination = null;
    isMoving = false;

    // Enemy area animation
    if(areas[player.area].type === "enemy"){
        areas[player.area].jumping = true;
        setTimeout(() =>{
            areas[player.area].jumping = false;
        }, 500);
        // startBattle(areas[player.area]); // DEBUG
    }

    // Update UI elements
    updateBackground(areas[player.area].region);
    document.getElementById("interactionText").innerText = `You arrived at ${player.area}`;
    updateButtonActions(player.area);
}

// Update the area interaction buttons depending on the area
function updateButtonActions(area){
    const actions = areaActions[area];
    const action1 = document.getElementById("action1");
    const action2 = document.getElementById("action2");
    const action3 = document.getElementById("action3");

    action1.innerText = actions.action1;
    action2.innerText = actions.action2;
    action3.innerText = actions.action3;

    action1.classList.toggle("hidden", !actions.action1);
    action2.classList.toggle("hidden", !actions.action2);
    action3.classList.toggle("hidden", !actions.action3);
}

// Update the stats bars
function updateStats() {
    const stats = ["happiness", "energy", "hygiene", "hunger"];
    stats.forEach(stat => {
        const container = document.getElementById(`${stat}Container`);
        const currentBlock = container.querySelector(".bar-block");
        const percentage = player[stat];

        if (!currentBlock) {
            // Create the bar block if it doesn't exist
            const block = document.createElement("div");
            block.classList.add("bar-block", stat);
            block.style.width = `${percentage}%`;
            container.appendChild(block);
        } else {
            // Animate the width change
            currentBlock.style.transition = "width 0.5s ease-in-out"; // Smooth transition
            currentBlock.style.width = `${percentage}%`;
        }
    });

    // Update money display
    const moneyElement = document.getElementById("money");
    moneyElement.innerText = `$${player.money}`;
}

/*  ----------------- */
/* MOVEMENT MECHANICS */
/*  ----------------- */
// move the player based on dx and dy depending on the key pressed
function movePlayer(dx, dy){
    // Calculate the new position
    const newX = player.x + dx;
    const newY = player.y + dy;

    // Check if the new position is within the canvas boundaries, if no then return
    if (newX < 0 || newX + player.size > canvas.width || newY < 0 || 
        newY + player.size > canvas.height) return;

    // Update the player's position
    player.x = newX;
    player.y = newY;
    
    const areasContainingPlayer = getAreasContainingPoint(player.x, player.y);
    for (const{name: areaName, loc} of areasContainingPlayer){
        if (!isAreaUnlocked(loc)){
            PlayerInLockedArea(loc);
            resetPlayerPosition();
            return;
        }
        // if the area is unlocked and the player is not moving, then set the destination
        if (player.area !== areaName && !isMoving && isPlayerInValidArea()){
            destination = { 
                x: loc.x + loc.width / 2,
                y: loc.y + loc.height / 2,
                area: areaName,
                cost: loc.cost
            };
            handleArrival();
            break;
        }
    }

    if (areas[player.area]){
        updateButtonActions(player.area);
        updateBackground(areas[player.area].region);
    }
}

// Handle the player movement for keyboard
function updatePlayerPosition(){
    if(keysPressed["ArrowUp"] || keysPressed["w"]){
        movePlayer(0, -player.speed);
    }
    if(keysPressed["ArrowDown"] || keysPressed["s"]){
        movePlayer(0, player.speed);
    }
    if(keysPressed["ArrowLeft"] || keysPressed["a"]){
        movePlayer(-player.speed, 0);
    }
    if(keysPressed["ArrowRight"] || keysPressed["d"]){
        movePlayer(player.speed, 0);
    }
}

// Update the location of the player
function update(){
    if(destination){
        let dx = destination.x - player.x;
        let dy = destination.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy); // pythagorean theorem to find shortest path

        // Move the player towards the destination
        if(dist > player.speed){
            // Add sine wave effect to simulate walking
            let sineWave = Math.sin(Date.now() / 100) * 0.8; // Adjust the divisor and multiplier for movement hop

            player.x += (dx / dist) * player.speed;
            player.y += (dy / dist) * player.speed + sineWave;
        } else{ // arrived
            handleArrival();
        }
    }
}

/*  ----------------- */
/*  LOADING FUNCTIONS */
/*  ----------------- */
// hide the loading screen
function hideLoadingScreen(){
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.add("hidden");
}

// preload the images, hopefully will fix perf. issue
function preloadImages(sources, callback) {
    let loadedImages = 0;
    const totalImages = sources.length;

    sources.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                callback();
            }
        };
    });
}

// run to init everything
function firstrun(){
    inGameTime = new Date(); // re-Initialize in-game time incase of death
    lastHour = inGameTime.getHours(); // set the last hour to the current hour
    const greetingMessage = `${getGreeting()}! Welcome to Timeless Adventure!`;

    // Grab the url param for avatar and username, only run this once
    if(!avatarIndex || !usernameParam){ // if param is missing, redirect to avatar selection
        window.location.href = "avatar.html";
    } else{
        if(avatarIndex){
            player.avatar = playerImg[avatarIndex];
            updateProfilePic(avatarIndex); // Update the profile picture
        }
        if(usernameParam){
            const usernameElement = document.getElementById("username");
            usernameElement.innerText = usernameParam;
        }
    }
    document.getElementById("greeting").innerText = greetingMessage;
    updateClock(true); // Initial call to display the clock immediately
    updateButtonActions(player.area); // set button actions to home for tutorial

    // Start tutorial if first time
    if (checkFirstTimeUser()) {
        setTimeout(startTutorial, 1000); // Small delay to let everything load
    }
}

/*  ----------------- */
/* TUTORIAL FUNCTIONS  */
/*  ----------------- */
// Start the tutorial
function startTutorial() {
    if (!isTutorialActive) return;
    showTutorialStep(currentTutorialStep);
}

// Show the tutorial step
function showTutorialStep(stepIndex) {
    if (stepIndex >= TUTORIALSTEPS.length) {
        endTutorial();
        return;
    }

    const step = TUTORIALSTEPS[stepIndex];
    const TutorialContainer = document.getElementById("TutorialContainer");
    const tutorialBox = document.getElementById("tutorialBox");
    const tutorialText = document.getElementById("tutorialText");
    const skipButton = document.getElementById("skipButton");
    const nextButton = document.getElementById("nextButton");

    // Show tutorial container and tutorial box, and update text
    TutorialContainer.classList.remove("hidden");
    tutorialBox.classList.remove("hidden");
    tutorialText.textContent = step.text;

    // Update "Next" button text & remove prev highlight
    nextButton.textContent = stepIndex === TUTORIALSTEPS.length - 1 ? "Finish" : "Next";
    document.querySelectorAll('.highlight-element').forEach(el => el.classList.remove('highlight-element'));

    // Highlight the target element if specified
    if (step.element) {
        highlightTargetElement(step.element, tutorialBox);
    } else {
        centerTutorialBox(tutorialBox);
    }

    // Add event listeners for buttons
    skipButton.onclick = endTutorial;
    nextButton.onclick = () => {
        currentTutorialStep++;
        showTutorialStep(currentTutorialStep);
    };
}

// Highlight the target element
function highlightTargetElement(elementId, tutorialBox) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    targetElement.classList.add("highlight-element");

    const targetRect = targetElement.getBoundingClientRect();
    let top, left;

    if (window.innerWidth > 1050) {
        // Position for PC
        top = targetRect.top + window.scrollY + (targetRect.height / 2) - (tutorialBox.offsetHeight / 2) + 250;
        left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tutorialBox.offsetWidth / 2) + 50;
    } else {
        // Center for mobile
        centerTutorialBox(tutorialBox);
        return;
    }

    // Adjust position for specific elements
    if (elementId === "gameCanvas") left += 800;

    tutorialBox.style.position = "absolute";
    tutorialBox.style.top = `${top}px`;
    tutorialBox.style.left = `${left}px`;
}

// center popup for mobile & nonspecific elements
function centerTutorialBox(tutorialBox) {
    tutorialBox.style.position = "absolute";
    tutorialBox.style.top = "50%";
    tutorialBox.style.left = "50%";
    tutorialBox.style.transform = "translate(-50%, -50%)";
}

// End the tutorial
function endTutorial() {
    const TutorialContainer = document.getElementById("TutorialContainer");
    const tutorialBox = document.getElementById("tutorialBox");
    TutorialContainer.classList.add("hidden");
    tutorialBox.classList.add("hidden");
    isTutorialActive = false;
    currentTutorialStep = 0;

    // Remove highlights
    document.querySelectorAll('.highlight-element').forEach(el => {
        el.classList.remove('highlight-element');
    });

    // Save to localStorage that tutorial was completed
    localStorage.setItem('tutorialCompleted', 'true');
}

// Check if the user is a first-time user via localStorage
function checkFirstTimeUser() {
    return !localStorage.getItem('tutorialCompleted');
}

/*  ----------------- */
/*       OUTRO        */
/*  ----------------- */
// Show the credits
function showCredits() {
    const outroSequence = document.getElementById('outroSequence');
    const creditsContainer = document.getElementById("creditsContainer");
    const outroMusic = document.getElementById('outroMusic');
    outroMusic.volume = 0.1;
    outroMusic.play();
    creditsContainer.classList.remove("hidden");

    // Hide the credits after the animation ends
    const creditsDuration = 45000; // IF CHANGED: Match the duration of the CSS animation
    setTimeout(() => {
        creditsContainer.classList.add("hidden");
        outroSequence.classList.remove('hidden');
        outroStoryteller();
    }, creditsDuration);
    
}

// after the outro
function outroStoryteller(){
    const outroTale = document.getElementById('outroTale');
    const outroLogo = document.getElementById('outroLogo');
    const creditsContainer = document.getElementById("creditsContainer");
    const outroMusic = document.getElementById('outroMusic');
    const messages = [
        `and thus, the story of ${usernameParam} ends.`,
        `Or.. did it?`,
        `The world is always full of secrets,`,
        `Don't you think so, ${usernameParam}?`,
    ];

    const fade = (element, type, duration) => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = type === 'in' ? 1 : 0;
    };

    typeOrderedMessages(outroTale, messages, () => {
        fade(outroTale, 'out', 500);
        setTimeout(() => { // logo fade in
            outroLogo.classList.remove('hidden');
            fade(outroLogo, 'in', 1000);
            setTimeout(() => { // reset it for endless mode
                outroLogo.classList.add('hidden');
                outroTale.classList.add('hidden');
                outroMusic.pause();
                outroMusic.currentTime = 0; // Reset to the beginning
                creditsContainer.classList.add("hidden");
                outroSequence.classList.add('hidden');
                showPopup("nocancel", 0, 0, 0, 0, 0, "Thank you for playing! You've unlocked endless mode");
            }, 2000);
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

// Handle transition to outro
function handleVictory(){
    // Stop the background music if it's playing
    if (!backgroundMusic.paused) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset to the beginning
    }


    setTimeout(() => {
        outroSequence.style.transition = 'background-color 1s ease';
        outroSequence.style.backgroundColor = '#1a202c';
    }, 10);

    // Start credits after background fade
    setTimeout(() => {
        showCredits();
    }, 1000);
}

/*  ----------------- */
/*    GAME FUNCTIONS  */
/*  ----------------- */
// Handle the player interaction with the areas
function handleInteraction(clientX, clientY){
    if (isMoving) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    const areasContainingClick = getAreasContainingPoint(clickX, clickY);
    for (const{name: areaName, loc} of areasContainingClick){
        if (player.area === areaName) return;

        // if player is in a locked area, show popup
        if (!isAreaUnlocked(loc)){
            PlayerInLockedArea(loc);
            resetPlayerPosition();
            return;
        }

        destination = {
            x: loc.x + loc.width / 2,
            y: loc.y + loc.height / 2,
            area: areaName,
            cost: loc.cost
        };
        isMoving = true;
        
        const action1 = document.getElementById("action1");
        const action2 = document.getElementById("action2");
        const action3 = document.getElementById("action3");
        action1.classList.add("hidden");
        action2.classList.add("hidden");
        action3.classList.add("hidden");
        return;
    }
}

// Kill the player when they die
function killPlayer(){
    if (isPaused) return; // Prevent multiple executions of killPlayer
    const bloodDrip = document.getElementsByClassName("blood")[0];
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");
    const inter_text = document.getElementById("interactionText");
    const action1 = document.getElementById("action1");
    const action2 = document.getElementById("action2");
    const action3 = document.getElementById("action3");

    let cancelcounter = 0;
    isDead = true; // Set the isDead flag to true
    isPaused = true; // mutex

    // Pause the game loop
    bloodDrip.classList.remove("hidden");
    // Draw game over screen on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"; // black
    ctx.fillRect(0, 0, canvas.width, canvas.height); // fill the entire canvas

    ctx.font = "48px monospace";
    ctx.fillStyle = "red"; // red text
    ctx.textAlign = "center";
    ctx.fillText("You died! :<", canvas.width / 2, canvas.height / 2 - 50); // center text

    // Pause for 3 seconds
    setTimeout(() => {
        // Clear the effect intervals
        effectIntervals.forEach(intervalId => clearInterval(intervalId));
        effectIntervals = [];

        popupMessage.innerText = `You died!`;
        popupContainer.classList.remove("hidden");
        cancelButton.classList.remove("hidden");

        confirmButton.onclick = () => {
            popupContainer.classList.add("hidden");
            jumpscare.classList.add("hidden");
        };

        inter_text.innerHTML = "";
        action1.classList.add("hidden");
        action2.classList.add("hidden");
        action3.classList.add("hidden");

        // Reset visited areas
        areas[player.area].jumping = false;
        player = { ...PLAYERDEFAULT }; // reset the player stats
        visitedAreas.clear();
        visitedAreas.add("Home");

        updateBackground("normal");
        firstrun(); // reset the game

        // Cancel easter egg
        cancelButton.onclick = () => {
            cancelcounter++;
            if (cancelcounter === 1) {
                popupMessage.innerText = `You can't cancel death silly :b`;
            } else if (cancelcounter === 2) {
                popupMessage.innerText = `You really can't cancel death, you know?`;
            } else if (cancelcounter === 3) {
                popupMessage.innerText = `I'm sorry, but you can't cancel death. you're dead....`;
            } else if (cancelcounter === 4) {
                popupMessage.innerText = `cancel and you're gay`;
            } else if (cancelcounter > 4) {
                popupMessage.innerText = `You just got jumpscared!`;
                const jumpscare = document.getElementById("jumpscare");
                jumpscare.src = "assets/easter-egg/reaper.gif"; // Add the path to your image
                jumpscare.classList.remove("hidden");
                cancelButton.classList.add("hidden"); // Hide the cancel button
            }
        };

        // Resume the game loop
        bloodDrip.classList.add("hidden");
        isPaused = false;
    }, 3000); // Wait for 3 seconds
}

// DEBUG: Cheat code for testing
function cheatCode(code){
    if(code === "op"){
        player.happiness = 100;
        player.energy = 100;
        player.hygiene = 100;
        player.hunger = 100;
        player.money = 1000;
        updateStats();
        return "Cheat code activated!";
    } else if(code === "unlock"){
        visitedAreas.add("Pontianak");
        visitedAreas.add("Jayapura");
        visitedAreas.add("Padang");
        visitedAreas.add("Ponorogo");
        visitedAreas.add("Secret");
        visitedAreas.add("Jambi");
        updateStats();
        return "All areas unlocked!";
    } else if(code === "test"){
        cheatCode("unlock");
        cheatCode("op");
        player.hunger -= 20;
        handleBoss();
    }

}

// Handle the boss fight (3 waves)
function handleBoss() {
    function startWave1() {
        console.log("Wave 1 started!");
        showPopupAdvanced(12000, -40, -90, -10, -40, 0, "You dare to challenge me? Let us see who wins!", "nocancel");
        playerEffect("happiness", 10, -1);
        playerEffect("energy", 10, -1);
        playerEffect("hygiene", 9, -1);
        playerEffect("hunger", 5, -5);

        setTimeout(() => {
            console.log("Wave 1 completed!");
            if(isDead){
                killPlayer();
                return;
            } else{
                updateStats(); // Ensure stats are updated after the wave
                startWave2(); // Trigger wave 2
            }
        }, 10000);
    }

    function startWave2() {
        console.log("Wave 2 started!");
        showPopupAdvanced(10000, -20, 0, -20, -20, 0, "You think you can win? EVEN Cancelling won't save you now!", "cancel");
        playerEffect("happiness", 10, -2);
        playerEffect("energy", 10, -2);
        playerEffect("hunger", 5, -10);
        playerEffect("hygiene", 3, 1);

        setTimeout(() => {
            console.log("Wave 2 completed!");
            if(isDead){
                killPlayer();
                return;
            } else{
                updateStats(); // Ensure stats are updated after the wave
                startWave3(); // Trigger wave 3
            }
        }, 10000);
    }

    function startWave3() {
        console.log("Wave 3 started!");
        showPopupAdvanced(10000, -20, 0, 1, 0, 0, "Perish.", "");
        playerEffect("happiness", 5, -2);
        playerEffect("energy", 5, -1);

        setTimeout(() => {
            console.log("Wave 3 completed!");
            if(isDead){
                killPlayer();
                return;
            } else {
                updateStats(); // Ensure stats are updated after the wave
                endGame(); // Trigger end game
            }
        }, 5000);
    }

    function endGame() {
        const boss = areas["Ponorogo"]; // Assuming the boss is in the "Ponorogo" area
        const shakeDuration = 1000; // Duration of the shake in milliseconds
        const shakeIntensity = 5; // Intensity of the shake (pixels)
        const originalX = boss.x; // Store the original position
        const originalY = boss.y;
    
        // Function to apply the shake effect
        const startShake = () => {
            const startTime = Date.now();
    
            const shakeInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
    
                if (elapsedTime >= shakeDuration) {
                    clearInterval(shakeInterval);
                    boss.x = originalX; // Reset to the original position
                    boss.y = originalY;
                    return;
                }
    
                // Apply random offsets to simulate shaking
                boss.x = originalX + (Math.random() * shakeIntensity * 2 - shakeIntensity);
                boss.y = originalY + (Math.random() * shakeIntensity * 2 - shakeIntensity);
            }, 50); // Update every 50ms
        };
    
        // Start the shake effect
        startShake();
    
        // After the shake, show the victory popup
        setTimeout(() => {
            showPopup("nocancel", 0, 0, 0, 0, 0, "You have defeated the boss! Congratulations!");
        }, shakeDuration + 500); // Add a small delay after the shake

        setTimeout(() => {
            handleVictory(); // Call the victory function
        }, shakeDuration + 2000); // Add a small delay after the victory popup
    }

    // add thunder effect
    const thunderEffect = document.createElement("div");
    thunderEffect.className = "thunder-effect";
    document.body.appendChild(thunderEffect);
    thunderEffect.classList.remove("hidden");
    setTimeout(() => {
        thunderEffect.classList.add("hidden");
    }, 3000);
    startWave1();
}

// Draw the player and areas
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); // Draw the background image

    for (const area in areas){
        const loc = areas[area];
        let yOffset = 0;
        
        // Apply jump effect if the area is jumping
        if(loc.jumping){
            yOffset = Math.sin(Date.now() / 100) * 20; // Adjust the divisor and multiplier for jump effect
        }

        ctx.drawImage(areaImages[area], loc.x, loc.y + yOffset, loc.width, loc.height);  // Draw the area image
    
        // Locked area overlay
        if(loc.requires && !loc.requires.every(r => visitedAreas.has(r))){
            ctx.globalAlpha = 0.4; // lock alpha val
            ctx.drawImage(lockedOverlayImage, loc.x, loc.y, loc.width, loc.height); // Draw the locked overlay
            ctx.globalAlpha = 1.0; // Reset transparency
        }
    }
    // Check if the player's avatar is defined and is an instance of HTMLImageElement
    ctx.drawImage(player.avatar, player.x, player.y, player.size, player.size); // Draw the player's avatar
}

// Gameloop, run the function recursively
function gameLoop(){
    // Check for hunger, if any drops to 0 just die
    if(player.hunger === 0 || player.energy === 0 || 
        player.hygiene === 0 || player.happiness === 0){
        killPlayer();
    } else if (!isPaused){
        updatePlayerPosition();
        update();
        draw();
        updateStats();
    }
    requestAnimationFrame(gameLoop);
}

// Preload the assets and hide loading screen when done
preloadImages(allImageSources, () => {
    hideLoadingScreen();
    addEventListeners();
    setInterval(updateClock, 1000, false); // Set the clock to update every second
    firstrun();
    gameLoop();
});
