const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const Contract = await hre.ethers.getContractFactory("LaunchpadAdvancedFactory");
    const myContract = await Contract.deploy();
    await myContract.deployed();
    console.log("LaunchpadAdvancedFactory deployed to address:", myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
