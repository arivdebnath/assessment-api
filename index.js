const express = require("express");
const axios = require("axios").default;
require('dotenv').config();

const app = express();
app.use(express.json());

const URL = process.env.URL;

app.get('/convert', async (req, res) => {
    try {
        let { fromCurrency, toCurrency, date } = req.body;
        fromCurrency = fromCurrency.toLowerCase();
        toCurrency = toCurrency.toLowerCase();
        const fromData = await axios.request({
            method: "GET",
            url: URL + "/coins/" + fromCurrency + "/history",
            params: {
                date,
            }
        });
        const toData = await axios.request({
            method: "GET",
            url: URL + "/coins/" + toCurrency + "/history",
            params: {
                date,
            }
        });
        const fromCurrencyUSD = fromData.data.market_data.current_price.usd;
        const toCurrencyUSD = toData.data.market_data.current_price.usd;
        const convertedPrice = fromCurrencyUSD / toCurrencyUSD;
        return res.status(200).json({ price: convertedPrice });
    } catch (err) {
        return res.status(500).json({
            error: err,
        });
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});