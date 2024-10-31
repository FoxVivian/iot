const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const checkToken = (req, res, next) => {
    const token = req.body.token; // Get token from the request body
    delete req.body.token; // Remove token from the body

    if (!token) {
        return res.status(403).json({ message: 'No auth' });
    }

    jwt.verify(token, "alittledaisy_token", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        // Attach user data to request
        User.findById(decoded.id)  // Use findById with Mongoose
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                req.userId = user._id; // Attach user ID to request
                next(); // Move to the next middleware
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            });
    });
};

module.exports = checkToken;
