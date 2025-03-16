/*  ----------------- */
/*       INIT VAR     */
/*  ----------------- */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // 2D rendering context
const avatarIndex = getUrlParam("avatar");
const usernameParam = getUrlParam("username");
let keysPressed = {}; // store the keys pressed by the user for keyboard support
let inGameTime = new Date(); // ingame time
let moveInterval; // button movement interval
let lastHour; // store the last hour for day-night cycle & status decay

// Constants
const PLAYER_DEFAULT = {
    x: 210,
    y: 250,
    size: 80,
    speed: 2,
    hp: 50,
    energy: 50,
    mana: 50,
    hunger: 50,
    money: 0,
    area: "Home"
};

const AREA_IMAGES = {
    "Home": "assets/cities/Jakarta.png",
    "Pontianak": "assets/cities/Pontianak.png",
    "Jayapura": "assets/cities/Jayapura.png",
    "Padang": "assets/cities/Padang.png",
    "Ponorogo": "assets/cities/Ponorogo.png",
    "Secret": "assets/cities/Secret.png"
};

const PLAYER_IMAGES = {
    0: "assets/logo.jpeg", // player null easter egg
    1: "assets/characters/GreenKnight.png",
    2: "assets/characters/PinkMage.png",
    3: "assets/characters/RedKnight.png",
    4: "assets/characters/BlueMage.png"
};

const BG_IMAGE_SRC = "assets/backgrounds/BackgroundMap.png";
const LOCKED_OVERLAY_SRC = "assets/cities/locked.png";

// Player stats
let player = { ...PLAYER_DEFAULT }; // clone the player object
let lastValidPosition = { x: player.x, y: player.y, area: player.area }; // for drag-and-drop

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isMoving = false;
let destination = null;
let visitedAreas = new Set(["Home"]);
let maxDebt = -100; // minimum money to do basic stuff, for easter egg
let effectIntervals = []; // store the effect ids for clearing later

// day-night cycle
const backgroundColors = {
    morning: "bg-blue-200",
    afternoon: "bg-[#FFFFDC]",
    evening: "bg-orange-200",
    night: "bg-blue-400"
};

// Area props
const areas = {
    "Home": {
        x: 180,
        y: 230,
        width: 90,
        height: 90,
        cost: 2,
        type: "safe",
        jumping: false,
        region: "normal"
    },
    "Pontianak": {
        x: 50,
        y: 470,
        width: 90,
        height: 90,
        cost: 1,
        type: "enemy",
        jumping: false,
        region: "normal"
    },
    "Jayapura": {
        x: 320,
        y: 370,
        width: 90,
        height: 90,
        cost: 1,
        type: "enemy",
        requires: ["Pontianak"],
        jumping: false,
        region: "winter"
    },
    "Padang": {
        x: 650,
        y: 80,
        width: 90,
        height: 90,
        cost: 1,
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
        cost: 2,
        type: "enemy",
        requires: ["Pontianak", "Padang", "Jayapura"],
        jumping: false,
        region: "hell"
    },
    "Secret": {
        x: 50,
        y: 50,
        width: 150,
        height: 150,
        cost: 0,
        type: "safe",
        jumping: false,
        region: "normal"
    }
};

const areaActions = {
    "Home": {
        action1: "Rest",
        action2: "Eat",
        action3: "Use Medkit"
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
        action3: "Go to a Library"
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
    }
};

// Images
const areaImages = {};
const playerImg = {};
const bgImage = new Image();
const lockedOverlayImage = new Image();
const profilePic = document.getElementById("profilePic");

// Load images
lockedOverlayImage.src = LOCKED_OVERLAY_SRC;
bgImage.src = BG_IMAGE_SRC;

// Collect all image sources
const allImageSources = [
    BG_IMAGE_SRC,
    LOCKED_OVERLAY_SRC,
    ...Object.values(AREA_IMAGES),
    ...Object.values(PLAYER_IMAGES)
];

Object.keys(AREA_IMAGES).forEach(area => {
    areaImages[area] = new Image();
    areaImages[area].src = AREA_IMAGES[area];
});

Object.keys(PLAYER_IMAGES).forEach(index => {
    playerImg[index] = new Image();
    playerImg[index].src = PLAYER_IMAGES[index];
});

