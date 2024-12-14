forge script script/EntryPoint.s.sol:EntryPointScript --rpc-url "http://127.0.0.1:8545/" --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
forge script script/AccounFactory.s.sol:AccounFactoryScript --rpc-url "http://127.0.0.1:8545/" --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

#Saphe
forge script script/CounterFactory.s.sol:CounterFactoryScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/Weapon.s.sol:WeaponScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/Potion.s.sol:PotionScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/FakeCoin.s.sol:FakeCoinScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir

forge script script/AssetExchange.s.sol:AssetExchangeScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY --via-ir
forge script script/ContractOwnershipMarket.s.sol:ContractOwnershipMarketScript --rpc-url $SHAPE_RPC --broadcast --private-key $PRIVATE_KEY

graph init --from-contract 0xbdF2124e85Df1df6Fc5a857556071633D9cc7019 --network shape-sepolia --abi ./abis/ContractOwnershipMarket.json contract_ownership_market
graph init --from-contract 0x0680d7a6cBf31377063c5EEB99d1615b3a454483 --network shape-sepolia --abi ./abis/AssetExchange.json asset-exchange
//subgraph/abis/ContractOwnershipMarket.json

graph deploy asset-exchange \
  --version-label v0.0.1 \
  --node https://subgraphs.alchemy.com/api/subgraphs/deploy \
  --deploy-key Q2KlOU4jbLyS6 \
  --ipfs https://ipfs.satsuma.xyz