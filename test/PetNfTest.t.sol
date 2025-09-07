// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Test, console2 } from 'forge-std/Test.sol';
import { PetNft } from '../src/PetNft.sol';

contract PetNftTest is Test {
  PetNft private i_petNft;

  address private constant BUYER = address(0x123);
  address private constant OTHER_ADDRESS = address(0x456);

  function setUp() public {
    i_petNft = new PetNft();
  }

  function test_RequestPurchase() public payable {
    vm.deal(BUYER, 1 ether);

    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseRequested(BUYER, 1 ether, block.number);

    vm.prank(BUYER);
    i_petNft.requestPurchase{ value: 1 ether }();
  }

  function testRevert_RequestPurchase_ZeroValue() public {
    vm.prank(BUYER);
    vm.expectRevert('Need ETH to purchase');
    i_petNft.requestPurchase();
  }

  function test_ApprovePurchase() public {
    vm.deal(BUYER, 1 ether);
    vm.prank(BUYER);
    i_petNft.requestPurchase{ value: 1 ether }();

    string memory uri = 'ipfs://some-uri';

    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseApproved(BUYER, 0);

    vm.prank(address(this)); // Owner approves
    i_petNft.approvePurchase(BUYER, uri);

    assertEq(i_petNft.ownerOf(0), BUYER);
    assertEq(i_petNft.tokenURI(0), uri);
  }

  function testRevert_ApprovePurchase_NotOwner() public {
    vm.prank(OTHER_ADDRESS);
    vm.expectRevert(); // No specific error message for Ownable
    i_petNft.approvePurchase(BUYER, '');
  }

  function test_RejectPurchase() public {
    vm.deal(BUYER, 1 ether);
    vm.prank(BUYER);
    i_petNft.requestPurchase{ value: 1 ether }();

    // After the purchase request, BUYER balance is 0 (sent 1 ether to contract)
    uint256 buyerBalanceBefore = BUYER.balance; // This is 0

    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseRejected(BUYER, 1 ether);

    vm.prank(address(this)); // Owner rejects
    i_petNft.rejectPurchase(BUYER, 1 ether);

    assertEq(BUYER.balance, buyerBalanceBefore + 1 ether); // 0 + 1 ether = 1 ether
  }

  function testRevert_RejectPurchase_NotOwner() public {
    vm.prank(OTHER_ADDRESS);
    vm.expectRevert(); // No specific error message for Ownable
    i_petNft.rejectPurchase(BUYER, 0);
  }
}
