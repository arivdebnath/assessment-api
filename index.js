const express = require("express");
const axios = require("axios").default;
const schedule = require("node-schedule");
require('dotenv').config();
require('./db/mongoose');

const app = express();
app.use(express.json());

const Coin = require("./models/coin");

const URL = process.env.URL;
const PORT = process.env.PORT||3000;

const listFunction = async (req, res) => {
    try {
        const { data } = await axios.request({
            method: "GET",
            url: URL + "/coins/list",
            params: {
                include_platform: false,
            }
        });
        var countone = 0;
        var countwo = 0;
        data.forEach(async (coinData) => {
            const item = await Coin.findOne({
                name: coinData.name,
                id: coinData.id,
            })
            if (item) {
                console.log(`Already there ${countone}`);
                countone = countone + 1;
                return;
            }
            else {
                console.log(`insert ${countwo}`);
                countwo = countwo + 1;
                const newCoin = new Coin({
                    name: coinData.name,
                    id: coinData.id,
                })
                const savedCoin = await newCoin.save();
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// listFunction();
schedule.scheduleJob("0 * * * *", listFunction);

// app.get('/list', async (req, res) => {
//     const list = await axios.request({
//         method: "GET",
//         url: URL + "/coins/list",
//         params: {
//             include_platform: false,
//         }
//     });
//     console.log(list);
//     res.send(list.data);
// })

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
        return res.status(200).json({
            price: convertedPrice,
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});