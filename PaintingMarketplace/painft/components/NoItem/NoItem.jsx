import React from "react";
import Style from "./NoItem.module.css";
const NoItem = ({ content }) => {
  return (
    <div className={Style.noitem_box}>
      <h2>{content}</h2>
    </div>
  );
};

export default NoItem;
