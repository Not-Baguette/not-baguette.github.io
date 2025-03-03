// Init variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let isMoving = false;

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

const areas = {
    "Home": { x: 50, y: 50, width: 50, height: 50, cost: 2 },
    "Pontianak": { x: 200, y: 300, width: 50, height: 50, cost: 1 },
    "Padang": { x: 500, y: 100, width: 50, height: 50, cost: 1 },
    "Papua": { x: 100, y: 500, width: 50, height: 50, cost: 1 },
    "Ponegoro": { x: 600, y: 450, width: 50, height: 50, cost: 2, requires: ["Pontianak", "Padang", "Papua"] }
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
    "Padang": {
        action1: "Fight",
        action2: "Explore",
        action3: ""
    },
    "Papua": {
        action1: "Fight",
        action2: "Explore",
        action3: ""
    },
    "Ponegoro": {
        action1: "Fight the Boss",
        action2: "",
        action3: ""
    }
};

// Event listeners
canvas.addEventListener("click", (e) => {
    if (isMoving) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (const area in areas) {
        const loc = areas[area];
        if (
            clickX >= loc.x && clickX <= loc.x + loc.width &&
            clickY >= loc.y && clickY <= loc.y + loc.height
        ) {
            if (player.area === area) return;
            if (loc.requires && !loc.requires.every(r => visitedAreas.has(r))) {
                console.log(`You must visit ${loc.requires.join(" and ")} first!`);
                return;
            }
            destination = { x: loc.x + loc.width / 2, y: loc.y + loc.height / 2, area: area, cost: loc.cost };
            isMoving = true;
            return;
        }
    }
});

// TODO: Popup confirmation, use more than 1 cost/earnings
function showPopup(action, cost, earnings) {
    if (confirm(`${action} will cost ${cost} hunger and earn ${earnings} coins. Do you want to proceed?`)) {
        player.hunger = Math.max(0, player.hunger - cost);
        player.money += earnings;
    }
}

// Button actions, TODO: USE showPopup and CHANGE THE VALUES
document.getElementById("action1").addEventListener("click", () => {
    if (player.area === "Pontianak") {
        player.hp = Math.max(0, player.hp - 1);
        player.mana = Math.max(0, player.mana - 2);
        player.money += 10;
    } else if (player.area === "Padang") {
        player.money = Math.max(0, player.money - 5);
        player.energy = Math.min(5, player.energy + 2);
    } else if (player.area === "Ponegoro") {
        player.hp = Math.max(0, player.hp - 4);
        player.mana = Math.max(0, player.mana - 4);
        player.hunger = Math.max(0, player.hunger - 3);
        player.energy = Math.max(0, player.energy - 4);
        player.money += 25;
    }
});

document.getElementById("action2").addEventListener("click", () => {
    if (player.area === "Pontianak") {
        player.energy = Math.max(0, player.energy - 2);
        player.money += 5;
    } else if (player.area === "Padang") {
        player.money = Math.max(0, player.money - 5);
        player.hunger = Math.min(5, player.hunger + 2);
    }
});

document.getElementById("action3").addEventListener("click", () => {
    if (player.area === "Home") {
        player.hp = Math.min(5, player.hp + 1);
        player.energy = Math.min(5, player.energy + 1);
        player.hunger = Math.min(5, player.hunger + 1);
    } else if (player.area === "Padang") {
        player.money = Math.max(0, player.money - 5);
        player.mana = Math.min(5, player.mana + 2);
    }
});

// Update the location of the player
function update() {
    if (destination) {
        // TODO: CHANGE MOVEMENT CODE SO IT DOESNT NEED TO DO THIS EVERY FRAME FOR OPTIMIZATION, IT WORKS RN THO SIS 
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
    document.getElementById("action1").innerText = actions.action1;
    document.getElementById("action2").innerText = actions.action2;
    document.getElementById("action3").innerText = actions.action3;
    document.getElementById("action1").classList.remove("hidden");
    document.getElementById("action2").classList.remove("hidden");
    document.getElementById("action3").classList.remove("hidden");
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