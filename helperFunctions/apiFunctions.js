const axios = require('axios')

// API CALLS
const API_KEY_Alpha = 'VD93RVZ7008HRG45'

const getFundamentals = async (symbol) => {
    try{
        const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY_Alpha}`);

        let { Name, Description, Sector, PERatio, EPS  } = response.data
        
        return { Name, Description, Sector, PERatio, EPS, 'WeekHigh': response.data['52WeekHigh'], 
            'WeekLow': response.data['52WeekLow']};
    }catch(err){
        console.log(err);
    }
}

const getPrice = async (symbol) => {
    try{
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${API_KEY_Alpha}`);

        let latestKey = Object.keys(response.data['Time Series (1min)'])[0]

        return response.data['Time Series (1min)'][latestKey]['1. open']
    }catch(err){
        console.log(err);
    }
}

module.exports = { getFundamentals, getPrice }