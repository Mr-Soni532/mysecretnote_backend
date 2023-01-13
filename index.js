// Boiler code from expressjs.com/starter/installing.html
const express = require('express');
const connectTOMongo = require('./db');
var cors = require('cors')
require("dotenv").config()

const app = express()
const PORT = process.env.PORT;

app.use(cors())

app.get('/', (req,res)=>{
    res.send('WElcome')
})
app.use(express.json()) //! Middleware

// Availabel Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(PORT, async () => {
    try {
        await connectTOMongo();
        console.log(`mySecretNote backend @ port ${PORT}`)
    } catch (err) {
        console.log(err.message)
    }
})