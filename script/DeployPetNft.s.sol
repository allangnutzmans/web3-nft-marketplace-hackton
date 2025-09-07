// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Script, console2 } from 'forge-std/Script.sol';
import { PetNft } from '../src/PetNft.sol';

contract DeployPetNftScript is Script {
  function setUp() public {}

  function run() public returns (PetNft) {
    vm.startBroadcast();
    PetNft petNft = new PetNft();
    vm.stopBroadcast();
    return petNft;
  }
}
