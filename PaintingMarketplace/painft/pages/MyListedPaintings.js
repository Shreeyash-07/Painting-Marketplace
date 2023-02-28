import NFTCard from "../components/NFTCard/NFTCard";
import React, { useContext, useEffect, useState } from "react";
import Style from "../Styles/index.module.css";
import Loader from "../components/Loader/Loader";
import NoItem from "../components/NoItem/NoItem";
import { ethers } from "ethers";
import axios from "axios";
import { PaintingMarketplaceContext } from "../context/PaintingMarketplaceContext";
const MyListedPaintings = () => {
  const [like, setLike] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState();
  const [openError, setOpenError] = useState();
  const [nftsCopy, setNftsCopy] = useState([]);
  const [loading, setLoading] = useState(false);
  const { checkIfWalletConnected } = useContext(PaintingMarketplaceContext);
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      const contract = await checkIfWalletConnected();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchListedPaintings()
          : await contract.fetchMyPaintingsNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, owner, seller, price: unformattedPrice }) => {
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
              seller,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      setNfts(items.reverse());
      return items;
    } catch (error) {
      console.log(error);
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };
  useEffect(() => {
    if (checkIfWalletConnected) {
      fetchMyNFTsOrListedNFTs("fetchItemsListed");
    }
  }, []);

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h1>My Listed Paintings</h1>
      {!nfts.length ? (
        <NoItem content={"You don't have listed Paintings"} />
      ) : (
        <NFTCard NFTData={nfts} isListed={true} />
      )}
    </div>
  );
};

export default MyListedPaintings;
