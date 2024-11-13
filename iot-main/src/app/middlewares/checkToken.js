const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const checkToken = (req, res, next) => {
    const token = req.body.token; // Lấy token từ body
    delete req.body.token; // Xóa token trong body

    if (!token) {
        return res.status(403).json({ message: 'No auth' });
    }

    jwt.verify(token, "alittledaisy_token", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        // Attach user data to request
        User.findByPk(decoded.id).then((user) => {
            req.userId = user.id;
        }).catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
        
        next();
    });
};

module.exports = checkToken;
