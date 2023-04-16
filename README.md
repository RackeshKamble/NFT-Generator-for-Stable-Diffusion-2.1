# NFT-Generator-Stable-Diffusion-V-2-1

## Tech Stacks

- [Hardhat](https://hardhat.org/) (For Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (For Blockchain Interaction)
- [React.js](https://reactjs.org/) (As a Frontend Framework)
- Solidity (For Writing Smart Contracts & Tests)
- Javascript (For React & Testing)
- [NFT.Storage](https://nft.storage/) (Connection to IPFS)
- [Hugging Face](https://huggingface.co/) (AI Models)

## Setup .env file:
Create a .env file with the following values (see .env.example):

- **REACT_APP_HUGGING_FACE_API_KEY=""**
- **REACT_APP_NFT_STORAGE_API_KEY=""**

Create an account on [Hugging Face](https://huggingface.co/), go to profile settings, and create a read access token. 

Create an account on [NFT.Storage](https://nft.storage/), & create a new API key.

## Install NodeJS
- Install [NodeJS](https://nodejs.org/en/)
## Install Dependencies:
`$ npm install`
## Run tests
`$ npx hardhat test`
## Start Hardhat node (local)
`$ npx hardhat node`
## Run deployment script (localhost)
`$ npx hardhat run ./scripts/deploy.js --network localhost`
## Start React frontend
`$ npm run start`
