import NFTCard from "../components/NFTCard/NFTCard";
import React, { useContext, useEffect, useState } from "react";
import Style from "../Styles/index.module.css";
import Loader from "../components/Loader/Loader";
import { ethers } from "ethers";
import axios from "axios";
import {
  PaintingMarketplaceABI,
  PaintingMarketplaceAddress,
} from "../context/constants";

import { PaintingMarketplaceContext } from "../context/PaintingMarketplaceContext";
const Home = () => {
  const [like, setLike] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState();
  const [openError, setOpenError] = useState();
  const [nftsCopy, setNftsCopy] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNFTs = async () => {
    try {
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
        data.map(
          async ({ tokenId, owner, seller, price: unformattedPrice }) => {
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
              console.log({
                nft: price,
                tokenId,
                owner,
                seller,
                image,
                description,
              });
              return {
                price,
                tokenId: tokenId.toNumber(),
                owner,
                seller,
                image,
                name,
                description,
                tokenURI,
              };
            }
          }
        )
      );
      console.log({ items: items });
      setNfts(items.reverse());
      return items;
    } catch (error) {
      setError("Error while fetching NFTS");
      setOpenError(true);
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("iniside index.js");
    setLoading(true);
    fetchNFTs();
    setLoading(false);
  }, []);
  return (
    <div className={Style.homePage}>
      <NFTCard NFTData={nfts} />
    </div>
  );
};

export default Home;
