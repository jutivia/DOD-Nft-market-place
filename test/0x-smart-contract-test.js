const { NftSwapV4 } = require ('@traderxyz/nft-swap-sdk')
const { expect }= require("chai");
const MetaMaskConnector = require('node-metamask');

//Attemptoing to test the SDK with the smartcontract using hardhat and node-metamask

const connector = new MetaMaskConnector({
  port: 3333, // this is the default port
  onConnect() { console.log('MetaMask client connected') }, // Function to run when MetaMask is connected (optional)
});

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    connector.start().then(async () => {
        const web3 = new Web3(connector.getProvider());
        connector.onConnect()
        const accounts = await web3.eth.getAccounts();
        const {sellerAddress, buyersAddress}= accounts
        console.log(sellerAddress, buyersAddress)
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketPlace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    let listingPrice = await nftMarketplace.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");


    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com1",
      auctionPrice,
      'token 1',
      "https://www.mytokenlocation.com1"
    );

    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com2",
      auctionPrice,
      'token 2',
      "https://www.mytokenlocation.com2"
    );

    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com3",
      auctionPrice,
      'token 3',
      "https://www.mytokenlocation.com3"
    );
    
    console.log("Success1: Tokens created")

    
    // /* Fetching market items */
    let items = await nftMarketplace.fetchMarketItems();
    items.map((i) => {
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.currentOwner,
        tokenUri: i.tokenURI,
          name: i.tokenName
        };
        return item;
      })
      // console.log("items: ", items);
    items = await nftMarketplace.fetchMarketItems();
    expect(items.length).to.equal(3)

    const myNfts = await nftMarketplace.fetchMyNFTs()
    expect(myNfts.length).to.equal(3)

    const unListedDod = await nftMarketplace.oneDod(1)
    expect(unListedDod.listed).to.equal(
     false
    )
      
    // Creating amarket sale for an item
     const item = items[0]

         const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        //  console.log('provider', provider)
         const signer = provider.getSigner(sellerAddress["Private Key"]);
         console.log('signer')

        console.log('before that')
        const nftSwapSdk = new NftSwapV4(provider, signer, 80001);
         const DodNft = {
          tokenAddress: nftMarketplace.address, // CryptoPunk contract address
          tokenId: 1, // Token Id of the CryptoPunk we want to swap
          type: 'ERC721', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
        };

         const payment_token = {
          tokenAddress: '0xe11a86849d99f524cac3e7a0ec1241828e332c62', // USDC contract address
          amount: price, // 69 USDC (USDC is 6 digits)
          type: 'ERC20',
        };

        console.log ('before checking for  approval')
       const approvalStatusForUserA = await nftSwapSdk.loadApprovalStatus(
            DodNft,
            signer
          );
           console.log ('after checking for approval', approvalStatusForUserA)
          if (!approvalStatusForUserA.contractApproved) {
            const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
              DodNft,
              signer
            );
            const approvalTxReceipt = await approvalTx.wait();
            console.log(
              `Approved ${DodNft.tokenAddress} contract to swap with 0x v4 (txHash: ${approvalTxReceipt.transactionHash})`
            );
          }
        console.log('order about to be built')
        const order = nftSwapSdk.buildOrder(
          DodNft,
          payment_token,
          sellerAddress,
          {
            fees: [
              {
                amount: 0,
                recipient: DodNft.tokenAddress, // your DAO treasury 
              },
            ],
          }
        );
        const signedOrder = await nftSwapSdk.signOrder(order);
        await nftSwapSdk.postOrder(signedOrder, 80001)
        
            await nftMarketplace
              .createMarketItem(1)

          // checking a listed NFT
        const listedDod = await nftMarketplace.oneDod(1)
        expect(listedDod.currentOwner).to.equal(
        sellerAddress.address
        )
        expect(listedDod.listed).to.equal(
        true
        )
        expect(listedDod.sold).to.equal(
        false
        )
    
      

     

      const approvalStatusForUserB = await nftSwapSdk.loadApprovalStatus(
        payment_token,
        this.state.accountAddress
      );

      // If we do need to approve NFT for swapping, let's do that now
      if (!approvalStatusForUserB.contractApproved) {
        const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
          payment_token,
          this.state.accountAddress
        );
        const approvalTxReceipt = await approvalTx.wait();
        console.log(
          `Approved ${payment_token.tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
        );
      }

      

          await nftSwapSdk.fillSignedOrder(signedOrder)
          console.log('yes')

          const fillTx = await nftMarketplace.createMarketSale(1)
          const txReceipt = await fillTx.wait();
          console.log(txReceipt)

           const soldDod = await nftMarketplace.oneDod(1)
          expect(soldDod.listed).to.equal(
        false
        )
        expect(soldDod.sold).to.equal(
        true
        )
        expect(soldDod.currentOwner).to.equal(
        buyerAddress.address
        )
        
            // /* resell a token */
        await nftMarketplace.resellToken(2, 3, { value: listingPrice });

      })
        
  
  });
});



