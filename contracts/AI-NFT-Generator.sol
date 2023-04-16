// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// https://docs.openzeppelin.com/contracts/4.x/erc721

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    //For NFT ID
    using Strings for uint256;


    address public owner;
    uint256 public cost;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
        cost = _cost;
    }

// Mint Function -> Its a ERC721 function
// https://docs.openzeppelin.com/contracts/4.x/erc721

    function mint(string memory tokenURI) public payable {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }
    
// totalSupply Function
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

// Withdraw Function
    function withdraw() public {
        require(msg.sender == owner);
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    function getNFT(uint256 nftId) public view returns (address _owner, string memory uri) {
        _owner = ownerOf(nftId);
        uri = tokenURI(nftId);
}

    function getNFTId(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(address(this), tokenId.toString()));
    }

}
