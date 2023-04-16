const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const Contract = await hre.ethers.getContractFactory("Proposal");
    const myContract = await Contract.deploy(
        process.env.LAUNCHPAD, // launchpad address       
    );
    await myContract.deployed();
    console.log("Proposal deployed to address:", myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
