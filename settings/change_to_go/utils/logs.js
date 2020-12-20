
const { checkFolder } = require("./utilis");
const fs = require("fs");
const logs = {};

const writeToFile = (name, data) => {

    const logPath = `${process.userData}/logs/`;
    checkFolder(logPath);

    const path = `${logPath}${name}.log`
    if (!fs.existsSync(path)) fs.writeFileSync(path, `> Logs mit dem Namen ${name}\n`);

    const time = new Date().toString().split(" ").slice(4, 5)[0];

    fs.appendFileSync(path, `[${time}] ${data}\n`);

}

logs.debug = (name, data) => {
    // if (process.isDev) {
        writeToFile(name, data + "\n" );
    // }
}

logs.info = writeToFile;
logs.error = (name, data) => {
    writeToFile(`error-${name}`, data);
};


logs.time = () => {
    return + new Date();
}



module.exports = logs;