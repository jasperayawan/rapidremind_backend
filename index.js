const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors');
const bodyParser = require('body-parser')
const conn = require('./db/connection')

const authRoute = require('./routes/auth')
const noteRoute = require('./routes/note')

dotenv.config();

const port = process.env.PORT;

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))


app.use('/api/user', authRoute);
app.use('/api/note', noteRoute);

app.listen(port, () => {
    conn();
    console.log('server listening to port:', port);
})