require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/U-Xg27wJ2EejQHUDNxbj0v7Ico4BCigJ',
      accounts: ['26b643b983eba39229e3e27be807d3e82e8d9d29665cb723f3c0fcda2c45be25']
    }
  }
};
