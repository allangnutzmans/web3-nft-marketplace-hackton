// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PetNft is ERC721, Ownable {
    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;

    event PurchaseRequested(address indexed buyer, uint256 amount, uint256 requestId);
    event PurchaseApproved(address indexed buyer, uint256 tokenId);
    event PurchaseRejected(address indexed buyer, uint256 amountRefunded);

    constructor() ERC721("Pet NFT", "PET") Ownable(msg.sender) {
        s_tokenCounter = 0;
    }

    function requestPurchase() external payable {
        require(msg.value > 0, "Need ETH to purchase");
        emit PurchaseRequested(msg.sender, msg.value, block.number);
    }

    function approvePurchase(address buyer, string memory uri) external onlyOwner {
        uint256 newId = s_tokenCounter;
        s_tokenIdToUri[newId] = uri;
        _safeMint(buyer, newId);
        s_tokenCounter++;
        emit PurchaseApproved(buyer, newId);
    }
    
    function rejectPurchase(address buyer, uint256 amount) external onlyOwner {
        payable(buyer).transfer(amount);
        emit PurchaseRejected(buyer, amount);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToUri[tokenId];
    }
}
