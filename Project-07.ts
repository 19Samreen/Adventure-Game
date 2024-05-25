#!/usr/bin/env node

//Adventure Game

import inquirer from 'inquirer';

type Room = {
    name: string;
    description: string;
    items: string[];
    adjacentRooms: string[];
};

const rooms: { [key: string]: Room } = {
    "entrance": {
        name: "Entrance",
        description: "You are at the entrance of a dark cave.",
        items: [],
        adjacentRooms: ["hallway"]
    },
    "hallway": {
        name: "Hallway",
        description: "A narrow hallway with flickering torches on the walls.",
        items: ["torch"],
        adjacentRooms: ["entrance", "armory", "kitchen"]
    },
    "armory": {
        name: "Armory",
        description: "A room filled with old weapons and armor.",
        items: ["sword"],
        adjacentRooms: ["hallway"]
    },
    "kitchen": {
        name: "Kitchen",
        description: "A kitchen with pots and pans hanging from the ceiling.",
        items: ["key"],
        adjacentRooms: ["hallway", "treasure room"]
    },
    "treasure room": {
        name: "Treasure Room",
        description: "A room glittering with gold and jewels, but the door is locked.",
        items: [],
        adjacentRooms: ["kitchen"]
    }
};

let inventory: string[] = [];
let currentRoom: Room = rooms["entrance"];

async function mainMenu() {
    console.log(`\nYou are in the ${currentRoom.name}`);
    console.log(currentRoom.description);

    const choices = ["Look around", "Move to another room", "Check inventory", "Exit game"];
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: choices
        }
    ]);

    switch (answers.action) {
        case "Look around":
            lookAround();
            break;
        case "Move to another room":
            await moveRoom();
            break;
        case "Check inventory":
            checkInventory();
            break;
        case "Exit game":
            console.log("Goodbye!");
            return;
    }

    mainMenu();
}

function lookAround() {
    if (currentRoom.items.length > 0) {
        console.log(`You see the following items: ${currentRoom.items.join(", ")}`);
        pickUpItem();
    } else {
        console.log("There is nothing interesting here.");
    }
}

async function pickUpItem() {
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'pickup',
            message: 'Would you like to pick up the items?',
        }
    ]);

    if (answers.pickup) {
        inventory = inventory.concat(currentRoom.items);
        console.log(`You picked up: ${currentRoom.items.join(", ")}`);
        currentRoom.items = [];
    }
}

async function moveRoom() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'room',
            message: 'Which room would you like to move to?',
            choices: currentRoom.adjacentRooms
        }
    ]);

    if (answers.room === "treasure room" && !inventory.includes("key")) {
        console.log("The door is locked. You need a key to enter.");
    } else {
        currentRoom = rooms[answers.room];
    }
}

function checkInventory() {
    if (inventory.length > 0) {
        console.log(`You have: ${inventory.join(", ")}`);
    } else {
        console.log("Your inventory is empty.");
    }
}

// Start the game
mainMenu();
