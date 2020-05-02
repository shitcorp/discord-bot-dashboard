const Database = require('better-sqlite3');
const { join } = require("path");

class Log {
    constructor(path) {
        this.db = new Database(join(path, "system.db")/*, { verbose: console.log }*/);

        this.db.exec("CREATE TABLE IF NOT EXISTS logs(type TEXT, action TEXT, message TEXT, time TEXT)");
    }

    newLog (type, action, message = "", time = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})) {
        const db = this.db;
        
        return new Promise(function(resolve, reject) {
            try {
                const insertLogs = db.prepare(`INSERT INTO logs(type, action, message, time) VALUES (@type, @action, @message, @time, )`);
        
                const insertedLog = insertLogs.run({
                    type: type,
                    action: action,
                    message: message,
                    time: time,
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Log;