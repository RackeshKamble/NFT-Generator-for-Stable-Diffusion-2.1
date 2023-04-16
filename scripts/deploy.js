const { ethers } = require("hardhat");

async function main() {
  const NAME = "AI Jurgen Klopp Smoking" ;
  const SYMBOL = "AIKLOPPSMOKING" ;
  // 1 ETH
  const COST = ethers.utils.parseUnits("0.00001", "ether") ;

  const NFT = await ethers.getContractFactory("NFT") ;
  const nft = await NFT.deploy(NAME, SYMBOL, COST) ;
  await nft.deployed() ;

  console.log("Deployed Domain Contracts at " + nft.address + "\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
