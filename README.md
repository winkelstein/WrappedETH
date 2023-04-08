# WrappedETH

This project demonstrates how Wrapped ETH works.

## Interaction

Deployed to Goerli [view on etherscan](https://goerli.etherscan.io/address/0x29b04117eD48022453680A3EB3d5F1ADb7Ef336D)

This contract implements all ERC20 functions and two new:

```
function deposit() public payable;
function withdraw(uint256 _amount) public;
```

`deposit` function increases your WETH balance throw the sending ether to WETH smart contract (wraps)

`widtdraw` returns your ether to you (unwraps)

## Development

### Clone

```
git clone https://github.com/treug0lnik041/ttt-ethereum.git && cd ttt-ethereum/ && npm i
```

### Compile

```
npx hardhat compile
```

### Test

```
npx hardhat test
```

or

```
REPORT_GAS=true npx hardhat test
```

### Deploy (already verified and deployed to Goerli [view on etherscan](https://goerli.etherscan.io/address/0x29b04117eD48022453680A3EB3d5F1ADb7Ef336D))

1. create `.env` file and put your private key and api key for your network.
2. in `hardhat.config.ts` add your network just like it was done for Goerli
3. run following script:

```
npx hardhat run --network [YOUR_NETWORK] scripts/deploy.ts
```
