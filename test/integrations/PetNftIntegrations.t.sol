// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Test } from 'forge-std/Test.sol';
import { PetNft } from '../../src/PetNft.sol';

contract PetNftIntegrationTest is Test {
  PetNft private i_petNft;

  address private s_buyer1;
  address private s_buyer2;

  function setUp() public {
    i_petNft = new PetNft();
    s_buyer1 = makeAddr('buyer1');
    s_buyer2 = makeAddr('buyer2');
  }

  function test_MultiplePurchaseRequestsAndApprovals() public {
    // 1. Setup - Give buyers some ETH
    vm.deal(s_buyer1, 2 ether);
    vm.deal(s_buyer2, 2 ether);
    uint256 startingBuyer1Balance = s_buyer1.balance;
    uint256 startingBuyer2Balance = s_buyer2.balance;

    // 2. Buyer 1 requests purchase
    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseRequested(s_buyer1, 1 ether, block.number);
    vm.prank(s_buyer1);
    i_petNft.requestPurchase{ value: 1 ether }();

    // 3. Buyer 2 requests purchase
    vm.expectEmit(true, true, true, true);
    emit PetNft.PurchaseRequested(s_buyer2, 1 ether, block.number);
    vm.prank(s_buyer2);
    i_petNft.requestPurchase{ value: 1 ether }();

    // 4. Owner approves purchase for buyer 1
    string memory uri1 = 'ipfs://uri1';
    vm.prank(address(this));
    i_petNft.approvePurchase(s_buyer1, uri1);

    // 5. Owner approves purchase for buyer 2
    string memory uri2 = 'ipfs://uri2';
    vm.prank(address(this));
    i_petNft.approvePurchase(s_buyer2, uri2);

    // 6. Assertions
    assertEq(i_petNft.ownerOf(0), s_buyer1, 'Buyer 1 should own token 0');
    assertEq(i_petNft.tokenURI(0), uri1, 'Token 0 URI is incorrect');

    assertEq(i_petNft.ownerOf(1), s_buyer2, 'Buyer 2 should own token 1');
    assertEq(i_petNft.tokenURI(1), uri2, 'Token 1 URI is incorrect');

    assertEq(s_buyer1.balance, startingBuyer1Balance - 1 ether, 'Buyer 1 balance is incorrect');
    assertEq(s_buyer2.balance, startingBuyer2Balance - 1 ether, 'Buyer 2 balance is incorrect');
  }
}
