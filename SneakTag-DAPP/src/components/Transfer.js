import React, { useState } from 'react';
import Web3 from 'web3';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Transfer() {
    const [SneakID, setSneakID] = useState('');
    const [wallet, setWallet] = useState('');
    const [connectedAccount, setConnectedAccount] = useState(null);
    const [Displaymsg, setDisplaymsg] = useState('');
//done using selected adddress seperate address not defined for testing purposes switched in demonstration.
    const connectMetamask = async (e) => {
        e.preventDefault();
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnectedAccount(window.ethereum.selectedAddress);
            } catch (error) {
                console.error(error);
            }
        }
    };
// Logic to transfer the NFT to the new buyer of the sneaker uses the safetransfer function.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            // use the usecontract for interacting with the ABI saved in sneaktag.json
            const address = '0xded7B214C34507844B41144d05C1A2cdeA13d231';
            const contract = new web3.eth.Contract(SneakTag, address);
//done using selected adddress seperate address not defined for testing purposes switched in demonstration.
            try {
                await contract.methods
                    .safeTransferFrom(window.ethereum.selectedAddress, wallet, SneakID)
                    .send({ from: window.ethereum.selectedAddress });
                console.log('NFT transferred successfully');
                setDisplaymsg('NFT transferred successfully'); // success message when the nft is transferred
            } catch (error) {
                console.error('Error transferring NFT:', error.message);
            }
        } else {
            console.error('Please connect your MetaMask');
        }
    };
// return elements for interaction with the dapp.
    return (
        <div className="auth-form-container">
            <h2>Transfer SneakNFT</h2>
            <form className="Authenticate-form" onSubmit={handleSubmit}>
                <button className="button1" type="button" onClick={connectMetamask}>Connect Metamask</button>
                {connectedAccount && (
                    <p>
                        Connected Account:{" "}
                        <span className="connected-account">{connectedAccount}</span>
                    </p>
                )}
                <label htmlFor="tokenid">Token ID</label>
                <input value={SneakID} onChange={(e) => setSneakID(e.target.value)} type="text" placeholder="Enter your token ID" id="tokenid" name="tokenid" />
                <label htmlFor="WalletID">Transfer Wallet</label>
                <input value={wallet} onChange={(e) => setWallet(e.target.value)} type="text" placeholder="Enter the Transfer MetaMask Account ID" id="Wallet" name="Wallet" />
                <button type="submit">Transfer</button>
            </form>
            {Displaymsg && ( //success message printed
                <div className="success-message">
                    {Displaymsg}
                </div>
            )}
        </div>
    )
}

export default Transfer;
