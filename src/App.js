/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage' ;
import { Buffer } from 'buffer';
import { Contract, ethers } from 'ethers';

//Make API Request inside JS -> AXIOS used
import axios from 'axios';

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'
//import NFT from './abis/NFT.json';

// Config
import config from './config.json';

import MyNFTViewer from './MyNFTViewer';
//import NFTViewer from './NFTViewer';


function App() {
  
   
  // Load Providers
  const [provider, setProvider] = useState(null);
  
  // Load Accounts
  const [account, setAccount] = useState(null);

  const [nft, setNFT] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);

  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const [tokenId, setTokenId] = useState(null);
  
  const [nftData, setNFTData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  
  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    //const network = await provider.getNetwork();
    const nft = new ethers.Contract(config[network.chainId].nft.address, NFT, provider);
     
    setNFT(nft);

  }

  // Submit Handler
  const submitHandler = async (e) =>{
    //Prevent page refresh on hitting enter key
    e.preventDefault();

    if (name === "" || description === "") {
      
      window.alert("Please provide a name and description");
      return;
    }
  
    // Call AI API to generate a image based on description
    const imageData = await createImage();

    // Upload image to IPFS (NFT.Storage)
    const url = await uploadImage(imageData)

    // Mint NFT
    await mintImage(url);

    setIsWaiting(false);

    setMessage("");

  }

  // Create Image Function
  const createImage = async () => {
    
    setMessage("Generating Image...");
    let api_key = process.env.HUGGING_FACE_API_KEY;

    // Copy from API documentation
    //https://axios-http.com/docs/req_config 

      // You can replace this with different model API's
      const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`
  
      // Send the request
      const response = await axios({
        url: URL,
        method: 'POST',
        headers: {
          //Authorization: `Bearer ${api_key}`,
          Authorization: `Bearer ${"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"}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          inputs: description, options: { wait_for_model: true },
        }),
        responseType: 'arraybuffer',
      })
  
      const type = response.headers['content-type']
      const data = response.data
  
      const base64data = Buffer.from(data).toString('base64')
      const img = `data:${type};base64,` + base64data // <-- This is so we can render it on the page
      setImage(img)
  
      return data
    }

  const uploadImage = async (imageData) => {
    
    setMessage("Uploading Image...");
    let storage_key = process.env.REACT_APP_NFT_STORAGE_API_KEY;

    // Create instance to NFT.Storage
    const nftstorage = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEyNUYxQmU1MjIzZUFGQ0IxQmQ2MmU0NDgyMTI1ODYxYzQxRDdDMWEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTYxMjI2ODU0NCwibmFtZSI6ImJsb2NrY2hhaW4ifQ.6z4OMlYWfl7sdQAa8Qjnc6et6_mm_5tP_ISiLKYqXj8" });
    //const nftstorage = new NFTStorage({ token: storage_key})

    // Send Request to store NFT image
    const { ipnft } = await nftstorage.store({

      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,

    })
    // Save the URL
        const url = "https://ipfs.io/ipfs/${ipnft}/metadata.json"
        
        setURL(url);

        return url;

  }

  //Mint NFT image
  const mintImage = async (tokenURI) => {
    
    setMessage("Waiting for Mint...");
    try
    {
    // connect to metamask
      const signer = await provider.getSigner();

    // takes tokenURI and payable(pay for NFT 1 ETH)
    const transaction = await nft.connect(signer).mint(tokenURI, 
      { value: ethers.utils.parseUnits("1", "ether") });
    
    await transaction.wait();
    const receipt = await transaction.wait();
    const events = receipt.events.filter(
      (event) => event.event === "Transfer" && event.args.length === 3
    );
    const tokenId = events[0].args.tokenId.toString();

    setMessage(`NFT Minted Successfully with ID: ${tokenId}`);
    window.alert(`NFT Minted Successfully with ID: ${tokenId}`);
    return tokenId;

 
    }
    catch (error) {
      setMessage(`Error Minting NFT: ${error.message}`);
      window.alert(`Error Minting NFT: ${error.message}`);
    }

    
  }


  useEffect(() => {
    loadBlockchainData();
    //fetchNFTData()  ;
  }, [])


  return (
    
    <div>
    
      <Navigation account={account} setAccount={setAccount} />

      <div className='form'>
        
      <div className="image">

    {!isWaiting && image ? (
    
      <img src={image} alt="Stable Diffusion 2.1 generated image" />
      
    ) : isWaiting ? (

        <div className="image__placeholder">
              <Spinner animation="border" />
              <p>{message}</p>
        </div>
        

    ) : (
          
          <></> 
          
    )}
      </div>

        <form onSubmit={submitHandler}>
        {/* <p className='label'><strong>Please connect with your Ethereum Wallet</strong></p>         */}
        <label htmlFor="fname" className='label'><strong>Enter NFT Name:</strong></label>
          <input type="text" placeholder="e.g. Jurgen Klopp..." onChange={(e) => { setName(e.target.value) }} />

        <label htmlFor="fname" className='label'><strong>Enter NFT Description:</strong></label>
          <input type="text" placeholder="e.g. Jurgen Klopp Horse Riding..." onChange={(e) => setDescription(e.target.value)} />
          
        <input type="submit" value="Create & Mint" />
    {!isWaiting && url && (
    
        <p>
          View&nbsp;<a href={url} target="_blank" rel="noreferrer">Metadata</a>
        </p>
    )}
        </form>   
        

      </div>
        <div className="footer__copyright">
          <small>&copy; RAKESH KAMBLE. All Rights Reserved.</small>
        </div>     

    </div>


);
}

export default App;
