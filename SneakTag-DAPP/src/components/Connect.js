import React, { useState } from 'react';
import Web3 from 'web3';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Connect() {
  const [SneakID, setSneakID] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [Displaymsg, setDisplaymsg] = useState('');
//done using selected adddress seperate address not defined for testing purposes account switched while operation.
  const connectmetamaskwll = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnectedAddress(window.ethereum.selectedAddress);
      } catch (error) {
        console.error('Couldnt Connect to metamask:', error.message);
      }
    } else {
      console.error('MetaMask not installed on browser sorry');
    }
  };
// logic for confirming sneakid and minting the NFT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      // use the usecontract for interacting with the ABI saved in sneaktag.json
      const address = '0xded7B214C34507844B41144d05C1A2cdeA13d231';
      const usecontract = new web3.eth.Contract(SneakTag, address);
  // pass the hexadecimal sneakid which is to be checked by the mint function
      const hexSneakID = web3.utils.padRight(web3.utils.asciiToHex(SneakID), 64);
 // triggers for checking if the nft is minted properly and connect to sc to mint the nfts also triggers for if the metamask is not connected  
      try {
        await usecontract.methods
          .authenticateAndMintNFT(hexSneakID, ipfsLink)
          .send({ from: window.ethereum.selectedAddress, value: web3.utils.toWei('0.0000003', 'ether') }) // Add value here
          .on('receipt', () => { // removed the unused receipt variable.
            console.log('NFT minted successfully');
            setDisplaymsg('NFT Minted successfully'); 
          });
      } catch (error) {
        console.error('Error minting NFT:', error.message);
      }
    } else {
      console.error('Please connect MetaMask');
    }
  };
// return elements for interaction with the dapp.
  return (
    <div className="auth-form-container">
      <h2>Connect your NFT</h2>
      <p>Connected Address: {connectedAddress}</p>
      <form className="Authenticate-form" onSubmit={handleSubmit}>
        <button className="button1" type="button" onClick={connectmetamaskwll}>Connect Metamask</button>
        <label htmlFor="SneakID">Sneak ID</label>
        <input value={SneakID} onChange={(e) => setSneakID(e.target.value)} type="text" placeholder="Enter the Sneak ID" id="SneakID" name="SneakID" />
        <label htmlFor="ipfsLink">IPFS Link</label>
        <input value={ipfsLink} onChange={(e) => setIpfsLink(e.target.value)} type="text" placeholder="Enter IPFS link" id="ipfsLink" name="ipfsLink" />
        <button type="submit">Authenticate</button>
      </form>
      {Displaymsg && ( //final success message printed
        <div className="success-message"> 
          {Displaymsg}
        </div>
      )}
    </div>
  );
}

export default Connect;
