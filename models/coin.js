const mongoose =  require("mongoose");

const CoinSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    id:{
        type: String,
        required: true,
    }
});

const Coin = mongoose.model("Coin", CoinSchema);

module.exports = Coin;