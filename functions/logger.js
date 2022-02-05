const chalk = require(`chalk`);
var interval;

module.exports = {
    start: (type, text, color) => {
        if (!type) throw new TypeError(`'Type' is undefined`);
        if (!text) throw new TypeError(`'Text' is undefined`);
        console.clear()
        const chars = ["| ", "/ ", "- ", "\\ "];
        var i = 0;

        if (!color) textColor = `white`;
        if (color) textColor = `${color}Bright`;
        interval = setInterval(() => {
            process.stdout.write(`\r` + chalk.gray(chars[i]) + chalk[color || `grey`](`[${type}] `) + chalk[color || `grey`](text));
            i++;
            if (i == chars.length) i = 0;
        }, 100);
    },

    end: (type, text, color) => {
        if (!type) throw new TypeError(`'Type' is undefined`);
        if (!text) throw new TypeError(`'Text' is undefined`);
        if (!color) textColor = `white`;
        if (color) textColor = `${color}Bright`;
        clearInterval(interval);
        console.clear();
        console.log(chalk[color || `grey`](`[${type}] `) + chalk[textColor](text));
    },

    log: (type, text, color) => {
        if (!type) throw new TypeError(`'Type' is undefined`);
        if (!text) throw new TypeError(`'Text' is undefined`);
        if (!color) textColor = `white`;
        if (color) textColor = `${color}Bright`;
        console.log(chalk[color || `grey`](`[${type}] `) + chalk[textColor](text));
    },
};