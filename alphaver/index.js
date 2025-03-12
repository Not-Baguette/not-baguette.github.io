/*  ----------------- */
/*       INIT VAR     */
/*  ----------------- */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const avatarIndex = getUrlParam('avatar');
const usernameParam = getUrlParam('username');

// Player stats
const player_default = {
    x: 200,
    y: 240,
    size: 80,
    speed: 2,
    hp: 5,
    energy: 5,
    mana: 5,
    hunger: 5,
    money: 0,
    area: "Home"
};

let player = { ...player_default }; // copy the player object to prevent mutation

let isMoving = false;
let destination = null;
let visitedAreas = new Set(["Home"]);

// Area props
const areas = {
    "Home": {
        x: 180,
        y: 230,
        width: 80,
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
    "Papua": {
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
        width: 80,
        height: 90,
        cost: 1,
        type: "safe",
        requires: ["Pontianak", "Papua"],
        jumping: false,
        region: "winter"
    },
    "Ponorogo": {
        x: 650,
        y: 450,
        width: 100,
        height: 90,
        cost: 2,
        type: "enemy",
        requires: ["Pontianak", "Padang", "Papua"],
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
    "Papua": {
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
const areaImages = {
    "Home": new Image(),
    "Pontianak": new Image(),
    "Papua": new Image(),
    "Padang": new Image(),
    "Ponorogo": new Image(),
    "Secret": new Image()
};

const playerImg = {
    0: new Image(),
    1: new Image(),
    2: new Image(),
    3: new Image(),
    4: new Image(),
};

const bgImage = new Image();
const lockedOverlayImage = new Image();
const profilePic = document.getElementById("profilePic");

// load the assets, TODO: Consider not loading every character for optimization
lockedOverlayImage.src = "assets/cities/locked.png";
areaImages["Home"].src = "assets/cities/Jakarta.png";
areaImages["Pontianak"].src = "assets/cities/Pontianak.png";
areaImages["Papua"].src = "assets/cities/Jayapura.png";
areaImages["Padang"].src = "assets/cities/Padang.png";
areaImages["Ponorogo"].src = "assets/cities/Ponorogo.png";
areaImages["Secret"].src = "assets/cities/Secret.png";

playerImg[0].src = "assets/logo.jpeg"; //player null easter egg
playerImg[1].src = "assets/characters/GreenKnight.png";
playerImg[2].src = "assets/characters/PinkMage.png";
playerImg[3].src = "assets/characters/RedKnight.png";
playerImg[4].src = "assets/characters/BlueMage.png";
bgImage.src = "assets/backgrounds/BackgroundMap.png";


/*  ----------------- */
/*   EVENT LISTENERS  */
/*  ----------------- */
canvas.addEventListener("click", handleClick);
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchend", handleTouchEnd);

function handleClick(e) {
    handleInteraction(e.clientX, e.clientY);
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }
}

function handleTouchEnd(e) {
    if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }
}

function handleInteraction(clientX, clientY) {
    if (isMoving) return; // stop the user if they are already moving

    const action1 = document.getElementById("action1");
    const action2 = document.getElementById("action2");
    const action3 = document.getElementById("action3");
    
    const rect = canvas.getBoundingClientRect(); // get the canvas rect for calculation
    const scaleX = canvas.width / rect.width;    // scale factor for x
    const scaleY = canvas.height / rect.height;  // scale factor for y
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    // map the area clicked to the area object and see if it's valid
    for (const area in areas) {
        const loc = areas[area];
        // check if the click is within the area (will be looped through all areas)
        if (clickX >= loc.x && clickX <= loc.x + loc.width && 
            clickY >= loc.y && clickY <= loc.y + loc.height) {
            if (player.area === area) return; // if same area, dont do anything
            if (loc.requires && !loc.requires.every(r => visitedAreas.has(r))) { // locked areas logic
                console.log(`You must visit ${loc.requires.join(" and ")} first!`);
                return;
            }
            // set the destination to the center of the area clicked
            destination = { x: loc.x + loc.width / 2, y: loc.y + loc.height / 2, 
                            area: area, cost: loc.cost };
            isMoving = true;
            
            // hide the buttons while moving
            action1.classList.add("hidden");
            action2.classList.add("hidden");
            action3.classList.add("hidden");
            return;
        }
    }
}

// Check if the mouse is over an area
function isMouseOverArea(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    for (const area in areas) {
        const loc = areas[area];
        if (mouseX >= loc.x && mouseX <= loc.x + loc.width &&
            mouseY >= loc.y && mouseY <= loc.y + loc.height) {
            if (loc.requires && !loc.requires.every(r => visitedAreas.has(r))) {
                continue; // Skip locked areas
            }
            return true;
        }
    }
    return false;
}

canvas.addEventListener("mousemove", (e) => {
    if (isMouseOverArea(e.clientX, e.clientY)) {
        canvas.style.cursor = "grab";
    } else {
        canvas.style.cursor = "default";
    }
});

// Button actions using showPopup, I'm sorry for the shit code below
document.getElementById("action1").addEventListener("click", () => {
    const actions = (areaActions[player.area]).action1;
    if (player.area === "Home") {
        showPopup(actions, 0, 0, 0, 1, 0); 
    } else if (player.area === "Pontianak") {
        if (!hasEnoughResources(1, 2, 0, 0, 0)) return;
        showPopup(actions, -1, -2, 0, 0, 10);
    } else if (player.area === "Papua"){
        if (!hasEnoughResources(2, 3, 0, 0, 0)) return;
        showPopup(actions, -2, -3, 0, 0, 15)
    } else if (player.area === "Padang") {
        if (!hasEnoughResources(0, 0, 0, 0, 5)) return;
        showPopup(actions, 0, 0, 0, 2, -5);
    }
});

document.getElementById("action2").addEventListener("click", () => {
    const actions = (areaActions[player.area]).action2;
    if (player.area === "Home") {
        showPopup(actions, 0, 0, 1, 0, 0);
    } else if (player.area === "Pontianak") {
        if (!hasEnoughResources(0, 0, 0, 2, 0)) return;
        showPopup(actions, 0, 0, 0, -2, 5);
    } else if (player.area === "Papua"){
        if (!hasEnoughResources(0, 0, 0, 3, 0)) return;
        showPopup(actions, 0, 0, 0, -3, 10)
    } else if (player.area === "Padang") {
        if (!hasEnoughResources(0, 0, 0, 0, 5)) return;
        showPopup(actions, 0, 0, 2, 0, -5);
    } 
});

document.getElementById("action3").addEventListener("click", () => {
    const actions = (areaActions[player.area]).action3;
    if (player.area === "Home") {
        showPopup(actions, 1, 0, 0, 0, 0);
    } else if (player.area === "Padang") {
        showPopup(actions, 0, 2, 0, 0, 0);
    } else if (player.area === "Ponorogo") {
        if (!hasEnoughResources(1, 1, 1, 1, 0)) return;
        showPopup(actions, -4, -4, -1, -4, 25);
    } 
});

/*  ----------------- */
/*  HELPER FUNCTIONS  */
/*  ----------------- */
// get pfp from avatar selection
function updateProfilePic(avatarIndex) {
    if (!profilePic) {
        console.error("profilePic element not found");
        return;
    }
    switch (avatarIndex) {
        case '1':
            profilePic.src = "assets/characters/KEVIN.png";
            break;
        case '2':
            profilePic.src = "assets/characters/REGINA.png";
            break;
        case '3':
            profilePic.src = "assets/characters/LINA.png";
            break;
        case '4':
            profilePic.src = "assets/characters/BASTIAN.png";
            break;
        default:
            profilePic.src = "assets/logo.jpeg"; // player null easter egg
            break;
    }
    profilePic.classList.add('pfp-zoom'); // Add the zoom class
}

// get avatar & username from URL
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
}

// Helper function to check if the player has enough resources
function hasEnoughResources(hp, mana, hunger, energy, money) {
    if (player.hp < hp) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough HP.");
        return false;
    }
    if (player.mana < mana) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough mana.");
        return false;
    }
    if (player.hunger < hunger) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough hunger.");
        return false;
    }
    if (player.energy < energy) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough energy.");
        return false;
    }
    if (player.money < money) {
        showPopup("", 0, 0, 0, 0, 0, "Not enough money.");
        return false;
    }
    return true;
}

