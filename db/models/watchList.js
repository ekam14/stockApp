const mongoose = require('mongoose')

let schemaString = { type: String, required: true };

const watchListSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    companyName: schemaString,
    symbol: schemaString
},
{
    timestamps: true
})

watchListSchema.index({userId: 1});

const watchList = mongoose.model('watchlist', watchListSchema)

module.exports = watchList;