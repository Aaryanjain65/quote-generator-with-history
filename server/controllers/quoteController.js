const db = require("../database/db");

// Get random quote from external API
const getRandomQuote = async (req, res) => {
    try {
        // Fetch quote from DummyJSON API
        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        if (!response.ok) {
            throw new Error("External API failed");
        }

        const data = await response.json();

        return res.json({
            success: true,
            source: "External API",
            quote: {
                id: data.id,
                text: data.quote,
                author: data.author
            }
        });

    } catch (error) {
        console.log("API failed. Using SQLite fallback.");

        try {
            // Get random quote from SQLite
            const fallbackQuote = db.prepare(`
                SELECT * FROM quotes
                ORDER BY RANDOM()
                LIMIT 1
            `).get();

            if (!fallbackQuote) {
                return res.status(404).json({
                    success: false,
                    message: "No quotes available"
                });
            }

            return res.json({
                success: true,
                source: "SQLite Fallback",
                quote: {
                    id: fallbackQuote.id,
                    text: fallbackQuote.quote_text,
                    author: fallbackQuote.author,
                    topic: fallbackQuote.topic
                }
            });

        } catch (dbError) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch quote"
            });
        }
    }
};

module.exports = {
    getRandomQuote
};