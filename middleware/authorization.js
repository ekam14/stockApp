const jwt = require('jsonwebtoken')
const User = require('../db/models/user')

// middleware for checking token value and giving access
const auth = async (req, res, next) => {
    try{
        // const token = req.header('authorization').replace('Bearer ', '');
        const token = req.cookies['auth_token'];
        const decode = jwt.verify(token, 'stockApp'); // will give us thee user _id
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})

        req.token = token;
        req.user = user;

        next();
    }catch(err){
        return res.redirect('/login');
    }
}

module.exports = auth;