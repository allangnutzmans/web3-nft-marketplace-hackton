# Makefile for Foundry deployments

# Environment variables
PRIVATE_KEY ?= $(shell grep PRIVATE_KEY .env | cut -d '=' -f2)
ETHERSCAN_API_KEY ?= $(shell grep ETHERSCAN_API_KEY .env | cut -d '=' -f2)

SCRIPT = script/DeployPetNft.s.sol:DeployPetNft

# RPC endpoints
ANVIL_RPC = http://127.0.0.1:8545
BASE_SEPOLIA_RPC = https://sepolia.base.org

.PHONY: anvil base-sepolia clean

## Deploy to local Anvil
anvil:
	forge script $(SCRIPT) \
		--rpc-url $(ANVIL_RPC) \
		--private-key ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		--broadcast

## Deploy to Base Sepolia testnet
base-sepolia:
	forge script $(SCRIPT) \
		--rpc-url $(BASE_SEPOLIA_RPC) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

## Clean Forge cache & artifacts
clean:
	forge clean
