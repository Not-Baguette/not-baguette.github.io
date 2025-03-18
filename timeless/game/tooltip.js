document.addEventListener("DOMContentLoaded", () => {
    const tooltip = document.getElementById("tooltip");

    const stats = [
        {id: "happinessContainer", text: "Happiness: Represents the player's overall mood and satisfaction." },
        {id: "energyContainer", text: "Energy: Indicates the player's stamina and ability to perform actions." },
        {id: "hygieneContainer", text: "Hygiene: Reflects the player's cleanliness and health." },
        {id: "hungerContainer", text: "Hunger: Shows the player's need for food and nourishment." }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        element.addEventListener("mouseenter", (e) => {
            tooltip.textContent = stat.text;
            tooltip.classList.add("visible");
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        element.addEventListener("mousemove", (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        element.addEventListener("mouseleave", () => {
            tooltip.classList.remove("visible");
        });
    });
});