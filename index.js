const express = require("express");
const axios = require("axios").default;
const schedule = require("node-schedule");
require('dotenv').config();
require('./db/mongoose');

const app = express();
const router = express.Router();
app.use(express.json());

const { listFunction } = require("./utilities/listFunction");

const URL = process.env.URL;
const PORT = process.env.PORT || 3000;



listFunction();
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

router.get('/convert', async (req, res) => {
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
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});