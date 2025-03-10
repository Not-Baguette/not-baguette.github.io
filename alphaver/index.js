// Init variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let isMoving = false;
let destination = null;
let visitedAreas = new Set(["Home"]);

const avatarIndex = getUrlParam('avatar');
const usernameParam = getUrlParam('username');

// Player stats
let player = {
    x: 180,
    y: 220,
    size: 80,
    speed: 2,
    hp: 5,
    energy: 5,
    mana: 5,
    hunger: 5,
    money: 0,
    area: "Home"
};

// Area props
const areas = {
    "Home": { x: 180, y: 230, width: 50, height: 50, cost: 2 },
    "Pontianak": { x: 50, y: 500, width: 50, height: 50, cost: 1 },
    "Papua": { x: 320, y: 370, width: 50, height: 50, cost: 1, requires: ["Pontianak"] },
    "Padang": { x: 650, y: 80, width: 50, height: 50, cost: 1, requires: ["Pontianak", "Papua"] },
    "Ponegoro": { x: 650, y: 450, width: 50, height: 50, cost: 2, requires: ["Pontianak", "Padang", "Papua"] }
};

// Button texts
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
    "Ponegoro": {
        action1: "",
        action2: "",
        action3: "Fight the Boss"
    }
};

// Load images
const areaImages = {
    "Home": new Image(),
    "Pontianak": new Image(),
    "Papua": new Image(),
    "Padang": new Image(),
    "Ponegoro": new Image()
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
lockedOverlayImage.src = "assets/locked.png";

//load the assets,  TODO: Consider not loading every character for optimization
areaImages["Home"].src = "assets/logo.jpeg";
areaImages["Pontianak"].src = "assets/logo.jpeg";
areaImages["Papua"].src = "assets/logo.jpeg";
areaImages["Padang"].src = "assets/logo.jpeg";
areaImages["Ponegoro"].src = "assets/logo.jpeg";

playerImg[0].src = "assets/logo.jpeg"; //player null easter egg
playerImg[1].src = "assets/GreenKnight.png";
playerImg[2].src = "assets/PinkMage.png";
playerImg[3].src = "assets/RedKnight.png";
playerImg[4].src = "assets/PinkMage.png";
bgImage.src = "assets/BackgroundMap.png";


// Event listeners
canvas.addEventListener("click", (e) => {
    if (isMoving) return; // stop the user if they are already moving

    const action1 = document.getElementById("action1");
    const action2 = document.getElementById("action2");
    const action3 = document.getElementById("action3");
    
    const rect = canvas.getBoundingClientRect(); // get the canvas rect for calculation
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

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
    } else if (player.area === "Ponegoro") {
        if (!hasEnoughResources(1, 1, 1, 1, 0)) return;
        showPopup(actions, -4, -4, -2, -4, 25);
    } 
});


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

// Kill the player when they die
function killPlayer() {
    player.hp = 5;
    player.hunger = 5;
    player.energy = 5;
    player.mana = 5;
    player.money = 0;
    player.area = "Home";
    visitedAreas.clear();
    visitedAreas.add("Home");
    let cancelcounter = 0;

    // move the player back to spawn
    player.x = 180;
    player.y = 220;

    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");
    const inter_text = document.getElementById("interactionText")
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
            jumpscare.src = "assets/reaper.gif"; // Add the path to your image
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
            
            // reduce the player's hunger after moving
            player.hunger = Math.max(0, player.hunger - destination.cost);
                    
            // add the area to visited areas
            visitedAreas.add(destination.area);
            console.log(`Entered ${destination.area}`); // DEBUG: REMOVE THIS
            
            destination = null;
            isMoving = false;
            
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

    ctx.drawImage(player.avatar, player.x, player.y, player.size, player.size);

    for (const area in areas) {
        const loc = areas[area];
        ctx.drawImage(areaImages[area], loc.x, loc.y, loc.width, loc.height);
    
        // Locked area overlay
        if (loc.requires && !loc.requires.every(r => visitedAreas.has(r))) {
            ctx.globalAlpha = 0.7; // Set transparency level (0.0 to 1.0)
            ctx.drawImage(lockedOverlayImage, loc.x, loc.y, loc.width, loc.height);
            ctx.globalAlpha = 1.0; // Reset transparency
        }
    }

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

function firstrun() {
    // Grab the url param for avatar and username, only run this once
    if (!avatarIndex || !usernameParam) { // if param is missing, redirect to avatar selection
        window.location.href = 'avatar.html';
    } else {
        if (avatarIndex) {
            player.avatar = playerImg[avatarIndex]; 
        }
        if (usernameParam) {
            const usernameElement = document.getElementById("username");
            usernameElement.innerText = usernameParam;
        }
    }
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

// Run the game
firstrun();
gameLoop();