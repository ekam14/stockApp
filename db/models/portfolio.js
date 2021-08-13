const mongoose = require('mongoose')

let schemaString = { type: String, required: true };
let schemaNumber = { type: Number, required: true };

const portfolioSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    companyName: schemaString,
    symbol: schemaString,
    boughPrice: schemaNumber,
    quantity: schemaNumber,
    netAmount: schemaNumber
},
{
    timestamps: true
})

portfolioSchema.index({userId: 1})


const Portfolio = mongoose.model('portfolio', portfolioSchema)

module.exports = Portfolio