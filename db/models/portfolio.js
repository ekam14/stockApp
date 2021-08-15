const mongoose = require('mongoose')
const { Schema } = require('mongoose') 

let schemaString = { type: String, required: true };
let schemaNumber = { type: Number, required: true };

const portfolioSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    companyName: schemaString,
    symbol: schemaString,
    boughtPrice: schemaNumber,
    quantity: schemaNumber,
    netAmount: schemaNumber
},
{
    timestamps: true
})

portfolioSchema.index({userId: 1})


const Portfolio = mongoose.model('portfolio', portfolioSchema)

module.exports = Portfolio