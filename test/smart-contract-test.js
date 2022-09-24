const { expect }= require("chai");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketPlace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    let listingPrice = await nftMarketplace.getListingPrice();

     listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    const [sellerAddress, buyerAddress] = await ethers.getSigners();


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
    
       // /* Fetching market items */
   const items = await nftMarketplace.fetchMarketItems();
    expect(items.length).to.equal(3)

    const myNfts = await nftMarketplace.fetchMyNFTs()
    expect(myNfts.length).to.equal(3)


    const unListedDod = await nftMarketplace.oneDod(1)
    expect(unListedDod.listed).to.equal(
     false
    )

    // /* eCreating  market items */
    await nftMarketplace
      .createMarketItem(1, { value: listingPrice });

    
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
    // Creating a market sale for an item
   await nftMarketplace.connect(buyerAddress).createMarketSale(1);
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
    
    // await nftMarketplace
    //   .createMarketItem(3,  { value: listingPrice });

  });
});
