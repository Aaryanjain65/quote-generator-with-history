const express = require("express");
const router = express.Router();

const db = require("../database/db");

const { getRandomQuote } = require("../controllers/quoteController");

const {
    addFavorite,
    removeFavorite
} = require("../controllers/favoriteController");

// Get random quote
router.get("/random", getRandomQuote);

// Get all favorite quotes
router.get("/favorites", (req, res) => {
    try {
        const favorites = db.prepare(`
            SELECT quotes.*, favorites.id AS favorite_id
            FROM favorites
            JOIN quotes ON favorites.quote_id = quotes.id
            ORDER BY favorites.id DESC
        `).all();

        res.json(favorites);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch favorites"
        });
    }
});

// Add favorite
router.post("/favorites", addFavorite);

// Remove favorite
router.delete("/favorites/:id", removeFavorite);

// Get all quotes
router.get("/", (req, res) => {
    try {
        const quotes = db.prepare(
            "SELECT * FROM quotes ORDER BY id DESC"
        ).all();

        res.json(quotes);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch quotes"
        });
    }
});

module.exports = router;