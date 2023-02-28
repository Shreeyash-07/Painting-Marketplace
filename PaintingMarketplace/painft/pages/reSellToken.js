import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "../styles/reSellToken.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button } from "../components/componentindex";

//IMPORT SMART CONTRACT
import { PaintingMarketplaceContext } from "../context/PaintingMarketplaceContext";

const reSellToken = () => {
  const { addPainting } = useContext(PaintingMarketplaceContext);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const router = useRouter();
  const { id, tokenURI, paintingName } = router.query;
  console.log({ id, tokenURI, paintingName });
  const fetchNFT = async () => {
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURI);

    setImage(data.image);
  };

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const resell = async () => {
    try {
      await addPainting(paintingName, tokenURI, price, true, id);
      router.push("/MyListedNFTs");
    } catch (error) {
      console.log("Error while resell", error);
    }
  };
  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_box}>
        <h1>ReSell Your Token, Set Price</h1>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">Price</label>
          <input
            type="number"
            min={1}
            placeholder="Resell price"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={Style.reSellToken_box_image}>
          {image && (
            <Image src={image} alt="resell nft" width={400} height={400} />
          )}
        </div>

        <div className={Style.reSellToken_box_btn}>
          <Button btnName="Resell NFT" handleClick={() => resell()} />
        </div>
      </div>
    </div>
  );
};

export default reSellToken;
