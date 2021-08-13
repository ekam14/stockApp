const express = require('express')
const fs = require('fs')
const path = require('path')
require('../db/mongoose.js') // connects to the db

// Db Models
const User = require('../db/models/user')

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

app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
});


// signup page; saves data
app.post('/saveUserDetails', async (req, res) => {
    // userName
    req.body.userName = req.body.firstName + '_' + req.body.lastName;

    const userData = new User(req.body); 

    // password hashing + userName in model-schema before saving
    try{
        await userData.save();
        const token = await userData.getAuthToken();
        console.log(token);
        return res.status(201).redirect('/purchase');
    }catch(err){
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
        console.log(user, token);
        return res.status(200).redirect('/purchase');
    }catch(err){
        console.log(err)
        return res.status(401).send(err);
    }
})

// purchase page
app.get('/purchase', (req, res) => {
    res.render('purchase', {});
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

    res.render('details', {
        symbol, Name, Description, Sector, PERatio, EPS, WeekHigh, WeekLow, price
    })
})