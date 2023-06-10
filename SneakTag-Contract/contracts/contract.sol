// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SneakTag is ERC721URIStorage {
    mapping(address => bool) public manufacturers; // map of registered manufacturers
    mapping(bytes32 => string) public sneakMetadata; // map of car metadata associated with a given ID
    mapping(uint256 => bytes32) private tokenSneakIds; // map of token IDs to sneak IDs
    mapping(uint256 => uint256) public priceperNFT; // mapping for the price of the sneaktag
    uint256 private currentTokenSupply; // current token ID for minting
    uint256 constant private NFT_PRICE = 0.0000003 ether; // minting sneaktag price

    event ManufacturerRegistered(address indexed manufacturer);
    event MetadataAssociated(bytes32 indexed sneakid, string ipfsLink);
    event NFTMinted(address indexed to, uint256 indexed tokenId, string newIpfsLink);

    constructor() ERC721("SneakTag", "SNKT") {} //constructor that initializes the ERC721 contract

    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Only registered manufacturers can call this function");
        _;
    }

    modifier sneakidExists(bytes32 sneakid) {
        require(bytes(sneakMetadata[sneakid]).length > 0, "Sneak ID not found in metadata mapping"); // check that the given sneak ID has associated metadata
        _;
    }

    modifier sneakidOwnerOnly(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the token"); // check that the caller of the function owns the given token
        _;
    }

    function associateMetadataWithSneakid(bytes32 sneakid, string memory ipfsLink) external onlyManufacturer {
        sneakMetadata[sneakid] = ipfsLink; // associate ipfsLink with the given sneak ID
        emit MetadataAssociated(sneakid, ipfsLink); // emit the associated event
    }

    function verifyAndRegisterManufacturer() external payable {
        if (!manufacturers[msg.sender]) {
            require(msg.value == NFT_PRICE, "Registration fee required."); //time saver trick since the nft price and the manufacturer registration fee is same
            manufacturers[msg.sender] = true; // register the manufacturer
            emit ManufacturerRegistered(msg.sender); // emit the registration event
        }
    }

    
    function authenticateAndMintNFT(bytes32 sneakid, string memory newIpfsLink) external payable sneakidExists(sneakid) returns (uint256) {
        require(msg.value == NFT_PRICE, "Price of NFT is 0.0000003 ETH"); // updated NFT price
        currentTokenSupply += 1; // increment the current token ID for sneaktag
        _safeMint(msg.sender, currentTokenSupply); // mint the NFT to the manufacturer
        _setTokenURI(currentTokenSupply, newIpfsLink); // set the token URI to the given IPFS link
        tokenSneakIds[currentTokenSupply] = sneakid; // map the token ID to the given sneak ID
        priceperNFT[currentTokenSupply] = NFT_PRICE; //set price while minting

        emit NFTMinted(msg.sender, currentTokenSupply, newIpfsLink); // emit the NFT minted event

        return currentTokenSupply;
    }

    function getTokenSneakid(uint256 tokenId) external view sneakidOwnerOnly(tokenId) returns (bytes32) {
        return tokenSneakIds[tokenId]; // return the sneak ID associated with the given token ID
    }

    function totalsneaktagminted() external view returns (uint256) {
        return currentTokenSupply; // function to return the total sneaktags minted till now
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId); //check if tokenid exists before transfer using exists function
    }

    function safeTransfer(address to, uint256 tokenId) public sneakidOwnerOnly(tokenId) {
        require(tokenExists(tokenId), "SneakTag does not exist"); // check if the token exists before
        safeTransferFrom(msg.sender, to, tokenId); // transfer ownership of the given token ID to the given address
    }

    
    function changeSneakerTagprice(uint256 SneakerTagID, uint256 newsetNFTPrice) public onlyManufacturer { //allow only manufacturer to set price
        priceperNFT[SneakerTagID] = newsetNFTPrice; //set the new price to the mapping
    }
}