/*  ----------------- */
/*   EVENT LISTENERS  */
/*  ----------------- */
// init event listeners
function addEventListeners() {
    // Button movement support, *5 for faster movement in mobile
    document.getElementById("moveUp").addEventListener("mousedown", () => startMoving(0, -player.speed*5));
    document.getElementById("moveDown").addEventListener("mousedown", () => startMoving(0, player.speed*5));
    document.getElementById("moveLeft").addEventListener("mousedown", () => startMoving(-player.speed*5, 0));
    document.getElementById("moveRight").addEventListener("mousedown", () => startMoving(player.speed*5, 0));

    document.addEventListener("mouseup", stopMoving);
    document.addEventListener("mouseleave", stopMoving);

    // Ensure touch support for mobile devices for buttons
    document.getElementById("moveUp").addEventListener("touchstart", () => startMoving(0, -player.speed*5));
    document.getElementById("moveDown").addEventListener("touchstart", () => startMoving(0, player.speed*5));
    document.getElementById("moveLeft").addEventListener("touchstart", () => startMoving(-player.speed*5, 0));
    document.getElementById("moveRight").addEventListener("touchstart", () => startMoving(player.speed*5, 0));

    document.addEventListener("touchend", stopMoving);
    document.addEventListener("touchcancel", stopMoving);

    // mobile support
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Keyboard support
    document.addEventListener("keydown", (e) => {
        keysPressed[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keysPressed[e.key] = false;
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Button actions using showPopup, I'm sorry for the shit code below
    document.getElementById("action1").addEventListener("click", () => {
        const actions = (areaActions[player.area]).action1;
        if(player.area === "Home") {
            showPopup(actions, 0, 0, 0, 1, 0); 
        } else if(player.area === "Pontianak") {
            if(!hasEnoughResources(1, 2, 0, 0, maxDebt)) return;
            showPopup(actions, -1, -2, 0, 0, 10);
        } else if(player.area === "Jayapura"){
            if(!hasEnoughResources(2, 3, 0, 0, maxDebt)) return;
            showPopup(actions, -2, -3, 0, 0, 15)
        } else if(player.area === "Padang") {
            if(!hasEnoughResources(0, 0, 0, 0, 5)) return;
            showPopup(actions, 0, 0, 0, 2, -5);
        }
    });

    document.getElementById("action2").addEventListener("click", () => {
        const actions = (areaActions[player.area]).action2;
        if(player.area === "Home") {
            showPopup(actions, 0, 0, 1, 0, 0);
        } else if(player.area === "Pontianak") {
            if(!hasEnoughResources(0, 0, 0, 2, maxDebt)) return;
            showPopup(actions, 0, 0, 0, -2, 5);
        } else if(player.area === "Jayapura"){
            if(!hasEnoughResources(0, 0, 0, 3, maxDebt)) return;
            showPopup(actions, 0, 0, 0, -3, 10)
        } else if(player.area === "Padang") {
            if(!hasEnoughResources(0, 0, 0, 0, 5)) return;
            showPopup(actions, 0, 0, 2, 0, -5);
        } 
    });

    document.getElementById("action3").addEventListener("click", () => {
        const actions = (areaActions[player.area]).action3;
        if(player.area === "Home") {
            showPopup(actions, 1, 0, 0, 0, 0);
        } else if(player.area === "Padang") {
            showPopup(actions, 0, 2, 0, 0, 0);
        } else if(player.area === "Ponorogo") {
            if(!hasEnoughResources(1, 1, 1, 1, maxDebt)) return;
            showPopup(actions, -4, -4, -1, -4, 25);
        } 
    });
}

// handle button movement
function startMoving(dx, dy) {
    movePlayer(dx, dy);
    moveInterval = setInterval(() => movePlayer(dx, dy), 100);
}
function stopMoving() {
    clearInterval(moveInterval);
}

// handle mouse movement
function handleMouseDown(e) {
    const { mouseX, mouseY } = getMousePosition(e);
    if(isMouseOverPlayer(mouseX, mouseY)) {
        isDragging = true;
        dragOffsetX = mouseX - player.x;
        dragOffsetY = mouseY - player.y;
    }
}
function handleMouseMove(e) {
    const { mouseX, mouseY } = getMousePosition(e);
    // if the user is hovering over an area or player
    if (isMouseOverArea(mouseX, mouseY) || 
        isMouseOverPlayer(mouseX, mouseY)) {
        canvas.style.cursor = "grab";
    } else {
        canvas.style.cursor = "default";
    }
    // drag the player if isDragging is true
    if (isDragging) {
        player.x = mouseX - dragOffsetX;
        player.y = mouseY - dragOffsetY;
    }
}
function handleMouseUp() {
    // stop drag once mouse is no longer clicked
    isDragging = false;
    if(!isPlayerInValidArea()) {
        resetPlayerPosition();
    }
}

// get mouse pos relative to the canvas
function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    return { mouseX, mouseY };
}

function isMouseOverPlayer(mouseX, mouseY) {
    return mouseX >= player.x && mouseX <= player.x + player.size &&
           mouseY >= player.y && mouseY <= player.y + player.size;
}

// check if the player is in a valid area
function isPlayerInValidArea() {
    const areasContainingPlayer = getAreasContainingPoint(player.x, player.y);
    return areasContainingPlayer.some(({ loc }) => isAreaUnlocked(loc)); // true if areas containing player is unlocked
}

// Check if the mouse is over an area
function isMouseOverArea(clientX, clientY) {
    const areasContainingMouse = getAreasContainingPoint(clientX, clientY);
    return areasContainingMouse.some(({ loc }) => isAreaUnlocked(loc));
}

// return user to last valid position
function resetPlayerPosition() {
    player.x = lastValidPosition.x;
    player.y = lastValidPosition.y;
    player.area = lastValidPosition.area;
}

// handle mobile
function handleClick(e) {
    handleInteraction(e.clientX, e.clientY);
}
function handleTouchStart(e) {
    if(e.touches.length === 1) {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }
}
function handleTouchEnd(e) {
    if(e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }
}

/*  ----------------- */
/*  HELPER FUNCTIONS  */
/*  ----------------- */
// check if a point is in an location
function isPointInLocation(x, y, loc) {
    return x >= loc.x && x <= loc.x + loc.width &&
           y >= loc.y && y <= loc.y + loc.height;
}

// check if a point is in an area
function getAreasContainingPoint(x, y) {
    const containingAreas = [];
    for (const areaName in areas) {
        const loc = areas[areaName];
        if (isPointInLocation(x, y, loc)) {
            containingAreas.push({ name: areaName, loc });
        }
    }
    return containingAreas;
}

// check if an area is unlocked
function isAreaUnlocked(loc) {
    return !loc.requires || loc.requires.every(r => visitedAreas.has(r));
}

// get pfp from avatar selection
function updateProfilePic(avatarIndex) {
    if(!profilePic) {
        console.error("profilePic element not found"); // DEBUG
        return;
    }
    switch (avatarIndex) {
        case "1":
            profilePic.src = "assets/characters/KEVIN.png";
            break;
        case "2":
            profilePic.src = "assets/characters/REGINA.png";
            break;
        case "3":
            profilePic.src = "assets/characters/LINA.png";
            break;
        case "4":
            profilePic.src = "assets/characters/BASTIAN.png";
            break;
        default:
            profilePic.src = "assets/logo.jpeg"; // player null easter egg
            break;
    }
    profilePic.classList.add("pfp-zoom"); // Add the zoom class
}

// get avatar & username from URL
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
}

// Helper function to check if the player has enough resources
function hasEnoughResources(hp, mana, hunger, energy, money) {
    if(player.hp < hp) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough HP.");
        return false;
    }
    if(player.mana < mana) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough mana.");
        return false;
    }
    if(player.hunger < hunger) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough hunger.");
        return false;
    }
    if(player.energy < energy) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough energy.");
        return false;
    }
    if(player.money < money) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough money.");
        return false;
    }
    return true;
}

