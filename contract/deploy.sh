forge script script/EntryPoint.s.sol:EntryPointScript --rpc-url "http://127.0.0.1:8545/" --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
forge script script/AccounFactory.s.sol:AccounFactoryScript --rpc-url "http://127.0.0.1:8545/" --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

#Saphe
forge script script/CounterFactory.s.sol:CounterFactoryScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/Weapon.s.sol:WeaponScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/Potion.s.sol:PotionScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/FakeCoin.s.sol:FakeCoinScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir

forge script script/AssetExchange.s.sol:AssetExchangeScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/ContractOwnershipMarket.s.sol:ContractOwnershipMarketScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir

graph init --product hosted-service --from-contract 0x19e266FC1fc674e4C9baF7fFb2544a30eb789B0c --network shape-sepolia --abi /abis/ContractOwnershipMarket.json ContractOwnershipMarket