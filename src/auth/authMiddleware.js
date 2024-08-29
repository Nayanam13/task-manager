const { verify } = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer'){
        try {
            const decoded = verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }

    }else {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
};