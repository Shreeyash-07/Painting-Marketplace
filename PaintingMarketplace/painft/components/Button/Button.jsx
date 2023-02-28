import React from "react";
import Style from "./Button.module.css";
const Button = ({ btnName, handleClick }) => {
  return (
    <div className={Style.box}>
      <button
        style={{ fontFamily: "inherit" }}
        className={Style.button}
        onClick={() => {
          handleClick();
        }}
      >
        {btnName}
      </button>
    </div>
  );
};

export default Button;
