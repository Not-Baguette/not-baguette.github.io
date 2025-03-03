// Init variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let isMoving = false;

// Player stats
let player = {
    x: 75,
    y: 75,
    size: 20,
    speed: 3,
    color: "white",
    hp: 5,
    energy: 5,
    mana: 5,
    hunger: 5,
    money: 0,
    area: "Home"
};

let destination = null;
let visitedAreas = new Set(["Home"]);

// Area props
const areas = {
    "Home": { x: 50, y: 50, width: 50, height: 50, cost: 2 },
    "Pontianak": { x: 200, y: 300, width: 50, height: 50, cost: 1 },
    "Padang": { x: 500, y: 100, width: 50, height: 50, cost: 1 },
    "Papua": { x: 100, y: 500, width: 50, height: 50, cost: 1 },
    "Ponegoro": { x: 600, y: 450, width: 50, height: 50, cost: 2, requires: ["Pontianak", "Padang", "Papua"] }
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
    "Padang": {
        action1: "Stay on an Inn",
        action2: "Go to a Restaurant",
        action3: "Go to a Library"
    },
    "Papua": {
        action1: "Fight",
        action2: "Explore",
        action3: ""
    },
    "Ponegoro": {
        action1: "",
        action2: "",
        action3: "Fight the Boss"
    }
};

// Event listeners
canvas.addEventListener("click", (e) => {
    if (isMoving) return; // stop the user if they are already moving

    const rect = canvas.getBoundingClientRect(); // get the canvas rect for calculation
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // map the area clicked to the area object and see if it's valid
    for (const area in areas) {
        const loc = areas[area];
        if (clickX >= loc.x && clickX <= loc.x + loc.width && 
            clickY >= loc.y && clickY <= loc.y + loc.height
        ) {
            if (player.area === area) return; // if same area, dont do anything
            if (loc.requires && !loc.requires.every(r => visitedAreas.has(r))) { // locked areas logic
                console.log(`You must visit ${loc.requires.join(" and ")} first!`);
                return;
            }
            // set the destination to the center of the area clicked
            destination = { x: loc.x + loc.width / 2, y: loc.y + loc.height / 2, 
                            area: area, cost: loc.cost };
            isMoving = true;
            return;
        }
    }
});

// Helper function to check if the player has enough resources
function hasEnoughResources(hp, mana, hunger, energy, money) {
    if (player.hp < hp) {
        alert("Not enough HP.");
        return false;
    }
    if (player.mana < mana) {
        alert("Not enough mana.");
        return false;
    }
    if (player.hunger < hunger) {
        alert("Not enough hunger.");
        return false;
    }
    if (player.energy < energy) {
        alert("Not enough energy.");
        return false;
    }
    if (player.money < money) {
        alert("Not enough money.");
        return false;
    }
    return true;
}

// TODO: Make an ingame popup for this rather than calling js confirm shi
function showPopup(action, hp, mana, hunger, energy, earnings) {
    if (confirm(`Are you sure you want to ${action}? This will cost/earn you ${hp} HP, ${mana} mana, ${hunger} Hunger, ${energy} energy, and ${earnings} money`)) {
        player.hp = Math.max(0, player.hp + hp);
        player.mana = Math.max(0, player.mana + mana);
        player.hunger = Math.max(0, player.hunger + hunger);
        player.energy = Math.max(0, player.energy + energy);
        player.money += earnings;
    }
}

// Button actions using showPopup, TODO: Balancing. I'm sorry for the shit code below
document.getElementById("action1").addEventListener("click", () => {
    const actions = areaActions[player.area];
    if (player.area === "Home") {
        showPopup(actions.action1, 0, 0, 0, 1, 0); 
    } else if (player.area === "Pontianak") {
        if (!hasEnoughResources(1, 2, 0, 0, 0)) return;
        showPopup(actions.action1, -1, -2, 0, 0, 10);
    } else if (player.area === "Padang") {
        if (!hasEnoughResources(0, 0, 0, 0, 5)) return;
        showPopup(actions.action1, 0, 0, 0, 2, -5);
    }
});

document.getElementById("action2").addEventListener("click", () => {
    const actions = areaActions[player.area];
    if (player.area === "Home") {
        if (!hasEnoughResources(0, 0, 1, 0, 0)) return;
        showPopup(actions.action2, 0, 0, 1, 0, 0);
    } else if (player.area === "Pontianak") {
        if (!hasEnoughResources(0, 0, 0, 2, 0)) return;
        showPopup(actions.action2, 0, 0, 0, -2, 5);
    } else if (player.area === "Padang") {
        if (!hasEnoughResources(0, 0, 0, 0, 5)) return;
        showPopup(actions.action2, 0, 0, 2, 0, -5);
    }
});

document.getElementById("action3").addEventListener("click", () => {
    const actions = areaActions[player.area];
    if (player.area === "Home") {
        showPopup(actions.action3, 1, 0, 0, 0, 0);
    } else if (player.area === "Padang") {
        if (!hasEnoughResources(0, 2, 0, 0, 0)) return;
        showPopup(actions.action3, 0, 2, 0, 0, 0);
    } else if (player.area === "Ponegoro") {
        if (!hasEnoughResources(4, 4, 3, 4, 0)) return;
        showPopup(actions.action3, -4, -4, -3, -4, 25);
    }
});

// Update the location of the player
function update() {
    if (destination) {
        // Move the player towards the destination , euclidian distance
        let dx = destination.x - player.x;
        let dy = destination.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > player.speed) {
            player.x += (dx / dist) * player.speed;
            player.y += (dy / dist) * player.speed;
        } else {
            player.x = destination.x;
            player.y = destination.y;
            player.area = destination.area;
            
            // Check for hunger, if too hungry just die
            if (player.hunger < 1) {
                player.hp = Math.max(0, player.hp - 5); // DEATH
            } else {
                player.hunger = Math.max(0, player.hunger - destination.cost);
            }
            
            // add the area to visited areas
            visitedAreas.add(destination.area);
            console.log(`Entered ${destination.area}`); // DEBUG: REMOVE THIS
            
            // Check for HP related death
            if (player.hp < 1) {
                console.log("You died!");
                player.hp = 5;
                player.hunger = 5;
                player.area = "Home";
                visitedAreas.clear();
                visitedAreas.add("Home");
            }
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
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "yellow";
    for (const area in areas) {
        const loc = areas[area];
        ctx.fillRect(loc.x, loc.y, loc.width, loc.height);
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
    document.getElementById("money").innerText = `Money: ${player.money}`;
}

// Gameloop, run the function on every frame
function gameLoop() {
    update();
    draw();
    updateStats();
    requestAnimationFrame(gameLoop);
}

// Run the gameloop
gameLoop();