import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Mlogin() {
  const [SneakID, setSneakID] = useState('');
  const [file, setFile] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [contract, setinstantiate] = useState(null);
  const [Displaymsg, setDisplaymsg] = useState(''); // added extra display message with usestate

  // Improvized from the last phase with a single instance being run of the smart contract instance.
  useEffect(() => {
    // Using the useEffect for single instance call.
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      // use the setinstantiate for interacting with the ABI saved in sneaktag.json
      const address = '0xded7B214C34507844B41144d05C1A2cdeA13d231';
      const setinstance = new web3.eth.Contract(SneakTag, address);
      setinstantiate(setinstance);
    }
  }, []); //passing empty array for single instantiated phase for calls below.

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        //done using selected adddress seperate address not defined for testing purposes
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // logic for the manufacturer to pay 0.0000003 ethereum to be accountable to the user and to provide the accurate details also to prevent others from entering details
        const isManufacturerRegistered = await contract.methods.manufacturers(window.ethereum.selectedAddress).call();
        if (!isManufacturerRegistered) {
          const web3 = new Web3(window.ethereum);
        // transfer the money in wei from the account.
          await contract.methods.verifyAndRegisterManufacturer().send({ from: window.ethereum.selectedAddress, value: web3.utils.toWei('0.0000003', 'ether') });
        }

        setConnectedAccount(window.ethereum.selectedAddress);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Metamask not installed sorry');
    }
  };
// handling the trigger if not uploaded
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log('Please select a file to upload');
      return;
    }
// handling trigger for sneak id not uploaded
    if (!SneakID) {
      console.log('Please enter a Sneak ID');
      return;
    }
// code snippet to upload the file to the ipfs kubo running locally
    const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });
    const jsonFile = await file.arrayBuffer();
// code for getting response from the ipfs and adding the jsonfile
    const ipfsResponse = await ipfs.add(jsonFile);
    const ipfsHash = ipfsResponse.path;
// from the ipfshash make the ipfslink
    const ipfsLink = `https://ipfs.io/ipfs/${ipfsHash}`;

    const web3 = new Web3(window.ethereum);
// code for using the hexadecimal sneakid for being in bytes 32 format
    const hexSneakId = web3.utils.padRight(web3.utils.asciiToHex(SneakID), 64);
    await contract.methods.associateMetadataWithSneakid(hexSneakId, ipfsHash).send({ from: window.ethereum.selectedAddress });
// display the message of the mapping of the sneak id and the ipfs link.
    setDisplaymsg(`Sneak ID: ${SneakID} and IPFS Link: ${ipfsLink} have been successfully linked.`);
  };
// placeholder moved for handling the upload of the JSON file.
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };
// return elements for interaction with the dapp.
  return (
    <div className="auth-form-container">
      <h2>Manufacturer Login</h2>
      <form className="Authenticate-form" onSubmit={handleSubmit}>
        <button className="button1" type="button" onClick={connectMetamask}>Connect Metamask</button>
        {connectedAccount && (
          <p>Connected Account: <span className="connected-account">{connectedAccount}</span></p>
        )}
        <label htmlFor="SneakID">SneakID</label>
        <input value={SneakID} onChange={(e) => setSneakID(e.target.value)} type="text" placeholder="Enter your SneakID" id="SneakID" name="SneakID" maxLength={32} />
        <label htmlFor="file">Upload JSON File</label>
        <input type="file" id="file" name="file" onChange={handleFileUpload} accept=".json" />
        <button type="submit">Submit</button>
      </form>
      {Displaymsg && ( //final success message printed
        <div className="success-message">
          {Displaymsg}
        </div>
      )}
    </div>
  );
}

export default Mlogin;

