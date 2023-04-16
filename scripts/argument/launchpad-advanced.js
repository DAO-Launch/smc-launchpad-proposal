const dotenv = require("dotenv");
dotenv.config();
module.exports = [
    process.env.ADVANCED_TOKEN,
    process.env.ADVANCED_MAX_BUY,
    process.env.ADVANCED_START_TIME,
    process.env.ADVANCED_END_TIME,
    process.env.ADVANCED_RATE,
];