// Create an in-game popup for actions
function showPopup(action="", hp=0, mana=0, hunger=0, energy=0, earnings=0, customMessage = null) {
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    if (!customMessage) { // Sophisticate the message for default message
        let costs = [];
        let gains = [];
        // check, if negative then it's a cost, if positive then it's a gain, if 0 then ignore
        if (hp < 0) costs.push(`${-hp} HP`);
        if (mana < 0) costs.push(`${-mana} mana`);
        if (hunger < 0) costs.push(`${-hunger} hunger`);
        if (energy < 0) costs.push(`${-energy} energy`);
        if (earnings < 0) costs.push(`${-earnings} money`);
        if (hp > 0) gains.push(`${hp} HP`);
        if (mana > 0) gains.push(`${mana} mana`);
        if (hunger > 0) gains.push(`${hunger} hunger`);
        if (energy > 0) gains.push(`${energy} energy`);
        if (earnings > 0) gains.push(`${earnings} money`);

        customMessage = `Are you sure you want to ${action}?\n`;
        if (costs.length > 0) {
            customMessage += `This will cost you:\n${costs.join(", ")}\n`;
        }
        if (gains.length > 0) {
            customMessage += `And earn you:\n${gains.join(", ")}`;
        }
    }

    popupMessage.innerText = customMessage;
    cancelButton.classList.remove("hidden");
    popupContainer.classList.remove("hidden");

    // Function to handle the confirm action
    const confirmAction = () => {
        player.hp = Math.min(5, Math.max(0, player.hp + hp));
        player.mana = Math.min(5, Math.max(0, player.mana + mana));
        player.hunger = Math.min(5, Math.max(0, player.hunger + hunger));
        player.energy = Math.min(5, Math.max(0, player.energy + energy));
        player.money += earnings;
        closePopup();
    };

    // Function to handle the cancel action
    const cancelAction = () => {
        closePopup();
    };

    // Function to handle keydown events
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // browsers would see this as them clicking the fight/explore button ffs
            confirmAction();
        } else if (event.key === "Escape") {
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

// Update the clock every second
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// change bg based on region
function updateBackground(region) {
    const body = document.body;
    body.classList.add('background-transition'); // Add transition class

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
        body.classList.remove('background-transition');
    }, 1000); // Match the duration of the CSS transition
}

