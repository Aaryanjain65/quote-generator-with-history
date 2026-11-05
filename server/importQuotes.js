const fs = require("fs");
const path = require("path");
const db = require("./database/db");

const jsonPath = path.join(
    __dirname,
    "data",
    "quote_history_seed.json"
);

const quotes = JSON.parse(
    fs.readFileSync(jsonPath, "utf8")
);

const insertQuote = db.prepare(`
    INSERT OR IGNORE INTO quotes
    (id, quote_text, author, topic)
    VALUES (?, ?, ?, ?)
`);

const importQuotes = db.transaction((records) => {
    for (const quote of records) {
        insertQuote.run(
            quote.id,
            quote.text,
            quote.author,
            quote.topic
        );
    }
});

importQuotes(quotes);

const total = db.prepare(
    "SELECT COUNT(*) AS count FROM quotes"
).get();

console.log("Total quotes in SQLite:", total.count);

db.close();