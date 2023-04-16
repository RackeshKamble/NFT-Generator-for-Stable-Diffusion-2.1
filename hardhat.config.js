require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || "" ;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

   networks :{
     localhost:{},
   
    sepolia :{
       url : 'https://eth-sepolia.g.alchemy.com/v2/DKOqNE-J3cXcgTFwj9-JO7ow_PFatvjM',
       accounts : privateKeys.split(',')
     }
   },
   browser: true,

};