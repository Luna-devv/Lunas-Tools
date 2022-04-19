/**
 *  Copyright (c) 2022 Luna Seemann
 *  https://github.com/Luna-devv/lunas-tools/blob/main/LICENSE
 * 
 *  First rename the config.example.js to config.js,
 *  then run the following commands:
 *
 *  npm i
 *  node .
 * 
 */

const { start, log } = require(`./functions/logger`);
start(`App`, `Connecting to WebSocket..`, `blue`)

const { Client, Intents } = require('discord.js');
const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`]
    },
    presence: {
        status: `invisible`,
        activities: [{
            name: `at waya.one`,
            type: `WATCHING`
        }]
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES
    ],
    partials: ['MESSAGE', 'REACTION']
});


// -------------------------- Import config

const config = require(`./config.js`);
Object.keys(config).forEach(async (key) => {
    client[key] = config[key];
});


// -------------------------- Handlers

const names = ['events']
names.forEach(name => {
    require(`./handlers/${name}`)(client);
});

module.exports = client;
client.login(client.token);


// -------------------------- Web server

const { readdirSync, statSync } = require(`fs`);
const express = require(`express`);
const path = require(`path`);
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization ');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get(`*`, (req, res, next) => {
    if (!client.user) return res.status(500).send({
        status: 500,
        message: `The client is not available`
    });
    next();
});

walk(path.join(__dirname, 'api')).forEach(file => {
    const relativePath = file.replace(path.join(__dirname, 'routes'), '');
    const routePath = relativePath.split('\\').join("/").replace(".js", '');
    const routes = require(file);
    routes.forEach(route => {
        if (route.method) app[route.method](route.path ? route.path : routePath, route.run);
    });
});

function walk(dir) {
    const results = [];
    readdirSync(dir).forEach(dirItem => {
        const stat = statSync(path.join(dir, dirItem));
        if (stat.isFile()) return results.push(path.join(dir, dirItem));
        else if (stat.isDirectory()) walk(path.join(dir, dirItem)).forEach(walkItem => results.push(walkItem));
    });
    return results;
};

app.get(`*`, (req, res) => {
    res.status(404).json({
        status: 404,
        message: `This end-point does not exist.`,
    });
});


app.listen(client.server.port, (error) => {
    if (error) log(`API`, JSON.stringify(error), `red`);
    log(`API`, `Listening to http://localhost:${client.server.port}`, `green`);
});