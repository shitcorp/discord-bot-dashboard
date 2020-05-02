const osu = require('node-os-utils');
const Resources = require("./sql/Resources");

module.exports = (logFolderPath) => {
    const cpu = new Resources(logFolderPath, "cpu");
    const mem = new Resources(logFolderPath, "memory");

    setInterval(() => {
        //console.log("Check ran")
        osu.cpu.usage()
            .then(cpuPercentage => {
                cpu.newLog(cpuPercentage).catch();
            });

        osu.mem.used()
            .then(info => {
                const used = Math.floor((info.usedMemMb / info.totalMemMb) * 100) / 100
                mem.newLog(used).catch();
            });
            
    }, 2 * 60000); //Minute * 60000 = milliseconds
}