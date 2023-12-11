const express = require("express");
const axios = require("axios").default;
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res)=>{
    const {fromCurrency, toCurrency, date} = req.body;
    console.log(fromCurrency,toCurrency, date);
    res.send('hello');
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});