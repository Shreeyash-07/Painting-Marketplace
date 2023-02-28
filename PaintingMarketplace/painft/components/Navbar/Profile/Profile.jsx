import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUserAlt, FaRegImage, FaUserEdit } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { TbDownloadOff, TbDownload } from "react-icons/tb";
import { PaintingMarketplaceContext } from "../../../context/PaintingMarketplaceContext";
import Style from "./Profile.module.css";
import image from "../../../assets/logo.png";

const Profile = () => {
  const { currentAccount } = useContext(PaintingMarketplaceContext);
  var truncate = function (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || "...";

    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    return (
      fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars)
    );
  };
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image
          src={image}
          alt="user profile"
          height={50}
          className={Style.profile_account_img}
        />

        <div className={Style.profile_account_info}>
          <p>Shreeyash Gurav</p>
          <small>
            {currentAccount
              ? truncate(currentAccount, 20)
              : "XB32JK4KJ33J4KJ3..."}
          </small>
        </div>
      </div>

      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt />
            <p>
              <Link href={{ pathname: "/myprofile" }}>My Profile</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaRegImage />
            <p>
              <Link href={{ pathname: "/MyListedNFTs" }}>My NFTs</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaUserEdit />
            <p>
              <Link href={{ pathname: "/MyListedPaintings" }}>
                My Listed Paintings
              </Link>
            </p>
          </div>
        </div>
        <div className={Style.profile_menu_two}>
          {/* <div className={Style.profile_menu_one_item}>
            <MdHelpCenter />
            <p>
              <Link href={{ pathname: "/help" }}>Help</Link>
            </p>
          </div> */}
          <div className={Style.profile_menu_one_item}>
            <TbDownload />
            <p>
              <Link href={{ pathname: "/disconnect" }}>Disconnect</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