// give player effect for x seconds
function playerEffect(statName, seconds, value){
    // BUG: Player dying does not reset this interval
    console.log(`Applying effect to ${statName}: ${value} every second for ${seconds} seconds`); // DEBUG
    console.log(`Current ${statName}: ${player[statName]}`); // DEBUG

    // apply effect every second until timeout
    const intervalId = setInterval(() => {
        player[statName] = Math.min(100, Math.max(0, player[statName] + value));
        console.log(`Updated ${statName}: ${player[statName]}`); // DEBUG
        updateStats(); // Ensure the stats are updated in the UI
    }, 1000);

    // Store the interval ID on an array so we can clear it later
    effectIntervals.push(intervalId);

    // stop after x seconds
    setTimeout(() => {
        clearInterval(intervalId);
        console.log(`Effect ${statName} end`); // DEBUG
    }, seconds * 1000);
}

// Create an in-game popup for actions
function showPopup(action="", hp=0, mana=0, hunger=0, energy=0, earnings=0, customMessage = null) {
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    if(!customMessage) { // Sophisticate the message for default message
        let costs = [];
        let gains = [];
        // check, if negative then it's a cost, if positive then it's a gain, if 0 then ignore
        if(hp < 0) costs.push(`${-hp} HP`);
        if(mana < 0) costs.push(`${-mana} mana`);
        if(hunger < 0) costs.push(`${-hunger} hunger`);
        if(energy < 0) costs.push(`${-energy} energy`);
        if(earnings < 0) costs.push(`${-earnings} money`);
        if(hp > 0) gains.push(`${hp} HP`);
        if(mana > 0) gains.push(`${mana} mana`);
        if(hunger > 0) gains.push(`${hunger} hunger`);
        if(energy > 0) gains.push(`${energy} energy`);
        if(earnings > 0) gains.push(`${earnings} money`);

        customMessage = `Are you sure you want to ${action}?\n`;
        if(costs.length > 0) {
            customMessage += `This will cost you:\n${costs.join(", ")}\n`;
        }
        if(gains.length > 0) {
            customMessage += `And earn you:\n${gains.join(", ")}`;
        }
    }

    popupMessage.innerText = customMessage;
    cancelButton.classList.remove("hidden");
    popupContainer.classList.remove("hidden");

    // Function to handle the confirm action
    const confirmAction = () => {
        player.hp = Math.min(100, Math.max(0, player.hp + hp));
        player.mana = Math.min(100, Math.max(0, player.mana + mana));
        player.hunger = Math.min(100, Math.max(0, player.hunger + hunger));
        player.energy = Math.min(100, Math.max(0, player.energy + energy));
        player.money += earnings;
        closePopup();
    };

    // Function to handle the cancel action
    const cancelAction = () => {
        closePopup();
    };

    // Function to handle keydown events
    const handleKeyDown = (event) => {
        if(event.key === "Enter") {
            event.preventDefault(); // browsers would see this as them clicking the fight/explore button ffs
            confirmAction();
        } else if(event.key === "Escape") {
            cancelAction();
        }
    };

    // Function to close the popup with animation
    const closePopup = () => {
        popupContainer.classList.add("closing");
        setTimeout(() => {
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

/*  ----------------- */
/*  UPDATE FUNCTIONS  */
/*  ----------------- */
// When user is on a locked area
function PlayerInLockedArea(loc) {
    let cancelcounter = 0;
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");
    const jumpscare = document.getElementById("jumpscare"); // Define jumpscare element here
    const popupContainer = document.getElementById("popupContainer");

    showPopup("", 0, 0, 0, 0, 0, `You must visit ${loc.requires.join(" and ")} first!`);
    cancelButton.onclick = () => {
        cancelcounter++;
        if(cancelcounter === 1) {
            popupMessage.innerText = `Like I said before, no skipping levels ;>`;
        } else if(cancelcounter === 2) {
            popupMessage.innerText = `You're a persistent one aren't you?`;
        } else if(cancelcounter === 3) {
            popupMessage.innerText = `Don't cheat peeps.`;
        } else if(cancelcounter === 4) {
            popupMessage.innerText = `Now you're just testing my patience.`;
        } else if(cancelcounter > 4) {
            popupMessage.innerText = `That's it, I'm putting you on debt.`;
            player.money -= 100;
            jumpscare.src = "assets/easter-egg/broke.gif"; // Add the path to your image
            jumpscare.classList.remove("hidden");
            cancelButton.classList.add("hidden"); // Hide the cancel button
        }
    };

    confirmButton.onclick = () => {
        jumpscare.classList.add("hidden"); // Hide the jumpscare image
        popupContainer.classList.add("hidden");
    };
}

// Update the clock every second
function updateClock(overrule) {
    inGameTime.setMinutes(inGameTime.getMinutes() + 1); // Increment in-game time by 1 minute

    const hours = String(inGameTime.getHours()).padStart(2, "0");
    const minutes = String(inGameTime.getMinutes()).padStart(2, "0");
    const body = document.body;

    // change time display
    document.getElementById("clock").textContent = `${hours}:${minutes}`;
    if(hours == lastHour && !overrule) return; // same hour and no overrule = no need to update, for efficiency

    // Remove all possible background colors
    body.classList.remove(...Object.values(backgroundColors)); 

    // day-night cycle
    if(hours < 11) {
        body.classList.add(backgroundColors.morning);
    } else if(hours < 16) {
        body.classList.add(backgroundColors.afternoon);
    } else if(hours <= 18) {
        body.classList.add(backgroundColors.evening);
    } else{
        body.classList.add(backgroundColors.night);
    }

    if(overrule) return; // prevent overrule from updating the stats, just day-night cycle

    // Decrement energy every hour (status decay)
    player.energy = Math.max(0, player.energy - 10); // Ensure energy doesn't go below 0
    lastHour = hours;
    updateStats(); // Update the stats display
}

// change bg based on region
function updateBackground(region) {
    const body = document.body;
    body.classList.add("background-transition"); // Add transition class

    switch(region) {
        case "normal":
            body.style.backgroundImage = "url('assets/backgrounds/Main.png')";
            break;
        case "winter":
            body.style.backgroundImage = "url('assets/backgrounds/Winter.png')";
            break;
        case "hell":
            body.style.backgroundImage = "url('assets/backgrounds/Boss.png')";
            break;
        default:
            body.style.backgroundImage = "url('assets/backgrounds/Main.png')";
            break;
    }

    // Remove the transition class after the transition duration
    setTimeout(() => {
        body.classList.remove("background-transition");
    }, 1000); // Match the duration of the CSS transition
}

// Handle arrival when reaching destination
function handleArrival() {
    // Update player position and area
    player.x = destination.x;
    player.y = destination.y;
    player.area = destination.area;

    // Secret area discovery
    if(player.area === "Secret") {
        showPopup("", 0, 0, 0, 0, 200, "Congratulations, You found a secret area! GET OUT");
    }

    // Update player
    player.hunger = Math.max(0, player.hunger - destination.cost);
    visitedAreas.add(destination.area);
    lastValidPosition = { x: player.x, y: player.y, area: player.area };
    destination = null;
    isMoving = false;

    // Enemy area animation
    if(areas[player.area].type === "enemy") {
        areas[player.area].jumping = true;
        setTimeout(() => {
            areas[player.area].jumping = false;
        }, 500);
    }

    // Update UI elements
    updateBackground(areas[player.area].region);
    document.getElementById("interactionText").innerText = `You arrived at ${player.area}`;
    updateButtonActions(player.area);
}

// Update the area interaction buttons depending on the area
function updateButtonActions(area) {
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
    const stats = ["hp", "energy", "mana", "hunger"];
    stats.forEach(stat => {
        const container = document.getElementById(`${stat}Container`);
        container.innerHTML = "";
        const percentage = player[stat];
        const block = document.createElement("div");
        block.classList.add("bar-block", stat);
        block.style.width = `${percentage}%`;
        container.appendChild(block);
    });
    // Update money display
    document.getElementById("money").innerText = `$${player.money}`;
}

/*  ----------------- */
/* MOVEMENT MECHANICS */
/*  ----------------- */
// move the player based on dx and dy depending on the key pressed
function movePlayer(dx, dy) {
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
    for (const { name: areaName, loc } of areasContainingPlayer) {
        if (!isAreaUnlocked(loc)) {
            PlayerInLockedArea(loc);
            resetPlayerPosition();
            return;
        }

        if (player.area !== areaName && !isMoving) {
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

    if (areas[player.area]) {
        updateButtonActions(player.area);
        updateBackground(areas[player.area].region);
    }
}

// Handle the player movement for keyboard
function updatePlayerPosition() {
    if(keysPressed["ArrowUp"] || keysPressed["w"]) {
        movePlayer(0, -player.speed);
    }
    if(keysPressed["ArrowDown"] || keysPressed["s"]) {
        movePlayer(0, player.speed);
    }
    if(keysPressed["ArrowLeft"] || keysPressed["a"]) {
        movePlayer(-player.speed, 0);
    }
    if(keysPressed["ArrowRight"] || keysPressed["d"]) {
        movePlayer(player.speed, 0);
    }
}

// Update the location of the player
function update() {
    if(destination) {
        let dx = destination.x - player.x;
        let dy = destination.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy); // pythagorean theorem to find shortest path

        // Move the player towards the destination
        if(dist > player.speed) {
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
function hideLoadingScreen() {
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
function firstrun() {
    inGameTime.setHours(8, 0, 0, 0); // Start at 08:00 AM
    lastHour = inGameTime.getHours(); // set the last hour to the current hour

    // Grab the url param for avatar and username, only run this once
    if(!avatarIndex || !usernameParam) { // if param is missing, redirect to avatar selection
        window.location.href = "avatar.html";
    } else{
        if(avatarIndex) {
            player.avatar = playerImg[avatarIndex];
            updateProfilePic(avatarIndex); // Update the profile picture
        }
        if(usernameParam) {
            const usernameElement = document.getElementById("username");
            usernameElement.innerText = usernameParam;
        }
    }
    updateClock(true); // Initial call to display the clock immediately
}

/*  ----------------- */
/*    GAME FUNCTIONS  */
/*  ----------------- */
// Handle the player interaction with the areas
function handleInteraction(clientX, clientY) {
    if (isMoving) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    const areasContainingClick = getAreasContainingPoint(clickX, clickY);
    for (const { name: areaName, loc } of areasContainingClick) {
        if (player.area === areaName) return;

        // if player is in a locked area, show popup
        if (!isAreaUnlocked(loc)) {
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
function killPlayer() {
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");
    const inter_text = document.getElementById("interactionText");
    const action1 = document.getElementById("action1");
    const action2 = document.getElementById("action2");
    const action3 = document.getElementById("action3");
    
    let cancelcounter = 0;

    // clr the effect intervals
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
    player = { ...PLAYER_DEFAULT }; // reset the player stats
    visitedAreas.clear();
    visitedAreas.add("Home");
    
    updateBackground("normal");
    firstrun(); // reset da game

    // cancel easter egg
    cancelButton.onclick = () => {
        cancelcounter++;
        if(cancelcounter === 1) {
            popupMessage.innerText = `You can't cancel death silly :b`;
        } else if(cancelcounter === 2) {
            popupMessage.innerText = `You really can't cancel death, you know?`;
        } else if(cancelcounter === 3) {
            popupMessage.innerText = `I'm sorry, but you can't cancel death. you're dead....`;
        } else if(cancelcounter === 4) {
            popupMessage.innerText = `cancel and you're gay`;
        } else if(cancelcounter > 4) {
            popupMessage.innerText = `You just got jumpscared!`;
            const jumpscare = document.getElementById("jumpscare");
            jumpscare.src = "assets/easter-egg/reaper.gif"; // Add the path to your image
            jumpscare.classList.remove("hidden");
            cancelButton.classList.add("hidden"); // Hide the cancel button
        }
    };
}

// Draw the player and areas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); // Draw the background image

    for (const area in areas) {
        const loc = areas[area];
        let yOffset = 0;
        
        // Apply jump effect if the area is jumping
        if(loc.jumping) {
            yOffset = Math.sin(Date.now() / 100) * 20; // Adjust the divisor and multiplier for jump effect
        }

        ctx.drawImage(areaImages[area], loc.x, loc.y + yOffset, loc.width, loc.height);  // Draw the area image
    
        // Locked area overlay
        if(loc.requires && !loc.requires.every(r => visitedAreas.has(r))) {
            ctx.globalAlpha = 0.4; // lock alpha val
            ctx.drawImage(lockedOverlayImage, loc.x, loc.y, loc.width, loc.height); // Draw the locked overlay
            ctx.globalAlpha = 1.0; // Reset transparency
        }
    }
    // Check if the player's avatar is defined and is an instance of HTMLImageElement
    ctx.drawImage(player.avatar, player.x, player.y, player.size, player.size); // Draw the player's avatar
}

// Gameloop, run the function recursively
function gameLoop() {
    // Check for hunger, if any drops to 0 just die
    if(player.hunger === 0 || player.energy === 0 || 
        player.mana === 0 || player.hp === 0) {
        killPlayer();
    } else{
        updatePlayerPosition();
        update();
        draw();
        updateStats();
    }
    requestAnimationFrame(gameLoop);
}

// Preload images and hide loading screen when done
preloadImages(allImageSources, () => {
    hideLoadingScreen();
    addEventListeners();
    setInterval(updateClock, 1000, false); // set the clock to update every second
    firstrun();
    gameLoop();
});