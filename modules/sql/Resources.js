const Database = require('better-sqlite3');
const { join } = require("path");

class Resources {
    constructor(path, type,) {
        this.db = new Database(join(path, "system.db")/*, { verbose: console.log }*/);
        this.type = type;

        this.db.exec(`CREATE TABLE IF NOT EXISTS ${type}(id INTEGER PRIMARY KEY, usage REAL, time TEXT)`);
    }

    newLog (usage, time = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})) {
        const db = this.db;
        const type = this.type;
        
        return new Promise(function(resolve, reject) {
            try {
                const insert = db.prepare(`INSERT INTO ${type}(usage, time) VALUES (@usage, @time)`);
        
                const inserted = insert.run({
                    usage: usage,
                    time: time,
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Resources;