/*  ----------------- */
/*    GAME FUNCTIONS  */
/*  ----------------- */
// Kill the player when they die
function killPlayer() {
    let cancelcounter = 0;

    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");
    const inter_text = document.getElementById("interactionText");
    const action1 = document.getElementById("action1");
    const action2 = document.getElementById("action2");
    const action3 = document.getElementById("action3");

    popupMessage.innerText = `You died!`;
    popupContainer.classList.remove("hidden");
    cancelButton.classList.remove("hidden");

    confirmButton.onclick = () => {
        popupContainer.classList.add("hidden");
        jumpscare.classList.add("hidden");
    };

    inter_text.innerHTML = '';
    action1.classList.add("hidden");
    action2.classList.add("hidden");
    action3.classList.add("hidden");

    // Reset visited areas
    areas[player.area].jumping = false;
    player = { ...player_default }; // reset the player stats
    visitedAreas.clear();
    visitedAreas.add("Home");
    
    updateBackground("normal");
    firstrun(); // reinit avatar and everything

    // cancel easter egg
    cancelButton.onclick = () => {
        cancelcounter++;
        if (cancelcounter === 1) {
            popupMessage.innerText = `You can't cancel death silly :b`;
        } else if (cancelcounter === 2) {
            popupMessage.innerText = `You really can't cancel death, you know?`;
        } else if (cancelcounter === 3) {
            popupMessage.innerText = `I'm sorry, but you can't cancel death. You're dead....`;
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
}
// Update the location of the player
function update() {
    if (destination) {
        let dx = destination.x - player.x;
        let dy = destination.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy); // pythagorean theorem to find shortest path

        // Move the player towards the destination
        if (dist > player.speed) {
            // Add sine wave effect to simulate walking
            let sineWave = Math.sin(Date.now() / 100) * 0.8; // Adjust the divisor and multiplier for movement hop

            player.x += (dx / dist) * player.speed;
            player.y += (dy / dist) * player.speed + sineWave;
        } else { // arrived
            player.x = destination.x;
            player.y = destination.y;
            player.area = destination.area;

            if (player.area === "Secret") {
                showPopup("", 0, 0, 0, 0, 200, "Congratulations, You found a secret area! GET OUT");
            }
            
            // reduce the player's hunger after moving
            player.hunger = Math.max(0, player.hunger - destination.cost);
                    
            // add the area to visited areas
            visitedAreas.add(destination.area);
            console.log(`Entered ${destination.area}`); // DEBUG: REMOVE THIS
            
            // Check if the area is an enemy area and set the jumping property
            if (areas[player.area].type === "enemy") {
                areas[player.area].jumping = true;
                setTimeout(() => {
                    areas[player.area].jumping = false;
                }, 500); // Match the duration of the jump animation
            }

            destination = null;
            isMoving = false;
            updateBackground(areas[player.area].region);
            document.getElementById("interactionText").innerText = `You arrived at ${player.area}`;
            updateButtonActions(player.area);
        }
    }
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

// Draw the player and areas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); // Draw the background image

    for (const area in areas) {
        const loc = areas[area];
        let yOffset = 0;
        
        // Apply jump effect if the area is jumping
        if (loc.jumping) {
            yOffset = Math.sin(Date.now() / 100) * 20; // Adjust the divisor and multiplier for jump effect
        }

        ctx.drawImage(areaImages[area], loc.x, loc.y + yOffset, loc.width, loc.height);  // Draw the area image
    
        // Locked area overlay
        if (loc.requires && !loc.requires.every(r => visitedAreas.has(r))) {
            ctx.globalAlpha = 0.4; // Set transparency level (0.0 to 1.0)
            ctx.drawImage(lockedOverlayImage, loc.x, loc.y, loc.width, loc.height); // Draw the locked overlay
            ctx.globalAlpha = 1.0; // Reset transparency
        }
    }

    // Check if the player's avatar is defined and is an instance of HTMLImageElement
    ctx.drawImage(player.avatar, player.x, player.y, player.size, player.size); // Draw the player's avatar
}

// Update the stats bars
function updateStats() {
    const stats = ['hp', 'energy', 'mana', 'hunger'];
    stats.forEach(stat => {
        const container = document.getElementById(`${stat}Container`);
        container.innerHTML = '';
        for (let i = 0; i < player[stat]; i++) {
            let block = document.createElement('div');
            block.classList.add('bar-block', stat);
            container.appendChild(block);
        }
    });
    // Update money display
    document.getElementById("money").innerText = `$${player.money}`;
}

// run once to init everything
function firstrun() {
    // Grab the url param for avatar and username, only run this once
    if (!avatarIndex || !usernameParam) { // if param is missing, redirect to avatar selection
        window.location.href = 'avatar.html';
    } else {
        if (avatarIndex) {
            player.avatar = playerImg[avatarIndex];
            updateProfilePic(avatarIndex); // Update the profile picture
        }
        if (usernameParam) {
            const usernameElement = document.getElementById("username");
            usernameElement.innerText = usernameParam;
        }
    }
    setInterval(updateClock, 1000);
    updateClock(); // Initial call to display the clock immediately
}

// Gameloop, run the function recursively
function gameLoop() {
    // Check for hunger, if too hungry just die
    if (player.hunger === 0) {
        killPlayer();
    } else if (player.hp === 0) {
        killPlayer();
    } else {
        update();
        draw();
        updateStats();
    }
    requestAnimationFrame(gameLoop);
}

firstrun();
gameLoop();