# DOD NFT Marketplace
<i>NFT marketplace DApp where users mint ERC721 implemented  DOD NFTs.</i>

### Features
- Mint custom ERC721 implemented DOD Tokens.
- Sell DOD tokens on the marketplace.
- Set desired token price.
- Toggle between keeping the token for sale and not for sale.
- Keeps track of all the tokens owned by an account - minted and bought.
- Query blockchain for token owner.
- User can mint a token only after every 5 minutes.
#
### Stack
- [Solidity](https://docs.soliditylang.org/en/v0.7.6/) - Object-oriented, high-level language for implementing smart contracts.
- [Bootstrap 4](https://getbootstrap.com/) - CSS framework for faster and easier web development.
- [React.js](https://reactjs.org/) - JavaScript library for building user interfaces.
- [web3.js](https://web3js.readthedocs.io/en/v1.3.4/) - Allows users to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.
- [Hardhat](https://hardhat.org/) - Development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM).
- [Ox](https://docs.0x.org/) - Hanldles NFT transfer and payment between buyers and sellers.
#
### Interact with the deployed DApp
- DOD Marketplace DApp requires [Metamask](https://metamask.io/) browser wallet extension to interact with.
- Connect metamask browser wallet to Polygon Test Network (matic).
- Request and get test etheres for the metamask account from [Polygon matic Faucet](https://faucet.polygon.technology/) to make transactions.
- Request and get test USDC for the metamask account from [Filswan Faucet](https://calibration-faucet.filswan.com/#/dashboard) to buy NFTs.
- DOD NFT Marketplace Smart Contract is deployed to polyon Testnet - [0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a](https://mumbai.polygonscan.com/address/0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a)
- Access DOD Marketplace DApp at [DOD-NFT-marketplace](https://dod-nft-marketplace.netlify.app/) and start minting your Crypto Boys.
#
### Run the DApp Locally
```
#### Open new terminal window and clone this repository
```
git clone https://github.com/jutivia/DOD-Nft-market-place.git
```
#### Install dependencies
```
npm install && cd client npm install
```
#### Compile smart contract
```
npx hardhat compile
```
#### Deploy smart contract 
```
npx hardhat run scripts/deploy.js -- network polygon
```
#### Test smart contract
```
npx hardhat test test/smart-contract-test.js
```
#### Start DApp
```
npm start
```
- Open metamask browser wallet and connect network.
```
#### Hardhat help commands
npx hardhat help

```
