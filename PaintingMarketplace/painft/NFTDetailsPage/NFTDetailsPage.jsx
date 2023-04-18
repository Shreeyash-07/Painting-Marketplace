import React from "react";

//INTERNAL IMPORT
import { NFTDescription, NFTDetailsImg, NFTTabs } from "./NFTDetailsIndex";
import Style from "./NFTDetailsPage.module.css";

const NFTDetailsPage = ({ nft, isListed }) => {
  return (
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
        {nft && <NFTDetailsImg nft={nft} />}
        {<NFTDescription NFT={nft} isListed={isListed} />}
      </div>
    </div>
  );
};

export default NFTDetailsPage;
