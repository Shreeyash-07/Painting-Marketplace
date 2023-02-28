import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
// import { Button, Category, Brand } from "../components/componentindex";
import NFTDetailsPage from "../NFTDetailsPage/NFTDetailsPage";

//IMPORT SMART CONTRACT DATA
import { PaintingMarketplaceContext } from "../Context/PaintingMarketplaceContext";
const NFTDetails = () => {
  // const { currentAccount } = useContext(PaintingMarketplaceContext);
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
    setNft(router.query);
    console.log({ router });
    setIsListed(router.listed);
    console.log({ querydata: router.query });
  }, [router.isReady]);

  return (
    <div>
      <NFTDetailsPage nft={nft} isListed={isListed} />
      {/* <Category /> */}
      {/* <Brand /> */}
    </div>
  );
};

export default NFTDetails;
