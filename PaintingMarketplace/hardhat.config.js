// require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
// require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
const ACCOUNT_PRIVATE_KEY =
  "bb7737a297d9a4c4a8475ffe69e6620b0218189aa36d61efe4359bbbc3f05051";

module.exports = {
  solidity: "0.8.17",
  networks: {
    mainnet: {
      url: "https://eth-goerli.g.alchemy.com/v2/srfHaW9Z3kQomIs8eEVHYULywsRzBe_G",
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
};
// 0x5a859c77a98fD547D304686BfA0525c906Eae13C
