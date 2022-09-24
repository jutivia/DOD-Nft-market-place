// SPDX-License-Identifier: UNLICENSE-2.0
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";


import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTMarketPlace is ERC721A, IERC721Receiver{

    using Counters for Counters.Counter;
    
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.0025 ether;

    uint256 currentTokenCount;
    
    address payable owner;
    uint8 defaultMintQuantity = 1;

    address baseContract;

    mapping(uint256 => string) private tokenURIToItem;

     mapping(uint256 => DodNFT) public oneDod;
     mapping(string => bool) public tokenNameExists;
    
    struct DodNFT{
      uint256 tokenId;
      string tokenName;
      string tokenURI;
      address payable mintedBy;
      address payable currentOwner;
      bool listed;
      address payable previousOwner;
      bool sold;
      uint256 price;
      uint256 numberOfTransfers;
      string src;
    }


    event MarketItemCreated (
      uint256 indexed tokenId,
      address owner,
      uint256 price,
      bool sold
    );

    constructor() ERC721A("Dod Token", "DODNFTs") {
        owner = payable(msg.sender);
    }

    function DodCounter() public view returns (uint){
      return _nextTokenId();
    }
    function _setTokenURI(uint256 newTokenId, string memory tokenURI) private {
        tokenURIToItem[newTokenId] = tokenURI;
    }

    function _startTokenId() internal override pure returns (uint256){
      return 1;
    }
      /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "ERR-1.0.1: Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

      /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4){
      return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

       /* Mints a token */
    function createToken(string memory tokenURI, uint256 price, string memory _name, string memory _src) public returns (uint) {
      require(!tokenNameExists[_name], "ERR-1.0.2:Token name already exists");
      uint256 newTokenId = _nextTokenId();
      _safeMint(msg.sender, defaultMintQuantity);
      _setTokenURI(newTokenId, tokenURI);
      DodNFT memory newDod = DodNFT (newTokenId, _name, tokenURI, payable(msg.sender), payable(msg.sender), false, payable(address(0)), false, price, 0, _src);
      oneDod[newTokenId] = newDod;
      tokenNameExists[_name] = true;
      return newTokenId;
    }

     function createMarketItem(
      uint256 tokenId
    ) public payable {
      require(msg.value == listingPrice, "ERR-1.0.3:Price must be equal to listing price");
      DodNFT storage newDod = oneDod[tokenId];
      newDod.listed = true;
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        newDod.price,
        false
      );

    }
    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      DodNFT storage newDod = oneDod[tokenId];
      require(newDod.currentOwner == msg.sender, "ERR-1.0.4: Only item owner can perform this operation");
      require(msg.value == listingPrice, "ERR-1.0.5: Price must be equal to listing price");
      newDod.sold = false;
      newDod.price = price;
      newDod.listed = true;
      _itemsSold.decrement();
    }
        /* Records the sale of a marketplace item */
    function createMarketSale(
      uint256 tokenId
      ) public {
      DodNFT storage newDod = oneDod[tokenId];
      // require(msg.sender == newDod.currentOwner, 'ERR-1.0.6: Only ');
      address prevOwner = newDod.currentOwner;
      uint256 currentTransfers = newDod.numberOfTransfers;
      uint price = newDod.price;
      newDod.sold = true;
      newDod.currentOwner = payable(msg.sender);
      newDod.previousOwner = payable(prevOwner);
      newDod.listed = false;
      newDod.numberOfTransfers = currentTransfers+ 1;   
      _itemsSold.increment();
    }

       /* Returns all  market items */
    function fetchMarketItems() public view returns (DodNFT[] memory) {
      uint itemCount = _nextTokenId() -1 ;
      uint currentIndex = 0;

      DodNFT[] memory items = new DodNFT[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
          uint currentId = i + 1;
          DodNFT storage currentItem = oneDod[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (DodNFT[] memory) {
      uint totalItemCount = _nextTokenId() -1 ;
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (oneDod[i + 1].currentOwner == msg.sender) {
          itemCount += 1;
        }
      }

      DodNFT[] memory items = new DodNFT[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (oneDod[i + 1].currentOwner == msg.sender) {
          uint currentId = i + 1;
          DodNFT storage currentItem = oneDod[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

     /* Returns only all market items */
    function fetchItemsListed() public view returns (DodNFT[] memory) {
      uint itemCount = _nextTokenId();
      uint unsoldItemCount = itemCount - _itemsSold.current();
      uint currentIndex = 0;

      DodNFT[] memory items = new DodNFT[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (oneDod[i + 1].listed == true) {
          uint currentId = i + 1;
          DodNFT storage currentItem = oneDod[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function getTokenURI (uint256 _tokenURI) external view returns (string memory){
        return tokenURIToItem[_tokenURI];
    }

    function TransferToOwner (uint amount) external {
      require(msg.sender == owner, "ERR-1.0.7: Only owner");
      require(address(this).balance > amount, "ERR-1.0.8: Insufficient Balance");
      payable(owner).transfer(amount);
    }

    function changeTokenPrice(uint256 _tokenId, uint256 price) external {
      DodNFT storage DOD = oneDod[_tokenId];
      require(DOD.currentOwner == msg.sender, "ERR-1.0.9: Only NFT owner allowed");
      DOD.price = price;
    }
    function removeFromSale(uint256 _tokenId) external{
      DodNFT storage newDod = oneDod[_tokenId];
      newDod.listed = false;
    }
}

