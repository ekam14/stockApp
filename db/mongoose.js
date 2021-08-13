const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/stock-db', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((res) => console.log('Database Connected'))
.catch((err) => console.log(err))