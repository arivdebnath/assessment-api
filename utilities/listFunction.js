const express = require("express");
const axios =  require("axios").default;
const Coin = require("../models/coin");
require('dotenv').config();
const URL = process.env.URL;

exports.listFunction = async (req, res) => {
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