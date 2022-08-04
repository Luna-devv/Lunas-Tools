import { CommandType } from '../json/typings';
import path from 'path';
import fs from 'fs';

export default (client: any) => {
    fs.readdirSync(path.join(__dirname, `..`, `interactions`)).filter((file: any) => file.endsWith(`.js`)).map((cmd: any) => {
        let pull: CommandType = require(path.join(__dirname, `..`, `interactions`, cmd)).default;
        client?.interactions?.set(pull.name, pull);
    });
};