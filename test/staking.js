const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");

describe("Staking Testing", async function () {
    let deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11;
    let aicToken, aicNFT, oracle, usdt, marketplace, staking;

    beforeEach(async function () {
        [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11] =
            await ethers.getSigners();
        //****************============TOKEN PREPARING============****************//
        const AICToken = await ethers.getContractFactory("BGNToken", deployer);
        aicToken = await AICToken.deploy();

        //****************============NFT PREPARING============****************//
        const AICNFT = await ethers.getContractFactory("HREANFT", deployer);
        aicNFT = await AICNFT.deploy("AICrew Collection", "AICNFT", deployer.address);
        //****************============CURRENCY PREPARING============****************//
        const USDT = await ethers.getContractFactory("USDT", deployer);
        //deploy contract
        usdt = await USDT.deploy();
        //****************============ORACLE PREPARING============****************//
        const Oracle = await ethers.getContractFactory("OracleTest", deployer);
        //deploy contract
        oracle = await Oracle.deploy(
            "0x08f17263271c6d7BBaa8225B176CaCf36c2D7Cb8", //pair
            usdt.address, //stable
            "0xFFa5d0193a1f14Ce7FDf55FDC884ef2B32e2c43C" //token
        );
        //****************============MARKETPLACE PREPARING============****************//
        const Marketplace = await ethers.getContractFactory("Marketplace", deployer);
        marketplace = await Marketplace.deploy(
            aicNFT.address,
            aicToken.address,
            oracle.address,
            "0xb5422FBF3Fe4a144838F13dD0100c32A6497C222",
            usdt.address
        );
        //****************============STAKING PREPARING============****************//
        const Staking = await ethers.getContractFactory("Staking", deployer);
        staking = await Staking.deploy(
            aicToken.address,
            aicNFT.address,
            oracle.address,
            marketplace.address
        );
        //set staking contract
        await marketplace.connect(deployer).setStakingContractAddress(staking.address);
        //****************============TOKEN + NFT + USDT + MARKETPLACE PREPARING============****************//
        await aicToken.connect(deployer).transfer(
            staking.address,
            "1000000000000000000000000" //100k token
        );
        //prepare NFT
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
                process.env.URI_GODDESS,
            ],
            1, //tier Goddess
            user1.address //to
        );
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
            ],
            2, //tier Demon
            user2.address //to
        );
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
                process.env.URI_DEVIL,
            ],
            3, //tier Fairy
            user3.address //to
        );
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
                process.env.URI_CAT,
            ],
            4, //tier Bear
            user4.address //to
        );
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
                process.env.URI_RABBIT,
            ],
            5, //tier Bunny
            user5.address //to
        );
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
                process.env.URI_BEAR,
            ],
            6, //tier Cat
            user6.address //to
        );
        await aicNFT.connect(deployer).batchMintTo(
            [
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
                process.env.URI_NORMAL,
            ],
            7, //tier Cat
            user7.address //to
        );
        //approve first
        await aicNFT.connect(user1).setApprovalForAll(staking.address, true);
        await aicNFT.connect(user2).setApprovalForAll(staking.address, true);
        await aicNFT.connect(user3).setApprovalForAll(staking.address, true);
        await aicNFT.connect(user4).setApprovalForAll(staking.address, true);
        await aicNFT.connect(user5).setApprovalForAll(staking.address, true);
        await aicNFT.connect(user6).setApprovalForAll(staking.address, true);
        await aicNFT.connect(user7).setApprovalForAll(staking.address, true);
    });

    describe.skip("#stakeAPY", async function () {
        it("should get apy exactly", async function () {
            const apyNFT1 = await staking.connect(deployer).getStakeApyForTier(1);
            expect(apyNFT1).to.equal(8);
            const apyNFT2 = await staking.connect(deployer).getStakeApyForTier(5);
            expect(apyNFT2).to.equal(6);
        });

        it("should set apy success", async function () {
            await staking.connect(deployer).setStakeApyForTier(1, 10);
            const apyNFT1 = await staking.connect(deployer).getStakeApyForTier(1);
            expect(apyNFT1).to.equal(10);
            await staking.connect(deployer).setStakeApyForTier(5, 20);
            const apyNFT2 = await staking.connect(deployer).getStakeApyForTier(5);
            expect(apyNFT2).to.equal(20);
        });
    });

    describe.skip("#ComissionCondition", async function () {
        it("should get comission condition exactly", async function () {
            const condition1 = await staking.connect(deployer).getComissionCondition(1);
            expect(condition1).to.equal(0);
            const condition2 = await staking.connect(deployer).getComissionCondition(2);
            expect(condition2).to.equal(500);
        });

        it("should set comission condition success", async function () {
            await staking.connect(deployer).setComissionCondition(1, 9999);
            const condition1 = await staking.connect(deployer).getComissionCondition(1);
            expect(condition1).to.equal(9999);
        });
    });

    describe.skip("#CommissionPercent", async function () {
        it("should get comission percent exactly", async function () {
            const percent1 = await staking.connect(deployer).getCommissionPercent(1);
            expect(percent1).to.equal(5);
            const percent2 = await staking.connect(deployer).getCommissionPercent(5);
            expect(percent2).to.equal(10);
        });

        it("should set comission percent success", async function () {
            await staking.connect(deployer).setCommissionPercent(1, 50);
            const condition1 = await staking.connect(deployer).getCommissionPercent(1);
            expect(condition1).to.equal(50);
        });
    });

    describe.skip("#stake", async function () {
        it("should stake success", async function () {
            //stake
            await staking.connect(user1).stake(
                [1, 2, 3], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
        });

        it("should revert because all nfts are not same tier", async function () {
            await aicNFT.connect(deployer).batchMintTo(
                [
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                ],
                5, //tier Goddess
                user1.address //to
            );
            //stake
            await expect(
                staking.connect(user1).stake(
                    [1, 2, 71, 72], //list NFT ID
                    24, //only valid period is 24 months
                    1000, //refcode of systemWallet
                    ethers.utils.formatBytes32String("step1")
                )
            ).to.be.revertedWith("STAKING: ALL NFT'S TIERS MUST BE SAME");
        });
    });

    describe.skip("#stakeWithSystemRef", function () {
        it("should stake success", async function () {
            let balanceRef1, balanceRef2, balanceRef3;

            //************************** STEP 1  **************************//
            //test ref is systemWallet. The commission amount should transfer to systemWallet
            await staking.connect(user1).stake(
                [1, 2], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            //check ref after stake
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user1.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance token after stake
            balanceRef1 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef1).to.equal("80000000000000000000"); //80 * 10^18
            // explain: total stake 2 NFT ID = 1 (price=800) <=> 1600 USDT to stake contract
            // commisson ref1: 1600 * 0.5% = 8 USDT = 80 token * decimal = 18 => 800000000000000000000
            //=========> REF LOGIC: SYSTEM WALLET => USER1(F1)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 0
            //=========> BALANCE STAKED USD:: SYSTEM WALLET = 0, USER1 = 1600
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 0
            //************************** STEP 2  **************************//
            await staking.connect(user2).stake(
                [11, 12], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step2")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user2.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance token after stake
            // now systemWallet is Ref2 but cannot receive any token cause by condition comission
            balanceRef2 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef2).to.equal("150000000000000000000"); //150 * 10^18
            // explain: total stake 2 NFT ID = 2 (price=700) <=> 1400 USDT to stake contract
            // commisson ref 1 for systemWallet = 0.5% => 1400 * 0.5% = 7 USDT = 70 token * decimal = 18
            //=========> REF LOGIC: SYSTEM WALLET => USER1(F1)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 0
            //=========> BALANCE STAKED USD:: SYSTEM WALLET = 0, USER2 = 1400
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80 + 70 = 150, USER2 = 0
            //************************** STEP 3  **************************//
            await staking.connect(user3).stake(
                [21, 22], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step3")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user3.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance token after stake
            // now systemWallet is Ref3 but cannot receive any token cause by condition comission
            balanceRef3 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef3).to.equal("210000000000000000000"); //420 * 10^18
            // explain: total stake 2 NFT ID = 3 (price=600) <=> 1200 USDT to stake contract
            // commisson ref 1 for systemWallet = 1% => 1200 * 0.5% = 6 USDT = 60 token * decimal = 18
            //=========> REF LOGIC: SYSTEM WALLET => USER3(F1)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 0
            //=========> BALANCE STAKED USD:: SYSTEM WALLET = 0, USER2 = 1200
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80 + 70 + 60 = 210, USER2 = 0
        });
    });

    describe.skip("#stakeNotEnoughCondition", function () {
        it("should stake success", async function () {
            let balanceRef1, balanceRef2, balanceRef3, balanceRef4, balanceRef5, balanceRef6;
            //************************** STEP 1  **************************//
            //test ref is systemWallet. The commission amount should transfer to systemWallet
            await staking.connect(user1).stake(
                [1, 2], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            //check ref after stake
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user1.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance token after stake
            balanceRef1 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef1).to.equal("80000000000000000000"); //80 * 10^18
            // explain: total stake 2 NFT ID = 1 (price=800) <=> 1600 USDT to stake contract
            // commisson ref1: 1600 * 0.5% = 8 USDT = 80 token * decimal = 18 => 800000000000000000000
            //=========> REF LOGIC: SYSTEM WALLET => USER1(F1)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 0
            //=========> BALANCE STAKED USD:: SYSTEM WALLET = 0, USER1 = 1600
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 0
            //************************** STEP 2  **************************//
            await staking.connect(user2).stake(
                [11, 12], //list NFT ID
                24, //only valid period is 24 months
                1001, //refcode of user1
                ethers.utils.formatBytes32String("step2")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user2.address);
            expect(getRefAddress).to.equal(user1.address);
            //check balance token after stake
            // now systemWallet is Ref2 but cannot receive any token cause by condition comission
            balanceRef2 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef2).to.equal("80000000000000000000"); //80 * 10^18
            // now user1 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef1).to.equal("70000000000000000000"); //70 * 10^18
            // explain: total stake 2 NFT ID = 2 (price=700) <=> 1400 USDT to stake contract
            // commisson ref 2 for systemWallet = 0.5% but get 0 cause by NO ENOUGH STAKED AMOUNT(0$)
            // commisson ref 1 for user1 = 0.5% => 1400 * 0.5% = 7 USDT = 70 token * decimal = 18
            //=========> REF LOGIC: SYSTEM WALLET => USER1(F1) => USER2(F2)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 500, USER1 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 1600, USER2 = 1400
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 70
            //************************** STEP 3  **************************//
            await staking.connect(user3).stake(
                [21, 22], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user2
                ethers.utils.formatBytes32String("step3")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user3.address);
            expect(getRefAddress).to.equal(user2.address);
            //check balance token after stake
            // now systemWallet is Ref3 but cannot receive any token cause by condition comission
            balanceRef3 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef3).to.equal("80000000000000000000"); //80 * 10^18
            // now user1 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef2).to.equal("130000000000000000000"); //130 * 10^18
            // now user2 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef1).to.equal("60000000000000000000"); //160 * 10^18
            // explain: total stake 2 NFT ID = 3 (price=600) <=> 1200 USDT to stake contract
            // commisson ref 3 for systemWallet = 0.5% but get 0 cause by NO ENOUGH STAKED AMOUNT(0 < 1000)
            // commisson ref 2 for user1 = 0.5% => 1200 * 0.5% = 6 USDT = 60 token * decimal = 18
            // commisson ref 1 for user2 = 0.5% => 1200 * 0.5% = 6 USDT = 60 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 1000, USER1 = 500, USER2 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 1600, USER2 = 1400, USER3 = 1200
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 70 + 60, USER2 = 60
            //************************** STEP 4  **************************//
            await staking.connect(user4).stake(
                [31, 32], //list NFT ID
                24, //only valid period is 24 months
                1003, //refcode of user3
                ethers.utils.formatBytes32String("step4")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user4.address);
            expect(getRefAddress).to.equal(user3.address);
            //check balance token after stake
            // now systemWallet is Ref4
            balanceRef4 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef4).to.equal("80000000000000000000"); //80 * 10^18
            // now user1 is Ref3
            balanceRef3 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef3).to.equal("180000000000000000000"); //180 * 10^18
            // now user2 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef2).to.equal("110000000000000000000"); //110 * 10^18
            // now user3 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user3.address);
            expect(balanceRef1).to.equal("50000000000000000000"); //50 * 10^18
            // explain: total stake 2 NFT ID = 4 (price=500) <=> 1000 USDT to stake contract
            // commisson ref 4 for systemWallet = 0.5% but get 0 cause by NO ENOUGH STAKED AMOUNT(0 < 2000)
            // commisson ref 3 for user1 = 0.5% => 1000 * 0.5%% = 5 USDT = 50 token * decimal = 18
            // commisson ref 2 for user2 = 0.5% => 1000 * 0.5%% = 5 USDT = 50 token * decimal = 18
            // commisson ref 1 for user3 = 0.5% => 1000 * 0.5%% = 5 USDT = 50 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3) => USER4(F4)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 2000, USER1 = 1000, USER2 = 500, USER3 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 1600, USER2 = 1400, USER3 = 1200, USER4 = 1000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 70 + 60 + 50, USER2 = 60 + 50, USER3 = 50
            //************************** STEP 5  **************************//
            await staking.connect(user5).stake(
                [41, 42], //list NFT ID
                24, //only valid period is 24 months
                1004, //refcode of user4
                ethers.utils.formatBytes32String("step5")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user5.address);
            expect(getRefAddress).to.equal(user4.address);
            //check balance token after stake
            // now systemWallet is Ref5
            balanceRef5 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef5).to.equal("80000000000000000000"); //80 * 10^18
            // now user1 is Ref4
            balanceRef4 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef4).to.equal("180000000000000000000"); //180 * 10^18
            // now user2 is Ref3
            balanceRef3 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef3).to.equal("150000000000000000000"); //150 * 10^18
            // now user3 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user3.address);
            expect(balanceRef2).to.equal("90000000000000000000"); //90 * 10^18
            // now user4 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user4.address);
            expect(balanceRef1).to.equal("40000000000000000000"); //40 * 10^18
            // explain: total stake 2 NFT ID = 5 (price=400) <=> 800 USDT to stake contract
            // commisson ref 5 for systemWallet = 1% but get 0 cause by NO ENOUGH STAKED AMOUNT(0 < 3000)
            // commisson ref 4 for user1 = 0.5% => but get 0 cause by NO ENOUGH STAKED AMOUNT(1600 < 2000)
            // commisson ref 3 for user2 = 0.5% => 800 * 1% = 4 USDT = 40 token * decimal = 18
            // commisson ref 2 for user3 = 0.5% => 800 * 1% = 4 USDT = 40 token * decimal = 18
            // commisson ref 1 for user4 = 0.5% => 800 * 1% = 4 USDT = 40 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3) => USER4(F4) => USER5(F5)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 3000, USER1 = 2000, USER2 = 1000, USER3 = 500, USER4 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 1600, USER2 = 1400, USER3 = 1200, USER4 = 1000, USER5 = 800
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 70 + 60 + 50 = 180, USER2 = 60 + 50 + 40 = 150, USER3 = 50 + 40, USER4 = 40
            //************************** STEP 6  **************************//
            await staking.connect(user6).stake(
                [51, 52], //list NFT ID
                24, //only valid period is 24 months
                1005, //refcode of user4
                ethers.utils.formatBytes32String("step6")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user6.address);
            expect(getRefAddress).to.equal(user5.address);
            //check balance token after stake
            // now systemWallet is Ref6
            balanceRef6 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef6).to.equal("80000000000000000000"); //160 * 10^18
            // now user1 is Ref5
            balanceRef5 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef5).to.equal("180000000000000000000"); //260 * 10^18
            // now user2 is Ref4
            balanceRef4 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef4).to.equal("150000000000000000000"); //220 * 10^18
            // now user3 is Ref3
            balanceRef3 = await aicToken.connect(deployer).balanceOf(user3.address);
            expect(balanceRef3).to.equal("120000000000000000000"); //180 * 10^18
            // now user4 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user4.address);
            expect(balanceRef2).to.equal("70000000000000000000"); //140 * 10^18
            // now user5 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user5.address);
            expect(balanceRef1).to.equal("30000000000000000000"); //60 * 10^18
            // explain: total stake 2 NFT ID = 5 (price=300) <=> 600 USDT to stake contract
            // commisson ref 6 for systemWallet, but get 0 cause by NO ENOUGH STAKED AMOUNT(0 < 3500)
            // commisson ref 5 for user1 = 1% => but get 0 cause by NO ENOUGH STAKED AMOUNT(1600 < 3000)
            // commisson ref 4 for user2 = 0.5% => but get 0 cause by NO ENOUGH STAKED AMOUNT(1400 < 2000)
            // commisson ref 3 for user3 = 0.5% => 600 * 0.5% = 3 USDT = 30 token * decimal = 18
            // commisson ref 2 for user4 = 0.5% => 600 * 0.5% = 3 USDT = 30 token * decimal = 18
            // commisson ref 1 for user5 = 0.5% => 600 * 0.5% = 3 USDT = 30 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3) => USER4(F4) => USER5(F5) => USER6(F6)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 3500, USER1 = 3000, USER2 = 2000, USER3 = 1000, USER4 = 500, USER5 =0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 1600, USER2 = 1400, USER3 = 1200, USER4 = 1000, USER4 = 800, USER5 = 800, USER6 = 600
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 80, USER1 = 70 + 60 + 50 = 180, USER2 = 60 + 50 + 40 = 150, USER3 = 50 + 40 + 30 = 120, USER4 = 40 + 30, USER5 = 30,
        });
    });

    describe.skip("#stakeEnoughCondition", function () {
        it("should stake success", async function () {
            let balanceRef1, balanceRef2, balanceRef3, balanceRef4, balanceRef5, balanceRef6;
            //approve first
            await aicNFT.connect(user1).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user2).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user3).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user4).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user5).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user6).setApprovalForAll(staking.address, true);
            //************************** STEP 1  **************************//
            //test ref is systemWallet. The commission amount should transfer to systemWallet
            await staking.connect(user1).stake(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            //check ref after stake
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user1.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance token after stake
            balanceRef1 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef1).to.equal("400000000000000000000"); //800 * 10^18
            // explain: total stake 10 NFT ID = 1 (price=800) <=> 8000 USDT to stake contract
            // commisson ref1: 8000 * 0.5% = 40 USDT = 400 token * decimal = 18 => 40000000000000000000000
            //=========> REF LOGIC: SYSTEM WALLET => USER1(F1)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 0
            //=========> BALANCE STAKED USD:: SYSTEM WALLET = 0, USER1 = 8000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 800, USER1 = 0
            //************************** STEP 2  **************************//
            await staking.connect(user2).stake(
                [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], //list NFT ID
                24, //only valid period is 24 months
                1001, //refcode of user1
                ethers.utils.formatBytes32String("step2")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user2.address);
            expect(getRefAddress).to.equal(user1.address);
            //check balance token after stake
            // now systemWallet is Ref2 but cannot receive any token cause by condition comission
            balanceRef2 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef2).to.equal("400000000000000000000"); //400 * 10^18
            // now user1 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef1).to.equal("350000000000000000000"); //700 * 10^18
            // explain: total stake 10 NFT ID = 2 (price=700) <=> 7000 USDT to stake contract
            // commisson ref 2 for systemWallet = 0.5% but get 0 cause by NO ENOUGH STAKED AMOUNT(0$)
            // commisson ref 1 for user1 = 0.5% => 7000 * 0.5% = 35 USDT = 350 token * decimal = 18
            //=========> REF LOGIC: SYSTEM WALLET => USER1(F1) => USER2(F2)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 5000, USER1 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 8000, USER2 = 7000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 800, USER1 = 350
            //************************** STEP 3  **************************//
            await staking.connect(user3).stake(
                [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user2
                ethers.utils.formatBytes32String("step3")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user3.address);
            expect(getRefAddress).to.equal(user2.address);
            //check balance token after stake
            // now systemWallet is Ref3 but cannot receive any token cause by condition comission
            balanceRef3 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef3).to.equal("400000000000000000000"); //400 * 10^18
            // now user1 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef2).to.equal("650000000000000000000"); //650 * 10^18
            // now user2 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef1).to.equal("300000000000000000000"); //600 * 10^18
            // explain: total stake 10 NFT ID = 3 (price=600) <=> 6000 USDT to stake contract
            // commisson ref 3 for systemWallet = 0.5% but get 0 cause by NO ENOUGH STAKED AMOUNT(0$)
            // commisson ref 2 for user1 = 0.5% => 6000 * 0.5% = 30 USDT = 300 token * decimal = 18
            // commisson ref 1 for user2 = 0.5% => 6000 * 0.5% = 30 USDT = 300 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 1000, USER1 = 500, USER2 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 8000, USER2 = 7000, USER3 = 6000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 400, USER1 = 350 + 300, USER2 = 300
            //************************** STEP 4  **************************//
            await staking.connect(user4).stake(
                [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], //list NFT ID
                24, //only valid period is 24 months
                1003, //refcode of user3
                ethers.utils.formatBytes32String("step4")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user4.address);
            expect(getRefAddress).to.equal(user3.address);
            //check balance token after stake
            // now systemWallet is Ref4
            balanceRef4 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef4).to.equal("400000000000000000000"); //400 * 10^18
            // now user1 is Ref3
            balanceRef3 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef3).to.equal("900000000000000000000"); //900 * 10^18
            // now user2 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef2).to.equal("550000000000000000000"); //550 * 10^18
            // now user3 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user3.address);
            expect(balanceRef1).to.equal("250000000000000000000"); //250 * 10^18
            // explain: total stake 10 NFT ID = 4 (price=500) <=> 5000 USDT to stake contract
            // commisson ref 4 for systemWallet = 0.5% but get 0 cause by NO ENOUGH STAKED AMOUNT(0)
            // commisson ref 3 for user1 = 0.5% => 5000 * 0.5% = 25 USDT = 250 token * decimal = 18
            // commisson ref 2 for user2 = 0.5% => 5000 * 0.5% = 25 USDT = 250 token * decimal = 18
            // commisson ref 1 for user3 = 0.5% => 5000 * 0.5% = 25 USDT = 250 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3) => USER4(F4)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 2000, USER1 = 1000, USER2 = 500, USER3 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 8000, USER2 = 7000, USER3 = 6000, USER4 = 5000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 400, USER1 = 350 + 300 + 250 = 900, USER2 = 300 + 250, USER3 = 250
            //************************** STEP 5  **************************//
            await staking.connect(user5).stake(
                [41, 42, 43, 44, 45, 46, 47, 48, 49, 50], //list NFT ID
                24, //only valid period is 24 months
                1004, //refcode of user4
                ethers.utils.formatBytes32String("step5")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user5.address);
            expect(getRefAddress).to.equal(user4.address);
            //check balance token after stake
            // now systemWallet is Ref5
            balanceRef5 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef5).to.equal("400000000000000000000"); //800 * 10^18
            // now user1 is Ref4
            balanceRef4 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef4).to.equal("1100000000000000000000"); //1100 * 10^18
            // now user2 is Ref3
            balanceRef3 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef3).to.equal("750000000000000000000"); //750 * 10^18
            // now user3 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user3.address);
            expect(balanceRef2).to.equal("450000000000000000000"); //450 * 10^18
            // now user4 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user4.address);
            expect(balanceRef1).to.equal("200000000000000000000"); //200 * 10^18
            // explain: total stake 10 NFT ID = 5 (price=400) <=> 4000 USDT to stake contract
            // commisson ref 5 for systemWallet = 1% but get 0 cause by NO ENOUGH STAKED AMOUNT(0)
            // commisson ref 4 for user1 = 0.5% => 4000 * 0.5% = 20 USDT = 200 token * decimal = 18
            // commisson ref 3 for user2 = 0.5% => 4000 * 0.5% = 20 USDT = 200 token * decimal = 18
            // commisson ref 2 for user3 = 0.5% => 4000 * 0.5% = 20 USDT = 200 token * decimal = 18
            // commisson ref 1 for user4 = 0.5% => 4000 * 0.5% = 20 USDT = 200 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3) => USER4(F4) => USER5(F5)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 3000, USER1 = 2000, USER2 = 1000, USER3 = 500, USER4 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 8000, USER2 = 7000, USER3 = 6000, USER4 = 5000, USER5 = 4000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 400, USER1 = 350 + 300 + 250 + 200 = 1100, USER2 = 300 + 250 + 200, USER3 = 250 + 200, USER4 = 200
            //************************** STEP 6  **************************//
            await staking.connect(user6).stake(
                [51, 52, 53, 54, 55, 56, 57, 58, 59, 60], //list NFT ID
                24, //only valid period is 24 months
                1005, //refcode of user4
                ethers.utils.formatBytes32String("step6")
            );
            //check ref after stake
            getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(user6.address);
            expect(getRefAddress).to.equal(user5.address);
            //check balance token after stake
            // now systemWallet is Ref6
            balanceRef6 = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceRef6).to.equal("400000000000000000000"); //800 * 10^18
            // now user1 is Ref5
            balanceRef5 = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceRef5).to.equal("1400000000000000000000"); //1400 * 10^18
            // now user2 is Ref4
            balanceRef4 = await aicToken.connect(deployer).balanceOf(user2.address);
            expect(balanceRef4).to.equal("900000000000000000000"); //900 * 10^18
            // now user3 is Ref3
            balanceRef3 = await aicToken.connect(deployer).balanceOf(user3.address);
            expect(balanceRef3).to.equal("600000000000000000000"); //600 * 10^18
            // now user4 is Ref2
            balanceRef2 = await aicToken.connect(deployer).balanceOf(user4.address);
            expect(balanceRef2).to.equal("350000000000000000000"); //350 * 10^18
            // now user5 is Ref1
            balanceRef1 = await aicToken.connect(deployer).balanceOf(user5.address);
            expect(balanceRef1).to.equal("150000000000000000000"); //150 * 10^18
            // explain: total stake 10 NFT ID = 5 (price=300) <=> 3000 USDT to stake contract
            // commisson ref 6 for systemWallet, no commission
            // commisson ref 5 for user1 = 1% => 3000 * 1% = 30 USDT = 300 token * decimal = 18
            // commisson ref 4 for user2 = 0.5% => 3000 * 0.5% = 15 USDT = 150 token * decimal = 18
            // commisson ref 3 for user3 = 0.5% => 3000 * 0.5% = 15 USDT = 150 token * decimal = 18
            // commisson ref 2 for user4 = 0.5% => 3000 * 0.5% = 15 USDT = 150 token * decimal = 18
            // commisson ref 1 for user5 = 0.5% => 3000 * 0.5% = 15 USDT = 150 token * decimal = 18
            //=========> SYSTEM WALLET => USER1(F1) => USER2(F2) => USER3(F3) => USER4(F4) => USER5(F5) => USER6(F6)
            //=========> CONDITION COMMISSION: SYSTEM WALLET = 3500, USER1 = 3000, USER2 = 2000, USER3 = 1000, USER4 = 1000, USER5 =500, USER6 = 0
            //=========> BALANCE STAKED USD: SYSTEM WALLET = 0, USER1 = 8000, USER2 = 7000, USER3 = 6000, USER4 = 5000, USER5 = 4000, USER6 = 3000
            //=========> BALANCE TOKEN NOW: SYSTEM WALLET = 400, USER1 = 350 + 300 + 250 + 200 + 300 = 1400, USER2 = 300 + 250 + 200 + 150 = 900, USER3 = 250 + 200 + 150 = 600, USER4 = 200 + 150, USER5 = 150
        });
    });

    describe.skip("#unstake", async function () {
        it("should unstake success", async function () {
            let balanceNFT;
            //************************** STEP 1  **************************//
            //test ref is systemWallet. The commission amount should transfer to systemWallet
            await staking.connect(user1).stake(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            balanceNFT = await aicNFT.connect(user1).balanceOf(user1.address);
            expect(balanceNFT).to.equal(0);
            await mine(24 * 30 * 24 * 3600); //jump to 24 months later
            await staking.connect(user1).unstake(
                1, //STAKE ID
                ethers.utils.formatBytes32String("step1")
            );
            balanceNFT = await aicNFT.connect(user1).balanceOf(user1.address);
            expect(balanceNFT).to.equal(10);
        });

        it("should revert cause by: Still in stake period", async function () {
            //************************** STEP 1  **************************//
            //test ref is systemWallet. The commission amount should transfer to systemWallet
            await staking.connect(user1).stake(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("stake")
            );
            await expect(
                staking.connect(user1).unstake(
                    1, //STAKE ID
                    ethers.utils.formatBytes32String("unstake")
                )
            ).to.be.revertedWith("STAKING: STILL IN STAKING PERIOD");
        });

        it("should revert cause by: Not owner of NFT staked", async function () {
            //************************** STEP 1  **************************//
            //test ref is systemWallet. The commission amount should transfer to systemWallet
            await staking.connect(user1).stake(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("stake")
            );
            await mine(24 * 30 * 24 * 3600); //jump to 24 months later
            await expect(
                staking.connect(user1).unstake(
                    2, //STAKE ID
                    ethers.utils.formatBytes32String("unstake")
                )
            ).to.be.revertedWith("STAKING: NOT OWNER OF NFT STAKED");

            await expect(
                staking.connect(user2).unstake(
                    1, //STAKE ID
                    ethers.utils.formatBytes32String("unstake")
                )
            ).to.be.revertedWith("STAKING: NOT OWNER OF NFT STAKED");

            await expect(
                staking.connect(user1).unstake(
                    1, //STAKE ID
                    ethers.utils.formatBytes32String("unstake")
                )
            );
        });
    });

    describe.skip("#claim", async function () {
        let balanceUser1;
        it("should claim success", async function () {
            //************************** STEP 1  **************************//
            await staking.connect(user1).stake(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            await mine(12 * 30 * 24 * 3600 - 1); //jump to 12 months later
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal(0);
            await staking.connect(user1).claim(1); //STAKE ID
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal("640000000000000000000");
            await mine(12 * 30 * 24 * 3600 - 1); //jump to 12 months later
            await staking.connect(user1).claim(1); //STAKE ID
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal("1280000000000000000000");
            //explain: stake 10 NFT ID = 1, price = 800 => total stake 8000 USDT
            // APY = 8% => reward after 24 month = 8000 * 8% * 2 = 1280 USDT = 12800 token
            await staking.connect(user1).unstake(
                1, //STAKE ID
                ethers.utils.formatBytes32String("unstake")
            );
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal("1280000000000000000000");
        });

        it("should claimAll success", async function () {
            //************************** STEP 1  **************************//
            await staking.connect(user1).stake(
                [1, 2, 3, 4, 5], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );

            await staking.connect(user1).stake(
                [6, 7, 8, 9, 10], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            await mine(12 * 30 * 24 * 3600 - 1); //jump to 12 months later
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal(0);
            await staking.connect(user1).claimAll([1, 2]); //LIST STAKE ID
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal("640000010288065843620");
            await mine(24 * 30 * 24 * 3600 - 1); //jump to 12 months later
            await staking.connect(user1).claimAll([1]); //LIST STAKE ID
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal("960000000000000000000");
            //explain: stake 10 NFT ID = 1, price = 800 => total stake 8000 USDT
            // APY = 8% => reward after 24 month = 8000 * 8% * 2 = 1280 USDT = 12800 token
            await staking.connect(user1).unstake(
                1, //STAKE ID
                ethers.utils.formatBytes32String("unstake")
            );
            await staking.connect(user1).unstake(
                2, //STAKE ID
                ethers.utils.formatBytes32String("unstake")
            );
            balanceUser1 = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUser1).to.equal("1280000000000000000000");
        });
    });

    describe.skip("#depositToken", function () {
        it("should deposit success", async function () {
            //deposit token to marketplace
            await aicToken.connect(deployer).approve(staking.address, "100000000000000000000000");
            await staking.connect(deployer).depositToken("100000000000000000000000");
            let balanceStaking = await aicToken.connect(deployer).balanceOf(staking.address);
            expect(balanceStaking).to.equal("1100000000000000000000000");
        });
    });

    describe.skip("#withdrawToken", function () {
        it("should revert cause by not enough balance", async function () {
            //deposit token to marketplace
            await expect(
                staking.connect(deployer).withdrawTokenEmergency("100000000000000000000000000")
            ).to.be.revertedWith("STAKING: TOKEN BALANCE NOT ENOUGH");
        });

        it("should withdraw success", async function () {
            //deposit token to marketplace
            await staking.connect(deployer).withdrawTokenEmergency("1000000000000000000000000");
            let balanceStaking = await aicToken.connect(deployer).balanceOf(staking.address);
            expect(balanceStaking).to.equal("0");
        });
    });

    describe.skip("#withdrawCurrency", function () {
        it("should revert cause by not enough balance", async function () {
            await expect(
                staking
                    .connect(deployer)
                    .withdrawCurrencyEmergency(usdt.address, "100000000000000000000000000")
            ).to.be.revertedWith("STAKING: CURRENCY BALANCE NOT ENOUGH");
        });

        it("should withdraw success", async function () {
            await usdt.connect(deployer).transfer(staking.address, "100000000000000000000000");
            await staking
                .connect(deployer)
                .withdrawCurrencyEmergency(usdt.address, "100000000000000000000000");
            let balanceStaking = await usdt.connect(deployer).balanceOf(staking.address);
            expect(balanceStaking).to.equal("0");
        });
    });

    describe.skip("#forNetworkStats", function () {
        it("should return TotalCrewInvesment exactly", async function () {
            await staking.connect(user1).stake(
                [1, 2, 3], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let totalCrewInvesment = await staking.getTotalCrewInvesment(systemWallet);
            expect(totalCrewInvesment).to.equal(2400); // 3 NFT Tier 1 =  3 * 800 = 2.400
            await staking.connect(user1).stake(
                [4, 5, 6], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            totalCrewInvesment = await staking.getTotalCrewInvesment(systemWallet);
            expect(totalCrewInvesment).to.equal(4800); // 3 NFT Tier 1 =  3 * 800 = 2.400
            await staking.connect(user2).stake(
                [11, 12, 13], //list NFT ID
                24, //only valid period is 24 months
                1001, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            totalCrewInvesment = await staking.getTotalCrewInvesment(systemWallet);
            expect(totalCrewInvesment).to.equal(6900); // 3 NFT Tier 2 =  3 * 700 = 2.100
        });

        it("should return TeamStakingValue exactly", async function () {
            await staking.connect(user1).stake(
                [1], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("user1")
            );
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let totalCrewInvesment = await staking.getTeamStakingValue(systemWallet);
            expect(totalCrewInvesment).to.equal(800); // 1 NFT Tier 1 =  800$
            await staking.connect(user2).stake(
                [11], //list NFT ID
                24, //only valid period is 24 months
                1001, //refcode of user1
                ethers.utils.formatBytes32String("user2")
            );
            let refCode = await marketplace.getReferralAccountForAccount(user2.address);
            expect(refCode).to.equal(user1.address);
            totalCrewInvesment = await staking.getTeamStakingValue(systemWallet);
            expect(totalCrewInvesment).to.equal(1500); // 800+700
            await staking.connect(user3).stake(
                [21], //list NFT ID
                24, //only valid period is 24 months
                1002, ////refcode of user2
                ethers.utils.formatBytes32String("user3")
            );
            refCode = await marketplace.getReferralAccountForAccount(user3.address);
            expect(refCode).to.equal(user2.address);
            totalCrewInvesment = await staking.getTeamStakingValue(systemWallet);
            expect(totalCrewInvesment).to.equal(2100); // 800+700+600
            await staking.connect(user4).stake(
                [31], //list NFT ID
                24, //only valid period is 24 months
                1003, ////refcode of user3
                ethers.utils.formatBytes32String("user4")
            );
            refCode = await marketplace.getReferralAccountForAccount(user4.address);
            expect(refCode).to.equal(user3.address);
            totalCrewInvesment = await staking.getTeamStakingValue(systemWallet);
            expect(totalCrewInvesment).to.equal(2600); // 800+700+600+500
            let checkRefSystem = await marketplace.getReferralAccountForAccountExternal(
                systemWallet
            );
            expect(checkRefSystem).to.equal("0x0000000000000000000000000000000000000000");
        });

        it("should return ComissionEarned exactly", async function () {
            await staking.connect(user1).stake(
                [1, 2, 3], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("user1")
            );
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let totalCrewInvesment = await staking.getStakingCommissionEarned(systemWallet);
            expect(totalCrewInvesment).to.equal(12); // 1 NFT Tier 1 =  3 * 800$ * 0.5% = 12$
            await staking.connect(user2).stake(
                [11], //list NFT ID
                24, //only valid period is 24 months
                1001, //refcode of user1
                ethers.utils.formatBytes32String("user2")
            );
            let refCode = await marketplace.getReferralAccountForAccount(user2.address);
            expect(refCode).to.equal(user1.address);
            totalCrewInvesment = await staking.getStakingCommissionEarned(user1.address);
            expect(totalCrewInvesment).to.equal(3); // 700$ * 0.5% = 3.5$
            await staking.connect(user3).stake(
                [21], //list NFT ID
                24, //only valid period is 24 months
                1002, ////refcode of user2
                ethers.utils.formatBytes32String("user3")
            );
            refCode = await marketplace.getReferralAccountForAccount(user3.address);
            expect(refCode).to.equal(user2.address);
            totalCrewInvesment = await staking.getStakingCommissionEarned(user1.address);
            expect(totalCrewInvesment).to.equal(6); // (700$ + 600$) * 0.5% = 6.5$
            await staking.connect(user4).stake(
                [31], //list NFT ID
                24, //only valid period is 24 months
                1003, ////refcode of user3
                ethers.utils.formatBytes32String("user4")
            );
            refCode = await marketplace.getReferralAccountForAccount(user4.address);
            expect(refCode).to.equal(user3.address);
            totalCrewInvesment = await staking.getStakingCommissionEarned(user1.address);
            expect(totalCrewInvesment).to.equal(9); // (700$ + 600$ + 500$) * 0.5% = 9$
        });
    });

    describe("#get commission percent by rule", function () {
        it("should get commission percent by rule success", async function () {
            //prepare token
            await aicToken.connect(deployer).transfer(
                marketplace.address,
                "16000000000000000000000" //16k token
            );
            await aicToken.connect(deployer).transfer(
                user1.address,
                "16000000000000000000000" //160.000 token
            );
            await aicToken.connect(deployer).transfer(
                user2.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user3.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user4.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user5.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user6.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user7.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user8.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user9.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user10.address,
                "16000000000000000000000" //100k token
            );
            await aicToken.connect(deployer).transfer(
                user11.address,
                "16000000000000000000000" //100k token
            );
            //prepare NFT
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_GODDESS, process.env.URI_GODDESS],
                1, //tier
                deployer.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_GODDESS, process.env.URI_GODDESS],
                1, //tier
                user1.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_GODDESS, process.env.URI_GODDESS],
                1, //tier
                user2.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_GODDESS, process.env.URI_GODDESS],
                1, //tier
                user3.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_GODDESS, process.env.URI_GODDESS],
                1, //tier
                user4.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user5.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user6.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user7.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user8.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user9.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user10.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [process.env.URI_DEVIL, process.env.URI_DEVIL],
                2, //tier
                user11.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                    process.env.URI_GODDESS,
                ],
                1, //tier Goddess
                marketplace.address //to
            );
            await aicNFT.connect(deployer).batchMintTo(
                [
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                    process.env.URI_DEVIL,
                ],
                2, //tier Demon
                marketplace.address //to
            );
            // then appprove for contract
            await aicToken
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user1)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user2)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user3)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user4)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user5)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user6)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user7)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user8)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user9)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user10)
                .approve(marketplace.address, "100000000000000000000000000000");
            await aicToken
                .connect(user11)
                .approve(marketplace.address, "100000000000000000000000000000");

            await aicNFT.connect(deployer).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user1).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user2).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user3).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user4).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user5).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user6).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user7).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user8).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user9).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user10).setApprovalForAll(staking.address, true);
            await aicNFT.connect(user11).setApprovalForAll(staking.address, true);

            await staking.connect(deployer).stake(
                [71, 72], //list NFT ID
                24, //only valid period is 24 months
                1000, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user1).stake(
                [73, 74], //NFT ID
                24, //only valid period is 24 months
                1001, //ref code
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user2).stake(
                [75, 76], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user3).stake(
                [77, 78], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user4).stake(
                [79, 80], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user5).stake(
                [81, 82], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user6).stake(
                [83, 84], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of systemWallet
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user7).stake(
                [85, 86], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user8).stake(
                [87, 88], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user9).stake(
                [89, 90], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user10).stake(
                [91, 92], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );
            await staking.connect(user11).stake(
                [93, 94], //list NFT ID
                24, //only valid period is 24 months
                1002, //refcode of user1
                ethers.utils.formatBytes32String("step1")
            );

            let balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("16730000000000000000000");

            await marketplace.connect(deployer).buyByToken(
                [115, 116], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(user1).buyByToken(
                [117, 118], //NFT ID
                1001 //ref code(1000=system refcode)
            );

            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("2730000000000000000000");

            await marketplace.connect(user2).buyByToken(
                [95, 96], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            //user1 has total 16.730 token. After buy then balance = 2730
            //user1 has 8 F1 stake > 1000$ => countF1Meaning = 8
            //user2 buy 1600$ with refCode => user1 has 6% * 1600 = 96$ = 960 token
            // => total balance = 2730 + 960 = 1530
            expect(balanceUser1Now).to.be.equal("3690000000000000000000");

            await marketplace.connect(user3).buyByToken(
                [97, 98], //NFT ID
                1002 //ref code user1
            );
            //user3 buy 1600$ with refCode => user1 has 6% * 1600 = 96$ = 960 token
            // => total balance = 960 + 3690 = 4650
            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("4650000000000000000000");

            await marketplace.connect(user4).buyByToken(
                [99, 100], //NFT ID
                1002 //ref code user1
            );
            await marketplace.connect(user5).buyByToken(
                [101, 102], //NFT ID
                1002 //ref code user1
            );

            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("6570000000000000000000");

            await marketplace.connect(user6).buyByToken(
                [103, 104], //NFT ID
                1002 //ref code user1
            );
            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("7530000000000000000000");
            await marketplace.connect(user7).buyByToken(
                [105, 106], //NFT ID
                1002 //ref code user1
            );
            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("8370000000000000000000");
            await marketplace.connect(user8).buyByToken(
                [107, 108], //NFT ID
                1002 //ref code user1
            );
            await marketplace.connect(user9).buyByToken(
                [109, 110], //NFT ID
                1002 //ref code user1
            );
            await marketplace.connect(user10).buyByToken(
                [111, 112], //NFT ID
                1002 //ref code user1
            );
            await marketplace.connect(user11).buyByToken(
                [113, 114], //NFT ID
                1002 //ref code user1
            );

            //user4 buy 1600$ with refCode => user1 has 6% * 1600 = 96$ + 192$ = 288$
            //user5 buy 1400$ with refCode => user1 has 6% * 1600 = 96$ + 288$ = 384$ => total 3840 + 2730 = 6570 token
            //user6 buy 1400$ with refCode => user1 has 6% * 1600 = 96$ => 960 + 6570 = 7530
            //user7 buy 1400$ with refCode => user1 has 6% * 1400 = 84$
            //user8 buy 1400$ with refCode => user1 has 6% * 1400 = 84$
            //user9 buy 1400$ with refCode => user1 has 6% * 1400 = 84$
            //user10 buy 1400$ with refCode => user1 has 6% * 1400 = 84$
            //user11 buy 1400$ with refCode => user1 has 6% * 1400 = 84$ *5 + 753$ = 7680 token + 2730 token = 11.730 token
            balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("11730000000000000000000");
        });
    });
});
