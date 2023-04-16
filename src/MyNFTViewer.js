import { useState, useEffect } from 'react';
import { ethers } from 'ethers';


// ABIs
//import NFT from './abis/NFT.json'
import NFT from './abis/NFT.json'

// Config
import config from './config.json';


const MyNFTViewer = ({ tokenId }) => {
  const [nftData, setNFTData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNFTData = async () => {
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //const contract = new ethers.Contract(NFT.address, NFT.abi, signer);

      const network = await provider.getNetwork();

      const contract = new ethers.Contract(config[network.chainId].nft.address, NFT, provider);

      const [owner, uri] = await contract.getNFT(tokenId);

      setNFTData({ owner, uri });
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTData();
  }, []);

  if (loading) {
    return <p>Loading NFT data...</p>;
  }

  if (error) {
    return <p>Error loading NFT data: {error.message}</p>;
  }

  if (!nftData) {
    return null;
  }

  return (
    <div>
      <h2>My NFT #{tokenId}</h2>
      <p>Owner: {nftData.owner}</p>
      <p>Metadata URI: {nftData.uri}</p>
      <img src={nftData.uri} alt={`My NFT #${tokenId}`} />
    </div>
  );
};

export default MyNFTViewer;
