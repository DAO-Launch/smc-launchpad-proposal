const dotenv = require("dotenv");
dotenv.config();
module.exports = [
    process.env.TOKEN,
    process.env.MAX_BUY,
    process.env.START_TIME,
    process.env.END_TIME,
    process.env.RATE,
];
