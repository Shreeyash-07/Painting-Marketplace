import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import nftimage from "../../assets/nft.png";
import axios from "axios";
import {
  PaintingMarketplaceABI,
  PaintingMarketplaceAddress,
} from "../../context/constants";
import { ethers } from "ethers";
import Style from "./NFTCard.module.css";
import Loader from "../Loader/Loader";

const NFTCard = ({ NFTData, isListed }) => {
  const [like, setLike] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState();
  const [openError, setOpenError] = useState();
  const [nftsCopy, setNftsCopy] = useState([]);
  const [loading, setLoading] = useState(false);
  const likeNft = () => {
    if (!like) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

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
  // console.log(NFTData);
  return (
    <div className={Style.NFTCard}>
      {NFTData.map((el, i) => (
        <Link
          key={i}
          href={{ pathname: "/NFT-details", query: el, isListed: isListed }}
        >
          <div className={Style.NFTCard_box} key={i + 1}>
            <div className={Style.NFTCard_box_img}>
              <Image
                src={el ? el.image : nftimage}
                alt="NFT images"
                width={350}
                height={350}
                className={Style.NFTCard_box_img_img}
              />
            </div>

            <div className={Style.NFTCard_box_update}>
              <div className={Style.NFTCard_box_update_left}>
                <div
                  className={Style.NFTCard_box_update_left_like}
                  onClick={() => likeNft()}
                >
                  {like ? (
                    <AiOutlineHeart />
                  ) : (
                    <AiFillHeart
                      className={Style.NFTCard_box_update_left_like_icon}
                    />
                  )}
                  {""} 22
                </div>
              </div>

              {/* <div className={Style.NFTCard_box_update_right}>
                  <div className={Style.NFTCard_box_update_right_info}>
                    <small>Remaining time</small>
                    <p>3h : 15m : 20s</p>
                  </div>
                </div> */}
            </div>

            <div className={Style.NFTCard_box_update_details}>
              <div className={Style.NFTCard_box_update_details_price}>
                <div className={Style.NFTCard_box_update_details_price_box}>
                  <h4>
                    {el ? el.name : "My NFT"} #{el ? el.tokenId : "123"}
                  </h4>

                  <div
                    className={Style.NFTCard_box_update_details_price_box_box}
                  >
                    <div
                      className={Style.NFTCard_box_update_details_price_box_bid}
                    >
                      <small>Price</small>
                      <p>{el ? el.price : "1"}ETH</p>
                    </div>
                    <div
                      className={
                        Style.NFTCard_box_update_details_price_box_stock
                      }
                    >
                      {/* <small>61 in stock</small> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className={Style.NFTCard_box_update_details_category}>
                  <BsImages />
                </div> */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCard;
