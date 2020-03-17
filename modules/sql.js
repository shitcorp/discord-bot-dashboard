const Database = require('better-sqlite3');

const logs = new Database("dbs/logs.db", { verbose: console.log });

logs.exec("CREATE TABLE IF NOT EXISTS system(type TEXT, message TEXT, date TEXT, action TEXT)");