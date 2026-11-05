const db = require("../database/db");

// Add quote to favorites
const addFavorite = (req, res) => {
    try {
        const { quote_id } = req.body;

        if (!quote_id) {
            return res.status(400).json({
                success: false,
                message: "Quote ID is required"
            });
        }

        // Check if quote exists
        const quote = db.prepare(
            "SELECT * FROM quotes WHERE id = ?"
        ).get(quote_id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: "Quote not found"
            });
        }

        // Prevent duplicate favorites
        const existingFavorite = db.prepare(
            "SELECT * FROM favorites WHERE quote_id = ?"
        ).get(quote_id);

        if (existingFavorite) {
            return res.status(409).json({
                success: false,
                message: "Quote is already in favorites"
            });
        }

        const result = db.prepare(
            "INSERT INTO favorites (quote_id) VALUES (?)"
        ).run(quote_id);

        res.status(201).json({
            success: true,
            message: "Quote added to favorites",
            favorite_id: result.lastInsertRowid
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add favorite"
        });
    }
};

// Remove quote from favorites
const removeFavorite = (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare(
            "DELETE FROM favorites WHERE id = ?"
        ).run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found"
            });
        }

        res.json({
            success: true,
            message: "Favorite removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove favorite"
        });
    }
};

module.exports = {
    addFavorite,
    removeFavorite
};