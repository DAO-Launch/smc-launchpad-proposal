const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");

describe("Marketplace Testing", async function () {
    let deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, attacker;
    let aicToken, aicNFT, oracle, usdt, marketplace;

    beforeEach(async function () {
        [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, attacker] =
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
        //****************============DEPLOY MARKETPLACE============****************//
        const Marketplace = await ethers.getContractFactory("Marketplace", deployer);
        marketplace = await Marketplace.deploy(
            aicNFT.address,
            aicToken.address,
            oracle.address,
            "0xb5422FBF3Fe4a144838F13dD0100c32A6497C222",
            "0x55d398326f99059fF775485246999027B3197955"
        );
        //****************============TOKEN + NFT + USDT TRANSFERING TO MARKETPLACE============****************//
        await usdt.connect(deployer).transfer(
            marketplace.address,
            "100000000000000000000000" //100k token
        );
        // Transfer TOKEN ACIR
        await aicToken.connect(deployer).transfer(
            marketplace.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user1.address,
            "16000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user2.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user3.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user4.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user5.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user6.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user7.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user8.address,
            "100000000000000000000000" //100k token
        );
        await aicToken.connect(deployer).transfer(
            user9.address,
            "100000000000000000000000" //100k token
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
            1, //tier
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
            ],
            2, //tier
            marketplace.address //to
        );
    });

    describe.skip("#setDiscountPercent", async function () {
        it("should set discount percent for sell", async function () {
            await marketplace.connect(deployer).setDiscountPercent(30);
            const discount = await marketplace.discount();
            expect(discount).to.equal(30);
        });
    });

    describe.skip("#setCommissionPercent", async function () {
        it("should set commission percent for ref", async function () {
            let commission = await marketplace.commissionBuyPercent();
            expect(commission).to.equal(3);
            await marketplace.connect(deployer).setCommissionPercent(5);
            commission = await marketplace.commissionBuyPercent();
            expect(commission).to.equal(5);
        });
    });

    describe.skip("#setSystemWallet", async function () {
        it("should set system wallet", async function () {
            let wallet = await marketplace.systemWallet();
            expect(wallet).to.equal("0xb5422FBF3Fe4a144838F13dD0100c32A6497C222");
            await marketplace
                .connect(deployer)
                .setSystemWallet("0xa3cE26dA4B6C947396d97dc65Dc611f5cb9643A0");
            wallet = await marketplace.systemWallet();
            expect(wallet).to.equal("0xa3cE26dA4B6C947396d97dc65Dc611f5cb9643A0");
        });
    });

    describe.skip("#getReferralCodeForAccount", async function () {
        it("should get ref-address and address-ref success", async function () {
            let wallet = await marketplace.connect(deployer).systemWallet();
            let refCodeSystem = await marketplace
                .connect(deployer)
                .getReferralCodeForAccount(wallet);
            expect(refCodeSystem).to.equal(1000);

            let refSystemAddress = await marketplace
                .connect(deployer)
                .getAccountForReferralCode(refCodeSystem);
            expect(refSystemAddress).to.equal(wallet);

            let refCodeAny = await marketplace
                .connect(deployer)
                .getReferralCodeForAccount(deployer.address);
            expect(refCodeAny).to.equal(0);
        });
    });

    describe.skip("#updateReferralData", async function () {
        it("should increase referral counter", async function () {
            //counter before update
            let counterBefore = await marketplace.connect(deployer).currrentReferralCounter();
            expect(counterBefore).to.equal(1000);
            //update ref for system
            await marketplace.connect(deployer).updateReferralData(deployer.address, 1);
            //counter after update
            let counterAfter = await marketplace.connect(deployer).currrentReferralCounter();
            expect(counterAfter).to.equal(1001);
        });

        it("should update ref data success", async function () {
            //update ref for system
            await marketplace.connect(deployer).updateReferralData(deployer.address, 1000);
            //then ref of deployer now is system wallet
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(deployer.address);
            expect(getRefAddress).to.equal("0xb5422FBF3Fe4a144838F13dD0100c32A6497C222");
            //get refcode of deployer now then 2
            let getRefId = await marketplace
                .connect(deployer)
                .getReferralCodeForAccount(deployer.address);
            expect(getRefId).to.equal(1001);
        });
    });

    describe("#buyByCurrency", function () {
        it("should buyByCurrency success", async function () {
            //first need to set currency is aicToken
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await usdt
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            let balanceUsdMarketplace = await usdt.connect(deployer).balanceOf(marketplace.address);
            expect(balanceUsdMarketplace).to.equal("100000000000000000000000"); //100k USDT
            let balanceSaleWallet = await usdt
                .connect(deployer)
                .balanceOf("0xe3C6c3b651348aC36B138AEeAcFdfCB6962BF906");
            expect(balanceSaleWallet).to.equal("0"); //4500 * 10^18
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(deployer).buyByCurrency(
                [11, 12, 13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            //check code ref
            codeRef = await marketplace
                .connect(deployer)
                .getReferralCodeForAccount(deployer.address);
            expect(codeRef).to.be.equal(100000);
            //check after buy
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(deployer.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance usdt for contract
            balanceNFTMarketplace = await aicNFT.connect(deployer).balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(14); //20 - 6(BUY) = 14
            //check balance usdt for contract
            balanceSaleWallet = await usdt
                .connect(deployer)
                .balanceOf("0xe3C6c3b651348aC36B138AEeAcFdfCB6962BF906");
            expect(balanceSaleWallet).to.equal("3825000000000000000000"); //3825 * 10^18
            //check balance token as commission for ref(systemWallet)
            balanceUsdMarketplace = await usdt.connect(deployer).balanceOf(marketplace.address);
            expect(balanceUsdMarketplace).to.equal("99865000000000000000000"); //100k USDT
            let balanceSystemWallet = await usdt.connect(deployer).balanceOf(systemWallet);
            expect(balanceSystemWallet).to.equal("135000000000000000000");
            //explain: total buy 3 NFT Tier 1(price=800) + 3 NFT Tier 2(price=700) => pay 3*800 + 3*700 =4.500 USDT to marketplace
            //sale 15% => 4500 * 85% = 3825 USD
            //commisson: 4500 * 3% = 135 USDT => 100.000-135=99.865
        });
    });

    describe.skip("#buyByToken", function () {
        it("should buyByToken success", async function () {
            //first need to set currency is aicToken
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await aicToken
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await aicToken
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            let balanceSaleWallet = await usdt
                .connect(deployer)
                .balanceOf("0x5D474975f6811067da8c634832c92362512E2886");
            expect(balanceSaleWallet).to.equal("0"); //0 * 10^18
            // await expect(marketplace.connect(deployer).buyByToken(
            //     [1, 2, 3, 11, 12, 13], //NFT ID
            //     1000 //ref code(1000=system refcode)
            // )).to.be.revertedWith("MARKETPLACE: ONLY ACCEPT PAYMENT IN CURRENCY");
            //await marketplace.connect(deployer).allowBuyNftByCurrency(true);
            await marketplace.connect(deployer).buyByToken(
                [1, 2, 3, 11, 12, 13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            //check after buy
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(deployer.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance usdt for contract
            balanceNFTMarketplace = await aicNFT.connect(deployer).balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(14); //20 - 6(BUY) = 14
            //check balance usdt for contract
            balanceSaleWallet = await aicToken
                .connect(deployer)
                .balanceOf("0x5D474975f6811067da8c634832c92362512E2886");
            expect(balanceSaleWallet).to.equal("45000000000000000000000"); //143.650 * 10^18
            //check balance token as commission for ref(systemWallet)
            let balanceSystemWallet = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceSystemWallet).to.equal("1350000000000000000000");
            //explain: total buy 3 NFT Tier 1(price=800) + 3 NFT Tier 2(price=700) => pay 3*800 + 3*700 =4.500 USDT <=> 45.000 token to marketplace
            //total deposit before buy 100.000 token, so user pay more 45.000 to buy NFT
            //then pay commission in token total 1.350 token => balance = 100.000 + 45.000 - 1.350 = 143.650
            //commisson: 4500 * 3% = 135 USDT = 1350 token
        });
    });

    describe.skip("#sell", function () {
        it("should sell success", async function () {
            //mint NFT to seller to testing
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
                1, //tier
                user1.address //to
            );
            let balanceDeployer = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceDeployer).to.equal("16000000000000000000000");
            let balanceMarketplace = await aicToken.connect(user1).balanceOf(marketplace.address);
            expect(balanceMarketplace).to.equal("100000000000000000000000"); //100.000 token
            //first need to set currency is aicToken
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            //approve first
            await aicNFT.connect(user1).setApprovalForAll(marketplace.address, true);
            let checkAllowance = await aicNFT
                .connect(user1)
                .isApprovedForAll(user1.address, marketplace.address);
            expect(checkAllowance).to.equal(true);
            //check balance NFT before sell
            let balanceNFTMarketplace = await aicNFT.connect(user1).balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20);
            //sell
            await marketplace.connect(user1).sell(
                [21, 22, 23] //list NFT sell
            );
            //check after sell
            balanceUsdtSeller = await aicToken.connect(user1).balanceOf(user1.address);
            expect(balanceUsdtSeller).to.equal("32800000000000000000000");
            balanceUsdtMarketplace = await aicToken.connect(user1).balanceOf(marketplace.address);
            expect(balanceUsdtMarketplace).to.equal("83200000000000000000000");
            //check balance nft for marketplace & seller
            let balanceNftSeller = await aicNFT.connect(user1).balanceOf(user1.address);
            expect(balanceNftSeller).to.equal(7);
            let balanceNftMarketplace = await aicNFT.connect(user1).balanceOf(marketplace.address);
            expect(balanceNftMarketplace).to.equal(23);
            //explain: sell has sold 3 NFT tier 1 = 3*800 = 2.400 USDT
            //discount 30% => sell will receive 2.400 * 70% = 1680 USDT => 16.800 token
            //balance token marketplace = 100.000 - 16.800 = 83.200 token
        });
    });

    describe.skip("#depositToken", function () {
        it("should deposit success", async function () {
            //deposit token to marketplace
            await aicToken
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000");
            await marketplace.connect(deployer).depositToken("100000000000000000000000");
            let balanceMarketplace = await aicToken
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceMarketplace).to.equal("200000000000000000000000");
        });
    });

    describe.skip("#withdrawToken", function () {
        it("should revert cause by not enough balance", async function () {
            //deposit token to marketplace
            await expect(
                marketplace.connect(deployer).withdrawTokenEmergency("90000000000000000000000000")
            ).to.be.revertedWith("MARKETPLACE: TOKEN BALANCE NOT ENOUGH");
        });

        it("should withdraw success", async function () {
            //deposit token to marketplace
            await marketplace.connect(deployer).withdrawTokenEmergency("100000000000000000000000");
            let balanceMarketplace = await aicToken
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceMarketplace).to.equal("0");
        });
    });

    describe.skip("#withdrawCurrency", function () {
        it("should revert cause by not enough balance", async function () {
            await expect(
                marketplace
                    .connect(deployer)
                    .withdrawCurrencyEmergency(usdt.address, "10000000000000000000000")
            ).to.be.revertedWith("MARKETPLACE: CURRENCY BALANCE NOT ENOUGH");
        });

        it("should withdraw success", async function () {
            await usdt.connect(deployer).transfer(marketplace.address, "1000000000000000000000");
            await marketplace
                .connect(deployer)
                .withdrawCurrencyEmergency(usdt.address, "1000000000000000000000");
            let balanceMarketplace = await usdt.connect(deployer).balanceOf(marketplace.address);
            expect(balanceMarketplace).to.equal("0");
        });
    });

    describe.skip("#getActiveMemberForAccount", function () {
        it("should getActiveMemberForAccount exactly", async function () {
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await usdt
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3, 11], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(deployer).buyByCurrency(
                [12], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(deployer).buyByCurrency(
                [13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(deployer).buyByCurrency(
                [14, 15], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await aicToken
                .connect(user2)
                .approve(marketplace.address, "100000000000000000000000000000");
            await marketplace.connect(user2).buyByToken(
                [16, 17], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let totalActiveMember = await marketplace
                .connect(user1)
                .getActiveMemberForAccount(systemWallet);
            expect(totalActiveMember).to.equal(2);
        });
    });

    describe.skip("#getReferredNftValueForAccount", function () {
        it("should getReferredNftValueForAccount exactly", async function () {
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await usdt
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3, 11, 12, 13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(deployer).buyByCurrency(
                [14, 15], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await aicToken
                .connect(user2)
                .approve(marketplace.address, "100000000000000000000000000000");
            await marketplace.connect(user2).buyByToken(
                [16, 17], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let totalActiveMember = await marketplace
                .connect(user1)
                .getReferredNftValueForAccount(systemWallet);
            expect(totalActiveMember).to.equal("7300");
            //explain: total buy 10 NFT: 3 Tier 1 = 3 * 800 = 2.400 USDT
            //7 Tier 2 = 7 * 700 = 4.900 USDT
            //so ReferredNftValue = 7.300 USDT
        });
    });

    describe.skip("#getNftCommissionEarnedForAccount", function () {
        it("should getNftCommissionEarnedForAccount exactly", async function () {
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await usdt
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3, 11, 12, 13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(deployer).buyByCurrency(
                [14, 15], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await aicToken
                .connect(user2)
                .approve(marketplace.address, "100000000000000000000000000000");
            await marketplace.connect(user2).buyByToken(
                [16, 17], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let totalActiveMember = await marketplace
                .connect(user1)
                .getNftCommissionEarnedForAccount(systemWallet);
            expect(totalActiveMember).to.equal("219");
            //explain: total buy 10 NFT: 3 Tier 1 = 3 * 800 = 2.400 USDT
            //7 Tier 2 = 7 * 700 = 4.900 USDT
            //so ReferredNftValue = 7.300 USDT
            //commission = 3% => 7.300 * 3% = 219 USDT
        });
    });

    describe.skip("#tranferNft", function () {
        it("should tranferNft exactly", async function () {
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT

            await expect(
                marketplace.connect(attacker).tranferNftEmergency(
                    user1.address,
                    1 //NFT ID
                )
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await marketplace.connect(deployer).tranferNftEmergency(
                user1.address,
                1 //NFT ID
            );

            let checkOwner = await aicNFT.connect(deployer).ownerOf(12);
            expect(checkOwner).to.equal(marketplace.address);

            await marketplace.connect(deployer).tranferMultiNftsEmergency(
                [user1.address, user2.address, user3.address],
                [11, 12, 13] //list NFT ID
            );
            balanceNFTMarketplace = await aicNFT.connect(deployer).balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(16); //total 20 NFT

            checkOwner = await aicNFT.connect(deployer).ownerOf(12);
            expect(checkOwner).to.equal(user2.address);
        });
    });

    describe.skip("#cheat detecter", function () {
        it("should revert if cheat ref", async function () {
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await usdt
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3], //NFT ID
                1000 //ref code
            );
            // APPROVE ==============
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

            /////BUY
            await marketplace.connect(user1).buyByToken(
                [11, 12], //NFT ID
                1001 //ref code user deployer
            );

            await marketplace.connect(user2).genReferralCodeForAccount();
            let refUser2 = await marketplace
                .connect(user2)
                .getReferralCodeForAccount(user2.address);
            expect(refUser2).to.equal(1003);

            await marketplace.connect(user3).genReferralCodeForAccount();
            let refUser3 = await marketplace
                .connect(user3)
                .getReferralCodeForAccount(user3.address);
            expect(refUser3).to.equal(1004);

            await marketplace.connect(user4).genReferralCodeForAccount();
            let refUser4 = await marketplace
                .connect(user4)
                .getReferralCodeForAccount(user4.address);
            expect(refUser4).to.equal(1005);

            await expect(
                marketplace.connect(user2).buyByToken(
                    [13, 14], //NFT ID
                    1003 //ref code user 2
                )
            ).to.be.revertedWith("MARKETPLACE: CANNOT REF TO YOURSELF");

            await marketplace.connect(user2).buyByToken(
                [15, 16], //NFT ID
                1004 //ref code user 3
            );

            await expect(
                marketplace.connect(user3).buyByToken(
                    [17], //NFT ID
                    1003 //ref code user 2
                )
            ).to.be.revertedWith("MARKETPLACE: CHEAT REF DETECTED");

            let refAccUser2 = await marketplace
                .connect(user2)
                .getReferralAccountForAccount(user2.address);
            expect(refAccUser2).to.equal(user3.address);
            // let refAccUser3 = await marketplace.connect(user3).getReferralAccountForAccount(user3.address);
            // expect(refAccUser3).to.equal(user2.address);
            //system <= deployer <= user1 |  user2 <= user3 <= user2
            //1000      - 1001   -  1002  -  1003 -   1004  -  1003
        });
    });

    describe.skip("#get team nft sale value", function () {
        it("should revert if cheat ref", async function () {
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3], //NFT ID
                1000 //ref code
            );
            // APPROVE ==============
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

            /////BUY
            await marketplace.connect(user1).buyByToken(
                [11, 12], //NFT ID
                1001 //ref code user deployer
            );

            await marketplace.connect(user2).buyByToken(
                [13, 14], //NFT ID
                1002 //ref code user1
            );

            await marketplace.connect(user3).buyByToken(
                [15, 16], //NFT ID
                1003 //ref code user2
            );

            await marketplace.connect(user4).buyByToken(
                [17, 18], //NFT ID
                1004 //ref code user1
            );

            let f1Count_user1 = await marketplace.connect(user1).getF1ListForAccount(user1.address);
            expect(f1Count_user1.length).to.be.equals(1);

            let f1Count_user2 = await marketplace.connect(user2).getF1ListForAccount(user2.address);
            expect(f1Count_user2.length).to.be.equals(1);

            let f1Count_user3 = await marketplace.connect(user3).getF1ListForAccount(user3.address);
            expect(f1Count_user3.length).to.be.equals(1);

            let f1Count_user4 = await marketplace.connect(user4).getF1ListForAccount(user4.address);
            expect(f1Count_user4.length).to.be.equals(0);

            let f1Count_deployer = await marketplace
                .connect(deployer)
                .getF1ListForAccount(deployer.address);
            expect(f1Count_deployer.length).to.be.equals(1);

            let teamNftSaleValue = await marketplace
                .connect(user1)
                .getTeamNftSaleValueForAccountInUsdDecimal(deployer.address);
            expect(teamNftSaleValue).to.be.equals("5600000000000000000000");
        });
    });

    describe.skip.skip("#get commission percent by rule", function () {
        it("should get commission percent by rule success", async function () {
            //first need to set currency is aicToken
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
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

            await marketplace.connect(deployer).buyByToken(
                [1, 2], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            await marketplace.connect(user1).buyByToken(
                [3, 4], //NFT ID
                1001 //ref code(1000=system refcode)
            );
            await marketplace.connect(user2).buyByToken(
                [5, 6], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user3).buyByToken(
                [7, 8], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user4).buyByToken(
                [9, 10], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user5).buyByToken(
                [11, 12], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user6).buyByToken(
                [13, 14], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user7).buyByToken(
                [15, 16], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user8).buyByToken(
                [17, 18], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            await marketplace.connect(user9).buyByToken(
                [19, 20], //NFT ID
                1002 //ref code(1000=system refcode)
            );
            //check commission
            //user1 has total 16.000 token. After buy then balance = 0
            //user2 buy 1600$ with refCode => user1 has 3% * 1600 = 48$
            //user3 buy 1600$ with refCode => user1 has 3% * 1600 = 48$ + 48$
            //user4 buy 1600$ with refCode => user1 has 3% * 1600 = 48$ + 48$ + 48$
            //user5 buy 1400$ with refCode => user1 has 3% * 1400 = 42$ + 48$ + 48$ + 48$
            //user6 buy 1400$ with refCode => user1 has 3% * 1400 = 42$ + 42$ + 48$ + 48$ + 48$
            //user7 buy 1400$ with refCode => user1 has 5% * 1400 = 70$ + 42$ + 42$ + 48$ + 48$ + 48$ = 298$
            //user8 buy 1400$ with refCode => user1 has 4% * 1400 = 56$ + 70$ + 42$ + 42$ + 48$ + 48$ + 48$
            //user9 buy 1400$ with refCode => user1 has 4% * 1400 = 56$ + 56$ + 70$ + 42$ + 42$ + 48$ + 48$ + 48$ = 410$ = 4100 token
            let balanceUser1Now = await aicToken.connect(deployer).balanceOf(user1.address);
            expect(balanceUser1Now).to.be.equal("4100000000000000000000");
        });
    });

    describe.skip("#saleMarket", function () {
        it("should set time beginning & ending success", async function () {
            // await marketplace.connect(deployer).setSaleStrategyStart(1679558949);
            await expect(
                marketplace.connect(deployer).setSaleStrategyEnd(1679558909)
            ).to.be.revertedWith("MARKETPLACE: TIME ENDING MUST GREATER THAN TIME BEGINNING");
            await marketplace.connect(deployer).setSaleStrategyEnd(1689557949);
        });

        it("get right sale percent", async function () {
            await marketplace.connect(deployer).setSaleStrategyEnd(1689557949);
            let salePercent = await marketplace.connect(deployer).getCurrentSalePercent();
            expect(salePercent).to.be.equal(150);
        });

        it("get buy by currency success with sale price", async function () {
            await marketplace.connect(deployer).setSaleStrategyEnd(1689557949);
            let salePercent = await marketplace.connect(deployer).getCurrentSalePercent();
            expect(salePercent).to.be.equal(150);

            //first need to set currency is aicToken
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await usdt
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await usdt
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByCurrency(
                [1, 2, 3, 11, 12, 13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            //check after buy
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(deployer.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance usdt for contract
            balanceNFTMarketplace = await aicNFT.connect(deployer).balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(14); //20 - 6(BUY) = 14
            //check balance usdt for contract
            let balanceMarketplace = await usdt.connect(deployer).balanceOf(marketplace.address);
            expect(balanceMarketplace).to.equal("3825000000000000000000"); //4500 * 10^18

            //explain: total buy 3 NFT Tier 1(price=800) + 3 NFT Tier 2(price=700) => pay 3*800 + 3*700 =4500 USDT to marketplace
            //but sale 15% => only 4500*85% = 3825
            //commisson: 4500 * 3% = 135 USDT = 1350 token
        });

        it("get buy by token success with sale price", async function () {
            await marketplace.connect(deployer).setSaleStrategyEnd(1689557949);
            let salePercent = await marketplace.connect(deployer).getCurrentSalePercent();
            expect(salePercent).to.be.equal(150);

            //first need to set currency is aicToken
            await marketplace.connect(deployer).setCurrencyAddress(usdt.address);
            // then appprove for contract
            await aicToken
                .connect(deployer)
                .approve(marketplace.address, "100000000000000000000000000000");
            let checkAllowance = await aicToken
                .connect(deployer)
                .allowance(deployer.address, marketplace.address);
            expect(checkAllowance).to.equal("100000000000000000000000000000");
            //check balance NFT before buy
            let balanceNFTMarketplace = await aicNFT
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(20); //total 20 NFT
            //ref default is systemWallet. The commission amount should transfer to systemWallet
            await marketplace.connect(deployer).buyByToken(
                [1, 2, 3, 11, 12, 13], //NFT ID
                1000 //ref code(1000=system refcode)
            );
            //check after buy
            let systemWallet = await marketplace.connect(user1).systemWallet();
            let getRefAddress = await marketplace
                .connect(deployer)
                .getReferralAccountForAccount(deployer.address);
            expect(getRefAddress).to.equal(systemWallet);
            //check balance usdt for contract
            balanceNFTMarketplace = await aicNFT.connect(deployer).balanceOf(marketplace.address);
            expect(balanceNFTMarketplace).to.equal(14); //20 - 6(BUY) = 14
            //check balance usdt for contract
            let balanceMarketplace = await aicToken
                .connect(deployer)
                .balanceOf(marketplace.address);
            expect(balanceMarketplace).to.equal("136900000000000000000000"); //136.900 * 10^18
            //check balance token as commission for ref(systemWallet)
            let balanceSystemWallet = await aicToken.connect(deployer).balanceOf(systemWallet);
            expect(balanceSystemWallet).to.equal("1350000000000000000000");
            //explain: total buy 3 NFT Tier 1(price=800) + 3 NFT Tier 2(price=700) => pay 3*800 + 3*700 =4.500 USDT <=> 45.000 token to marketplace
            //but sale 15% => only 45.000 * 85% = 38.250 token
            //total deposit before buy 100.000 token, so user pay more 45.000 to buy NFT
            //then pay commission in token total 1.350 token => balance = 100.000 + 38.250 - 1.350 = 136.900
            //commisson: 4500 * 3% = 135 USDT = 1350 token
        });
    });
});
