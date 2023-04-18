import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import NFTDetailsPage from "../NFTDetailsPage/NFTDetailsPage";

const NFTDetails = () => {
  const [isListed, setIsListed] = useState(false);
  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
  });

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    if (router.isReady) {
      console.log("ready router", {
        image: router.query.image,
        tokenId: router.query.tokenId,
        name: router.query.name,
        owner: router.query.owner,
        price: router.query.price,
        seller: router.query.seller,
      });
    }
    setNft({
      image: router.query.image,
      tokenId: router.query.tokenId,
      name: router.query.name,
      owner: router.query.owner,
      price: router.query.price,
      seller: router.query.seller,
    });
    setIsListed(router.listed);
  }, [router.isReady]);

  return (
    <div>
      <NFTDetailsPage nft={nft} isListed={isListed} />
    </div>
  );
};

export default NFTDetails;
