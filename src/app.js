const express = require('express')
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
require('../db/mongoose.js') // connects to the db

// Middlewares
const auth = require('../middleware/authorization')

// Db Models
const User = require('../db/models/user')
const Portfolio = require('../db/models/portfolio')

// Helper Functions
const { Trie } = require('../helperFunctions/triePreprocess')
const { getFundamentals, getPrice } = require('../helperFunctions/apiFunctions')

const app = express()

const port = 8000

// PATHS
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

// hbs use
app.set('view engine', 'hbs')
app.set('views', viewsPath)

// static folder
app.use(express.static(publicDirectoryPath))
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.use(cookieParser()) // parses frontend cookie

app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
});


// signup page; saves data
app.post('/signup', async (req, res) => {
    // userName
    req.body.userName = req.body.firstName + '_' + req.body.lastName;

    const userData = new User(req.body); 

    // password hashing + userName in model-schema before saving
    try{
        await userData.save();
        const token = await userData.getAuthToken();
        res.cookie('auth_token', token, { expires: new Date(Date.now() + 1800000)});
        res.cookie('amount', 10000, { expires: new Date(Date.now() + 1800000)});
        return res.status(201).send(userData);
    }catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
})

// get login page
app.get('/login', async (req, res) => {
    res.render('login', {})
})

// login page
app.post('/login', async (req, res) => {
    try{
        const user = await User.findByCred(req.body.email, req.body.password); // own method
        const token = await user.getAuthToken();
        res.cookie('auth_token', token, { expires: new Date(Date.now() + 1800000)}); // 30 min expire time
        res.cookie('amount', user.amount, { expires: new Date(Date.now() + 1800000)});
        return res.send(user);
    }catch(err){
        return res.status(400).send(err);
    }
})

// logout page
app.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token; // keep all the tokens not equal to current token
        })

        await req.user.save();

        res.clearCookie('auth_token'); // removes cookie
        res.clearCookie('amount');

        return res.status(200).send('User logout');
    }catch(err){
        return res.status(500).send(err);
    }
})

// purchase page
app.get('/purchase', auth, (req, res) => {
    res.render('purchase', {});
})

// purchase stock
app.post('/purchaseStock', auth, async (req, res) =>{
    try{
        req.user.amount -= req.body.netAmount;
        console.log(req.user.amount, req.body.netAmount, typeof(req.user.amount), typeof(req.body.netAmount));
        await req.user.save();
       
        // saving data to portfolio collection
        req.body.userId = req.user._id;
        console.log(req.body);
        const portfolioData = new Portfolio(req.body);
        await portfolioData.save();
        
        res.cookie('amount', req.user.amount);

        return res.redirect('/portfolio')
    }catch(err){
        console.log(err);
        return res.status(500).send('Server is down, please try again later.')
    }
})

// portolio page
app.get('/portfolio', auth, async (req, res) => {
    try{
        const portfolioData = await Portfolio.findOne({userId: req.user._id});
        console.log(portfolioData);

        res.status(200).send('Portfolio Page');
    }catch(err){
        return res.send(500).send('Server is down, please try again later.')
    }
})

// getting symbols + name of the companies; self-executing function + Trie Formation
var symbolsTrie = new Trie();
var companiesTrie = new Trie();

(async (fileName) => {
    const filePath = path.join(__dirname, fileName + '.csv')

    const fileData = await fs.readFileSync(filePath).toString().split('\n')

    for(let index = 1; index < fileData.length; index ++){
        let el = fileData[index].split(',');
        if(el[0]) symbolsTrie.insert(el[0].toLowerCase());
        if(el[1]) companiesTrie.insert(el[1].toLowerCase());
    }
})('../nasdaq')


// for getting probable words for a word
app.get('/probableWords', (req, res) => {
    let { word } = req.query;
    let symbols = symbolsTrie.possibleWords(word), companies = companiesTrie.possibleWords(word);
    res.send(symbols);
})

app.get('/details', async (req, res) => {
    let { symbol } = req.query  

    const { Name, Description, Sector, PERatio, EPS, WeekHigh, WeekLow } = await getFundamentals(symbol)
    const price = await getPrice(symbol)

    const possibleQty = parseInt(req.cookies['amount'] / price);

    res.render('details', {
        symbol, Name, Description, Sector, PERatio, EPS, WeekHigh, WeekLow, price, possibleQty
    })
})