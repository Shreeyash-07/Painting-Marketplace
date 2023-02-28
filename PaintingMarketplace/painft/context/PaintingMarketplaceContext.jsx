import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { Network, Alchemy } from "alchemy-sdk";
import { create as ipfsHttpClient } from "ipfs-http-client";
import {
  PaintingMarketplaceAddress,
  PaintingMarketplaceABI,
} from "./constants";
import { Button } from "../components/componentindex";
import detectEthereumProvider from "@metamask/detect-provider";

const projectId = "2M0cdgkJM4DAGY4qPpOVzfVneEX";
const projectSecretKey = "cf106c02ae580f51f0c4a70abf3be821";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const alchemySettings = {
  apiKey: "9uPUULaNKAHHreEg14kRyYxkl9YaiB8e",
  network: Network.ETH_GOERLI,
};
const subdomain = "https://shree.infura-ipfs.io";
const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const PaintingMarketplaceContext = React.createContext();

export const PaintingMarketplaceProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchContract = (SignerOrProvider) => {
    ethers.Contract(
      PaintingMarketplaceAddress,
      PaintingMarketplaceABI,
      SignerOrProvider
    );
  };

  // const connectingWithSmartContract = async () => {
  //   try {
  //     let provider = await detectEthereumProvider();
  //     provider = new ethers.providers.Web3Provider(provider);
  //     console.log({ provider });
  //     const signer = provider.getSigner();
  //     const contract = fetchContract(signer);
  //     setContract(contract);
  //     return contract;
  //   } catch (err) {
  //     console.log("Something went wrong while connecting with contract", err);
  //   }
  // };
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      let provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          PaintingMarketplaceAddress,
          PaintingMarketplaceABI,
          signer
        );
        const getBalance = await provider.getBalance(accounts[0]);
        const bal = ethers.utils.formatEther(getBalance);
        setAccountBalance(bal);
        // if (accounts.length) {
        //   setLoading(true);
        //   setCurrentAccount(accounts[0]);
        //   setLoading(false);
        // } else {
        //   setError("No Account Found");
        //   setOpenError(true);
        // }
        return contract;
      }
    } catch (error) {
      setError("Something wrong while connecting to wallet", error);
      setOpenError(true);
    }

    // new Promise(async (resolve, reject) => {
    //   let provider = await detectEthereumProvider();
    //   if (provider) {
    //     const accounts = await provider.request({
    //       method: "eth_requestAccounts",
    //     });
    //     setCurrentAccount(accounts[0]);
    //     const networkId = await provider.request({ method: "net_version" });
    //     provider = new ethers.providers.Web3Provider(provider);
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(
    //       PaintingMarketplaceAddress,
    //       PaintingMarketplaceABI,
    //       signer
    //     );
    //     resolve({ contract, accounts, networkId });
    //     return;
    //   }
    //   reject("Install Metamask");
    // });
  };

  useEffect(() => {
    checkIfWalletConnected();
    // connectingWithSmartContract();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");
      let provider = await detectEthereumProvider();
      let accounts = null;
      if (provider) {
        accounts = await provider.request({
          method: "eth_accounts",
        });
      }
      setCurrentAccount(accounts[0]);
      console.log("connected to wallet");
    } catch (error) {
      setError("Error while connecting to wallet");
      setOpenError(true);
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      setError("Error Uploading to IPFS");
      setOpenError(true);
    }
  };

  const createNFTofPainting = async (
    name,
    price,
    image,
    description,
    router
  ) => {
    if (!name || !description || !price || !image)
      return setError("Data Is Missing"), setOpenError(true);

    const data = JSON.stringify({ name, description, image });

    try {
      const added = await client.add(data);

      const url = `https://shree.infura-ipfs.io/ipfs/${added.path}`;

      await addPainting(name, url, price);
      console.log({ url, price });
      router.push("/");
    } catch (error) {
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  const addPainting = async (name, url, formInputPrice, isReselling, id) => {
    try {
      console.log("inside add painting");
      console.log({ url, formInputPrice, isReselling, id });
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      const contract = await checkIfWalletConnected();

      const transaction = !isReselling
        ? await contract.createTokenForPainting(name, url, price)
        : await contract.resellPaintingToken(id, price);

      await transaction.wait();
      console.log(transaction);
    } catch (error) {
      setError("error while creating sale");
      setOpenError(true);
      console.log(error);
    }
  };
  const fetchNFTs = async () => {
    try {
      setLoading(true);
      console.log({ currentAccount });
      if (currentAccount) {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://eth-goerli.g.alchemy.com/v2/srfHaW9Z3kQomIs8eEVHYULywsRzBe_G"
        );
        const contract = new ethers.Contract(
          PaintingMarketplaceAddress,
          PaintingMarketplaceABI,
          provider
        );

        const data = await contract.getPaintings();

        const items = await Promise.all(
          data.map(async ({ tokenId, owner, price: unformattedPrice }) => {
            console.log(tokenId.toNumber());
            if (tokenId.toNumber() !== 1) {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );
              console.log({ nft: price, tokenId, owner, image, description });
              return {
                price,
                tokenId: tokenId.toNumber(),
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          })
        );

        console.log({ items: items });
        setLoading(false);
        return items;
      }
    } catch (error) {
      setError("Error while fetching NFTS");
      setOpenError(true);
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentAccount) {
      console.log("Cuuret AC there");
      fetchNFTs();
    } else {
      connectWallet();
      fetchNFTs();
      console.log("Cuuret AC not there");
    }
  }, []);
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount) {
        const contract = await connectingWithSmartContract();

        const data =
          type == "fetchItemsListed"
            ? await contract.fetchListedPaintings()
            : await contract.fetchMyPaintingsNFTs();

        const items = await Promise.all(
          data.map(async ({ tokenId, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          })
        );
        return items;
      }
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };
  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.buyPainting(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error While buying NFT");
      setOpenError(true);
    }
  };
  return (
    <PaintingMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        createNFTofPainting,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        addPainting,
        currentAccount,
        setOpenError,
        openError,
        error,
        loading,
        accountBalance,
      }}
    >
      {/* <Button btnName="Fetch NFTs" handleClick={fetchNFTs}></Button> */}
      {children}
    </PaintingMarketplaceContext.Provider>
  );
};
