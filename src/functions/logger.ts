import chalk, { Chalk } from 'chalk';
let interval: NodeJS.Timeout;

const Module = {
    start: (type: string, text: string, color: keyof Chalk) => {
        if (!type) throw new TypeError(`'Type' is undefined`);
        if (!text) throw new TypeError(`'Text' is undefined`);
        console.clear()
        const chars = ["| ", "/ ", "- ", "\\ "];
        var i = 0;
        
        let textColor: any = chalk[color || 'grey'];

        interval = setInterval(() => {
            process.stdout.write(`\r` + chalk.gray(chars[i]) + textColor(`[${type}] `) + textColor(text));
            i++;
            if (i == chars.length) i = 0;
        }, 100);
    },

    end: (type: string, text: string, color: keyof Chalk) => {
        if (!type) throw new TypeError(`'Type' is undefined`);
        if (!text) throw new TypeError(`'Text' is undefined`);
        
        let first: any = chalk[color || 'grey'];
        let second: any = `${chalk[color || 'white']}Bright`;

        clearInterval(interval); console.clear();
        console.log(first(`[${type}] `) + second(text));
    },

    log: (type: string, text: string, color: keyof Chalk) => {
        if (!type) throw new TypeError(`'Type' is undefined`);
        if (!text) throw new TypeError(`'Text' is undefined`);
        
        let first: any = chalk[color || 'grey'];
        let second: any = `${chalk[color || 'white']}Bright`;
        
        console.log(first(`[${type}] `) + second(text));
    },
};

export default Module;