const mongoose = require('mongoose')
const { Schema } = require('mongoose') 

let schemaString = { type: String, required: true };
let schemaNumber = { type: Number, required: true };

const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    companyName: schemaString,
    symbol: schemaString,
    boughPrice: schemaNumber,
    sellPrice: schemaNumber,
    quantity: schemaNumber,
    netAmount: schemaNumber // Net P/L
},
{
    timestamps: true
})

transactionSchema.index({userId: 1})

const Transactions = mongoose.model('Transaction', transactionSchema);

module.exports = Transactions;