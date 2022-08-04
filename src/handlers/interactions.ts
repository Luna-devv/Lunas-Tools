import { CommandType } from '../json/typings';
import { readdirSync } from 'fs';

export default (client: any) => {
    const commands: string[] = readdirSync('./interactions/').filter((file: string) => file.endsWith('.js'));

    for (let file of commands) {
        let pull: CommandType = require(`../interactions/${file}`);

        if (pull.name) {
            client?.interactions?.set(pull.name, pull);
        };
    };
};