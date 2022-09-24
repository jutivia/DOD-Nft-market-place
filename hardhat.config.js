require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  unused configuration commented out for now
    //  mumbai: {
    //    url: "https://rpc-mumbai.maticvigil.com",
    //    accounts: [process.env.privateKey]
    //  }
    polygon: {
        url: process.env.POLYGON_URL,
        accounts: [process.env.SECRET],
        blockGasLimit: 200000000000,
        gasPrice: 10000000000,
        timeout: 90000,
      },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
