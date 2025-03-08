# Timeless Adventure Codebase Documentation

## Introduction
This is the Codebase documentation for the game Timeless Adventure, on this following markdown document, the inner workings of this program will be comprehensively explained. As one of the main developer for this program, I hope this will hopefully explain what does what and should help you understand the inner workings better.


## Table of Contents
- [Introduction](#introduction)
- [Table of Contents](#table-of-contents)
- [Prerequisite](#prerequisite)
  - [Flow of Program](#flow-of-program)
  - [Frameworks](#frameworks)
  - [Concepts](#concepts)
  - [File Structure](#file-structure)
  - [Modifying the Codebase](#modifying-this-codebase)
  - [Documentation](#documentation)
- [Mechanics](#mechanics)
  - [User Customization](#user-customization)
  - [UI (Non-canvas)](#ui-non-canvas)
  - [Area Mechanics](#area-mechanics)
    - [Adding a New Area](#adding-a-new-area)
  - [Game Mechanics (HP, energy, mana, hunger)](#game-mechanics)
  - [Popups](#popups)
  - [Movement](#movement)
  - [Gameloop](#gameloop)

## Prerequisite
### Flow of Program
The flow of program should be something like this;
1. User visits index.html,
2. User gets redirected to avatar.html until they correctly provides a name and picked an avatar. 
3. Go back to index.html with said avatar and username
4. Visit and fight Papua and Pontianak to unlock Padang
5. Recover on Padang
6. Fight the Boss on Ponegoro

### Frameworks
Try your best to implement everything on tailwind to minimize CSS usage. Bootstrap was considered however Tailwind was overall better than bootstrap in this case due to its flexibility.

### Concepts
Since this is heavy on javascript, I'll explain the necessary concepts to explain it here. The `index.js` (main game) is heavily **Object-Oriented** inspired. However, is not class-oriented. This means that this program will treat things as objects and actions. For example, a player will be initialized as `player` hashmap with statuses bound to them. Every action they do will execute a function that influences the `player` hashmap depending on the action.

This OOP program is also merged with a **gameloop**, basic game development idea where processeses run in a continous loop to process user input, this is ran every iteration/frame to continously update the user stats, user movement, etc.

### File Structure
This project consists of the following files:
- index.html
  - style.css (Shared)
  - index.js

- avatar.html
  - style.css (Shared)
  - avatar.js

### Modifying this Codebase
Please follow [lowerCamelCase naming style](https://code-basics.com/languages/javascript/lessons/naming-style). However, this does not apply on the CSS, where tailwind uses kebab-style naming style. Which should be followed, but not strictly adhered to.

For curly braces, please use [Egyptian-style](https://javascript.info/coding-style#curly-braces) with 4 spaces of indentation.

### Documentation
If you did a major change or added a new function or mechanic, please add them to one of the [Mechanics](#mechanics) subsection. However if it does not fit with any of them, feel free to make a new one!

# Mechanics
This is the game's CSS and Javascript documentation.

## User Customization
Status: **UNFINISHED**, waiting for assets
Stuff related to avatar & Username.
### CSS
- `#prevAvatar` & `#nextAvatar`, Button to select the previous/next avatar (TODO: Waiting for assets)
- `#username`, Username input field for username on avatar selection. TODO: rename to avoid confusion with `.username`
- `#avatarImage`, Image element to display the selected avatar
- `#submitBtn`, Button to submit the selected avatar and username as url params to index.html
### Javascript
- [avatar.js](avatar.js), This entire file is used for user customization. Separated into three event listeners for `prevAvatar`, `nextAvatar`, and `submitBtn`. 
- `getUrlParam(name)`, Finds URL params that was sent from `avatar.js`, receives `name`, which would be the parameter name. Used to be implemented via regex, however switched to more modern built-in `URLSearchParams()` function. (TODO: Consider merging to firstrun)
- `Firstrun()`, Receives no parameter, checks `username` and `avatar` parameter via GetURLParam()
- `playerImg`, hashmap of images for the canvas, contains avatar 1-4. TODO: Easter egg for avatar 0 that is accessible by the user tampering on the URL params
- `avatarIndex`, grab the avatar index from `getUrlParam()`
- `usernameParam`, grab the username from `getUrlParam()`

## UI (Non-canvas)
Status: **UNFINISHED**, needs more design before finalizing. Zero compatibility with mobile
Everything Related to the UI outside the game canvas
### CSS
- `canvas`, The main board the player will be playing on (TODO: Make the edge more rounded)
- `.username`, Used to style the user-given name
- `.logo`, Game logo on top-right of the top bar
### Javascript
- None


## Area Mechanics
STATUS: **UNFINISHED**, Waiting for assets
### Adding a new area
Glad to hear we're adding a new area :D, to enter a new area, I've made a system that makes it easy for us to add one within minutes. Simply follow the steps below:
1. Add it to `areas` hashmap following the format 
```javascript
"areName": { x: int, y: int, width: int, height: int, cost: int },
```
2. add the actions that could be taken on `areaActions` with the format like below:
```javascript
"areaName": {
    action1: "Action 1",
    action2: "Action 2",
    action3: "" // leaving it empty will automatically get rid of the button
},
```
3. Add the area name to `areaImages` hashmap
```javascript
const areaImages = {
    ....
    "areaName": new Image()
};

...
areaImages["areaName"].src = "assets/areaName.jpeg";
```
4. Add your actions through the event listeners for `action1`-`action3`
```javascript
else if (player.area === "areaName"){
        if (!hasEnoughResources(minimumHp, minimumMana, minimumHunger, minimumEnergy, minimumMoney)) return; // replace with minimum cost for entry
        showPopup(actions, hp, mana, hunger, energy, money) // costs will be negative, rewards will be positive
    }
```
5. And you're done!
### CSS
- None, since this is exclusively canvas area, implementation should be in Javascript
### Javascript
- `player` hashmap holds the player's `x` and `y` coordinates, `size`, and `area` (current area).
- `areas`, nested hasmap containing the name of the area and their location (`x`,`y`), size (`width`, `height`), `cost`, and *optionally* `requires` which receives an array of area names to visit before visiting that area (TODO: Devtool easteregg for a secret area).
- `areaActions`, a nested hashmap for area action texts.
- `areaImages`, a hashmap for areas images.
- `destination` hashmap that holds the destination's `x`, `y`, `cost` (cost to enter the area), and `area` (area name).
- `visitedAreas`, array of areas that has been visited by the user, used to check if the user can enter a certain area yet
- Event listeners for `action1`-`action3`, used to determine what buttons will do in each areas.
- `updateButtonActions(area)`, receives the area and then set the button texts to texts from `areaActions` hashmap.


## Game Mechanics
Status: **UNFINISHED**, `.bar-container` is bugged on mobile.
Related to Game mechanics, Specifically HP, energy, mana, hunger.
### CSS
- `.bar-container` & `.bar-block`, This is meant for the actual bar and the bar block that HP, energy, mana, and hunger uses CSS styling bugs in mobile and should be fixed (TODO)
- `#money`, ID is used here to decrease unnecessary classes
- `.hp`, `.energy`, `.mana`, `.hunger`, Different colors depending on the type
### Javascript
- `HP`, `mana`, `hunger`, and `money` are managed by `player` hashmap. Accessible via `player.hp`, etc.
- `hasEnoughResources(hp, mana, hunger, energy, money)`, this function is used to check if the player has enough HP, mana, hunger, energy, and money. This is disabled at home and at Boss to let the user die from fights.
- `updateStats()`, receives no arguments. Syncronize the amount of bar-block in the bar-container with the values inside `player` hashmap.
- `killPlayer()`, receives no arguments. Resets the user's progress. For how does the game check if the user has died, see [gameloop](#gameloop)

## Popups
STATUS: **FINISHED**
Popup system for nearly everything that interacts with the user. TODO: Implementation on locked regions.
### CSS
- Currently, `popupAnimationOpen`, `PopupAnimationClose`, `ShadowFadeIn`, `ShadowFadeOut` are used to make a transition for popups. These transitions are considered **FINISHED** as of date.
- `#popupcontainer`, used to style the Popup you see in game
- `.rounded-border`, used to round the popup
### Javascript
- `showPopup(action="", hp=0, mana=0, hunger=0, energy=0, earnings=0, customMessage=null)`, `action` parameter will receive a string that will be included as the action the user wishes to do (defaults to ""), `hp`/`mana`/`hunger`/`energy`/`earnings` receive an integer. If it's negative, it'll be regarded as cost. If it's a positive integer, it'll be considered as a reward. If 0, then it wont be added (defaults to 0).

## Movement
STATUS: **FINISHED**
Everything related to movement mechanics.
### CSS
- None, all movements are processed in javascript
### Javascript
- `isMoving`, variable, serves as something similar to mutex lock, disables movement while moving. Calculates destination based on Euclidean distance between two points
- `canvas` event listener, get the coordinates and such.
- `rect`, get the position of the canvas that is still relative to the browser/viewport
- `clickX` and `clickY`, get the click coordinate that is relative to the canvas rather than to the viewport.
- `update()`, calculates the difference (`dy`, `dx`) between the player position (`player.x/y`) and the destination position (`destination.x/y`), calculate the trajectory via pythagorean theorem to get the more efficient path, and then add it incrementally by `player.speed`. If arrived, change player `area`, reduce the player `hunger` by `cost`, add it to `visitedArea` array, set `destination` to `null` and `isMoving` to `false`, and then pass it with/to `updateButtonActions(player.area)`

## Gameloop
STATUS: **FINISHED**
Stuff related to the gameloop and is not included above
### CSS
- None
### Javascript
- Every `gameLoop()` checks if the `hunger` or `health` of the player has ran out. if yes, the player will be killed via `killPlayer()` function.
- Then the `gameLoop()` function runs `update()`, `draw()`, and `updateStats()` (`update()` and `updateStats()` was explained)
- `draw()` draws the player and the locations. Since we need the location to keep showing every frame, we can't put this on `firstrun()`