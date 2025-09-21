// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Test, console2 } from 'forge-std/Test.sol';
import { PetNft } from '../src/PetNft.sol';

contract PetNftTest is Test {
  PetNft private i_petNft;

  address private s_buyer;
  address private s_otherAddress;

  function setUp() public {
    i_petNft = new PetNft();
    s_buyer = makeAddr('buyer');
    s_otherAddress = makeAddr('other');
  }

  function test_RequestPurchase() public payable {
    vm.deal(s_buyer, 1 ether);

    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseRequested(s_buyer, 1 ether, block.number);

    vm.prank(s_buyer);
    i_petNft.requestPurchase{ value: 1 ether }();
  }

  function testRevert_RequestPurchase_ZeroValue() public {
    vm.prank(s_buyer);
    vm.expectRevert(bytes4(keccak256('NeedEthToPurchase()')));
    i_petNft.requestPurchase();
  }

  function test_ApprovePurchase() public {
    vm.deal(s_buyer, 1 ether);
    vm.prank(s_buyer);
    i_petNft.requestPurchase{ value: 1 ether }();

    string memory uri = 'ipfs://some-uri';

    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseApproved(s_buyer, 0);

    vm.prank(address(this)); // Owner approves
    i_petNft.approvePurchase(s_buyer, uri);

    assertEq(i_petNft.ownerOf(0), s_buyer);
    assertEq(i_petNft.tokenURI(0), uri);
  }

  function testRevert_ApprovePurchase_NotOwner() public {
    vm.prank(s_otherAddress);
    vm.expectRevert(); // No specific error message for Ownable
    i_petNft.approvePurchase(s_buyer, '');
  }

  function test_RejectPurchase() public {
    vm.deal(s_buyer, 1 ether);
    vm.prank(s_buyer);
    i_petNft.requestPurchase{ value: 1 ether }();

    // After the purchase request, BUYER balance is 0 (sent 1 ether to contract)
    uint256 buyerBalanceBefore = s_buyer.balance; // This is 0

    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseRejected(s_buyer, 1 ether);

    vm.prank(address(this)); // Owner rejects
    i_petNft.rejectPurchase(s_buyer, 1 ether);

    assertEq(s_buyer.balance, buyerBalanceBefore + 1 ether); // 0 + 1 ether = 1 ether
  }

  function testRevert_RejectPurchase_NotOwner() public {
    vm.prank(s_otherAddress);
    vm.expectRevert(); // No specific error message for Ownable
    i_petNft.rejectPurchase(s_buyer, 0);
  }

  function testRevert_RejectPurchase_RefundFailed() public {
    address buyer = makeAddr('buyerForFailedRefund');

    // Ensure the contract has no ether
    vm.deal(address(i_petNft), 0);

    vm.prank(address(this));
    vm.expectRevert(bytes4(keccak256('RefundFailed()')));
    i_petNft.rejectPurchase(buyer, 1 ether); // Try to refund 1 ether when contract has 0
  }
}
