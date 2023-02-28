// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract PaintingMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _paintingsSold;

    address payable owner;

    struct Painting {
        uint256 tokenId;
        address seller;
        address owner;
        string name;
        uint256 price;
        bool forSale;
    }

    mapping (uint256 => Painting) public paintings;

    event PaintingAdded(uint256 tokenId, address owner,address seller, string name, uint256 price,bool forSale);
    event PaintingSold(uint256 paintingId, address seller, address buyer, uint256 price);


    constructor() ERC721("PaintingNFT", "PNFT"){
        owner = payable(msg.sender);
    }

    function createTokenForPainting(string memory name,string memory tokenURI,uint256 price)public payable returns(uint256){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender,newTokenId);
        _setTokenURI(newTokenId,tokenURI);
        addPainting(name,newTokenId,price);
        return newTokenId;
    }

 
    function addPainting(string memory _name, uint256 tokenId ,uint256 _price) private {
        require(_price > 0,"Price must be at least 1 wei");
        paintings[tokenId] = Painting(tokenId,msg.sender,address(this), _name, _price, true);
        _transfer(msg.sender, address(this), tokenId);
        emit PaintingAdded(tokenId,address(this),msg.sender, _name, _price,true);
    }

    function buyPainting(uint256 tokenId) public payable {
        uint256 price = paintings[tokenId].price;
        require(paintings[tokenId].forSale, "Painting must be for sale");
        require(msg.value >= price, "Insufficient funds");
        paintings[tokenId].owner = msg.sender;
        paintings[tokenId].seller = address(0);
        paintings[tokenId].forSale = false;
        _paintingsSold.increment();
        _transfer(address(this),msg.sender,tokenId);
        payable(paintings[tokenId].seller).transfer(msg.value);
        emit PaintingSold(tokenId, paintings[tokenId].seller, msg.sender, msg.value);
    }

    function resellPaintingToken(uint256 tokenId,uint256 price) public payable{
        require(paintings[tokenId].owner == msg.sender,"Only item owner can perform this operation");
        paintings[tokenId].forSale = true;
        paintings[tokenId].price = price;
        paintings[tokenId].seller = msg.sender;
        paintings[tokenId].owner = address(this);
        _paintingsSold.decrement();
        _transfer(msg.sender,address(this),tokenId);
    }

    function getPaintings() public view returns (Painting[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemsCount = _tokenIds.current() - _paintingsSold.current();
        uint256 currentIndex = 0;
        
        Painting[] memory items = new Painting[](itemsCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (paintings[i+1].owner == address(this)) {
                uint256 currentId = i + 1;
                Painting storage currentPainting = paintings[currentId];
                items[currentIndex] = currentPainting;
                currentIndex+=1;
            }
        }
        return items;
    }
    function fetchMyPaintingsNFTs() public view returns (Painting[] memory){
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemsCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i = 0; i < totalItemCount; i++){
            if(paintings[i+1].owner == msg.sender){
                itemsCount+=1;
            }
        }
        Painting[] memory items = new Painting[](itemsCount);
        for(uint256 i = 0;i<totalItemCount;i++){
           if(paintings[i+1].owner == msg.sender){
                uint256 currentId = i + 1;
                Painting storage currentPainting = paintings[currentId];
                items[currentIndex] = currentPainting;
                currentIndex+=1;
            }
        }
        return items;
    }

    function fetchListedPaintings() public view returns(Painting[] memory){
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemsCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (paintings[i + 1].seller == msg.sender) {
                itemsCount += 1;
            }
        }

        Painting[] memory items = new Painting[](itemsCount);
        for(uint256 i = 0;i<totalItemCount;i++){
           if(paintings[i+1].seller == msg.sender){
                uint256 currentId = i + 1;
                Painting storage currentPainting = paintings[currentId];
                items[currentIndex] = currentPainting;
                currentIndex+=1;
            }
        }
        return items;
    }

}

