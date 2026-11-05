const db = require("./database/db");

console.log("Database test started.");

const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table'
`).all();

console.log("Available tables:", tables);

db.close();