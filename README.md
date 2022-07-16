# Welcome to my Dapp Voting project

This website allows to register voters, to manage workflow status, to make submit proposals. Subsequently, registered voters can vote for any proposal once. The votes ccan be tallied and the result is shown immediately in a efficient way powered by the blockchain.
Here a short presentation: https://www.loom.com/share/97a5870ca59040d788c2f7df4803911e
It is also accessible for testing purpose at this address: https://renocardano.github.io/ropstenTest/

![image](https://user-images.githubusercontent.com/68705151/179346146-c89f9220-342c-44ea-95b5-f2180ed6f17a.png)

This decentralized application runs Ropsten network, the smart contract is called voting.sol

## Getting started with dependencies.
To make this project work please intall:
npm install => truffle unbox react
To install truffle  => npm install -g truffle
To install ganache  => npm install -g ganache-cli
Set up a truffle-config.js
npm install --prefix . @truffle/hdwallet-provider
npm install --prefix . --save dotenv
To deploy MNEMONIC
To an other terminal => truffle migrate or truffle migrate --network ropsten for a testnest
To an other terminal => npm run start
To run the project tests suite, do the following
// Run ganache localy ganache-cli -h 127.0.0.1
// Run migrations truffle migrate or truffle migrate -reset
// Run npm run deploy to deploy

