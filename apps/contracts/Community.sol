// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error SaleInactive();
error SoldOut();
error NotWhiteListed();
error InvalidPrice();
error WithdrawFailed();
error InvalidCharge();
error InvalidQuantity();
error InvalidProof();

contract CommunityNFT is ERC1155, Ownable, ERC1155Supply, ERC1155Burnable, ERC2981 {

    enum SaleState {
        CLOSED,
        OPEN,
        PRESALE
    }
    
    SaleState public saleState = SaleState.CLOSED;
    uint256 public immutable presaleSupply = 30;
    uint256 public immutable supply = 100;
    uint256 public presaleMaxPerWallet = 1;
    uint256 public maxPerWallet = 10;
    uint256 public presalePrice = 0 ether;
    uint256 public price = 0.069 ether;
    uint256 public totalMinted = 0;
    address payable public feeAddress;
    address[] public whiteListedAddresses;
    mapping(string => bool) public invitationCodeMinted;
    mapping(address => uint256) public addressMintBalance;
    address[] public withdrawAddresses;
    uint256[] public withdrawPercentages;
    string private name_;
    string private symbol_;

    constructor(string memory n, 
                string memory s, 
                string memory uri_,
                uint96 _royaltyAmount
                ) ERC1155(uri_) {
        name_ = n;
        symbol_ = s;
         _setDefaultRoyalty(owner(), _royaltyAmount);
    }

    function isWhiteListed(address sender, string memory invitationCode) internal view returns (bool) {
        if (bytes(invitationCode).length != 0 && invitationCodeMinted[invitationCode]) {
            return true;
        }
        for (uint i = 0; i < whiteListedAddresses.length; i++) {
            if (whiteListedAddresses[i] == sender) {
                return true;
            }
        }
        return false;
    }

    function presale(uint256 qty, string memory invitationCode) external payable {
        if (saleState != SaleState.PRESALE) revert SaleInactive();
        if (totalMinted > presaleSupply) revert SoldOut();
        if (msg.value != presalePrice * qty) revert InvalidPrice();
        if (!isWhiteListed(msg.sender, invitationCode)) revert NotWhiteListed();
        if (addressMintBalance[msg.sender] + qty > presaleMaxPerWallet) revert InvalidQuantity();
        addressMintBalance[msg.sender] += qty;
        totalMinted += 1;
        if (qty == 1) {
           _mint(msg.sender, totalMinted, qty, "");     
        } else {
           uint256[] memory ids;
           uint256[] memory amounts;
           for (uint i = 0; i < qty; ++i) {
            ids[i] = totalMinted;
            amounts[i] = 1; // for NFT, this should always be 1
            ++totalMinted;            
           }
           _mintBatch(msg.sender, ids, amounts, "");
        }
        if (bytes(invitationCode).length != 0 ){
            invitationCodeMinted[invitationCode] = false;
        }
    }

    /// @dev not required by ERC-1155 standard, but for OpenSea to display
    function name() public view returns (string memory) {
        return name_;
    }

    /// @dev not required by ERC-1155 standard, but for OpenSea to display
    function symbol() public view returns (string memory) {
        return symbol_;
    }

    /// @dev the newuri should be the base uri of the metadata uris,
    ///         e.g, https://app.mercurylab.xyz/metadata/ instead of
    ///         https://app.mercurylab.xyz/metadata/{id}.json
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }
    
    function setSaleState(uint8 _state) external onlyOwner {
        saleState = SaleState(_state);
    }

    /// @dev override the default implementation for the NFT to display correctly on OpenSea
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(tokenId), Strings.toString(tokenId), ".json"));
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        price = newPrice;
    }

    function setPresalePrice(uint256 newPrice) external onlyOwner {
        presalePrice = newPrice;
    }
    
    function setPerWalletMax(uint256 _val) external onlyOwner {
        maxPerWallet = _val;
    }

    function setPresalePerWalletMax(uint256 _val) external onlyOwner {
        presaleMaxPerWallet = _val;
    }

    function setRoyaltyInfo(address receiver, uint96 feeBasisPoints)
        external
        onlyOwner
    {
        _setDefaultRoyalty(receiver, feeBasisPoints);
    }

    function setFeeAccount(address payable receiver) external onlyOwner{
       feeAddress = receiver;     
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external payable {
        if (saleState != SaleState.OPEN) revert SaleInactive();
        if (totalMinted + 1 > supply) revert SoldOut();
        if (msg.value != price) revert InvalidPrice();
        if (addressMintBalance[msg.sender] + 1 > maxPerWallet) revert InvalidQuantity();
        (bool success, ) = feeAddress.call{value: price / 100}(""); // charge 1% platform fee of the 
        if (!success) revert InvalidCharge();
        _mint(account, id, amount, data);
        addressMintBalance[msg.sender] += 1;
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external payable {
        uint256 qty = ids.length;
        if (saleState != SaleState.OPEN) revert SaleInactive();
        if (totalMinted +qty > supply) revert SoldOut();
        if (msg.value != price *qty) revert InvalidPrice();
        if (addressMintBalance[msg.sender] +qty > maxPerWallet) revert InvalidQuantity();
         (bool success, ) = feeAddress.call{value: price * qty / 100}(""); // charge 1% platform fee of the 
         if (!success) revert InvalidCharge();
        _mintBatch(to, ids, amounts, data);
        addressMintBalance[msg.sender] += qty;
    }

    function _withdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        if (!success) revert WithdrawFailed();
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        for (uint256 i; i < withdrawAddresses.length; i++) {
            _withdraw(withdrawAddresses[i], (balance * withdrawPercentages[i]) / 100);
        }
    }

    /// @dev The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        totalMinted += ids.length;
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
