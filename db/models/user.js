const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let schemaString = { type: String, required: true };

const userSchema = new mongoose.Schema({
    firstName: schemaString,
    lastName: schemaString,
    userName: schemaString,
    email: { type: String, unique: true, required: true },
    password: schemaString,
    dob: { type: Date, required: true },
    amount: { type: Number, default: 10000 },
    netProfit: { type: Number, default: 0 },
    netLoss: { type: Number, default: 0 }
},
{
    timestamps: true
})

// instance methods
userSchema.methods.getAuthToken = function(){
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, 'stockApp');

    return token;
}

// can setup own methods: model methods
userSchema.statics.findByCred = async (email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// middleware -> password hash
userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

// shoule be after middleware; because we have to middleware on schema
const User = mongoose.model('User', userSchema);

module.exports = User;