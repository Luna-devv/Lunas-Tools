import Logger from '../modules/logger';
import express from 'express';
import path from 'path';
import fs from 'fs';

export default async (client: any) => {
	const app: any = express();

	app.use(express.json());
	app.use((req: any, res: any, next: any) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization ');

		next();
	});

	app.get(`*`, (req: any, res: any, next: any) => {
		if (!client.user)
			return res.status(500).send({
				status: 500,
				message: `The client is not available`,
			});

		next();
	});

	walk(path.join(__dirname, '..', 'api')).forEach((file: string) => {
		const relativePath = file.replace(path.join(__dirname, '..', 'api'), '');
		const routePath = relativePath.split('\\').join('/').replace('.js', '');
		const routes = require(file).default;

		routes?.forEach((route: { method: string | number; path: any; run: any }) => {
			if (route.method) app?.[route.method as keyof typeof app]?.(route.path ? route.path : routePath, route.run);
		});
	});

	function walk(dir: string) {
		const results: string[] = [];

		fs.readdirSync(dir).forEach((dirItem: string) => {
			const whichPath: string = path.join(dir, dirItem);
			const stat: any = fs.statSync(whichPath);

			if (stat.isFile()) {
				if (whichPath?.endsWith(`.js`)) return results.push(whichPath);
			} else if (stat.isDirectory()) walk(whichPath).forEach((walkItem: string) => results.push(walkItem));
		});

		return results;
	}

	app.get(`*`, (req: any, res: any, next: any) => {
		return res.status(404).json({
			status: 404,
			message: `This end-point does not exist.`,
		});
	});

	app.listen(client?.config?.server?.port, () => {
		Logger.log(`API`, `Listening to http://localhost:${client?.config?.server?.port}.`, `green`);
	}).on('error', (error: Error) => {
		Logger.log(`API`, JSON.stringify(error), `red`);
	});
};