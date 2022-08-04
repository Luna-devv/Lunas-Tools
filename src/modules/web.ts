// ---------------------------------------------------- Imports

import express, { Request, Response, NextFunction } from 'express';
import { Application } from 'express';
import client from '../app';
import fs from 'fs';

// ---------------------------------------------------- Initialization

const app: Application = express();

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization ');

    next();
});

app.get(`*`, (req: Request, res: Response, next: NextFunction) => {
    if (!client.user) return res.status(500).send({
        status: 500,
        message: `The client is not available`
    });

    next();
});

// ---------------------------------------------------- Routes

const path = require('path');
walk(path.join(__dirname, 'api')).forEach((file: string) => {
    const relativePath = file.replace(path.join(__dirname, 'api'), '');
    const routePath = relativePath.split('\\').join("/").replace(".js", '');
    const routes = require(file).default;

    routes?.forEach((route: { method: string | number; path: any; run: any; }) => {
        if (route.method) app?.[route.method as keyof typeof app]?.(route.path ? route.path : routePath, route.run);
    });
});

function walk(dir: string) {
    const results: string[] = [];

    fs.readdirSync(dir).forEach((dirItem: string) => {
        const whichPath: string = path.join(dir, dirItem);
        const stat: any = fs.statSync(whichPath);
        
        if (stat.isFile()) {
            if (whichPath?.endsWith(`.js`)) return results.push(whichPath)
        } else if (stat.isDirectory()) walk(whichPath).forEach((walkItem: string) => results.push(walkItem));
    });

    return results;
};

// ---------------------------------------------------- Errors

app.get(`*`, (req: Request, res: Response) => {
    return res.status(404).json({
        status: 404,
        message: `This end-point does not exist.`,
    });
});

// ---------------------------------------------------- Start

app.listen(client?.config?.server?.port, () => {
    log(`API`, `Listening to http://localhost:${client?.config?.server?.port}`, `green`);
}).on('error', (error: Error) => {
    log(`API`, JSON.stringify(error), `red`);
});

// ---------------------------------------------------- End of File