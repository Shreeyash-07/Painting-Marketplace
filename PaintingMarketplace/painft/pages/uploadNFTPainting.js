import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import Style from "../Styles/upload-nft.module.css";
import { UploadNFT } from "../uploadNFT/uploadNFTIndex";

//SMART CONTRACT IMPORT
// import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import { PaintingMarketplaceContext } from "../context/PaintingMarketplaceContext";
const uploadNFTPainting = () => {
  const { uploadToIPFS, createNFTofPainting } = useContext(
    PaintingMarketplaceContext
  );
  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>List you painting</h1>
          <p>
            You can set preferred display name, create your profile URL and
            manage other personal settings.
          </p>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Image</h2>
          <p>File types supported: JPG, PNG. Max size: 100 MB</p>
        </div>

        <div className={Style.uploadNFT_box_form}>
          <UploadNFT
            uploadToIPFS={uploadToIPFS}
            createNFTofPainting={createNFTofPainting}
          />
        </div>
      </div>
    </div>
  );
};

export default uploadNFTPainting;
