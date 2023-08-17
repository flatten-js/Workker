// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract Waylap is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string private _RevealedURI;
    string private _notRevealedURI;
    uint256 private _maxToken;

    mapping(uint256 => bool) revealed;

    constructor(string memory RevealedURI, string memory notRevealedURI, uint256 maxToken) ERC721("Waylap", "WAY") {
        _RevealedURI = RevealedURI;
        _notRevealedURI = notRevealedURI;
        _maxToken = maxToken;
        _tokenIdCounter.increment();
    }
   
    function _baseURI() internal view override returns (string memory) {
        return _RevealedURI;
    }

    function safeMint() public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= _maxToken, "Token issuance limit reached");
        _safeMint(owner(), tokenId);
        _tokenIdCounter.increment();
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        if (revealed[tokenId] == false) {
            return _notRevealedURI;
        }

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

    function reveal(uint256 tokenId) public onlyOwner {
        _requireMinted(tokenId);
        revealed[tokenId] = true;
    }

    function isRevealed(uint256 tokenId) public view returns (bool) {
        _requireMinted(tokenId);
        return revealed[tokenId];
    }
}
