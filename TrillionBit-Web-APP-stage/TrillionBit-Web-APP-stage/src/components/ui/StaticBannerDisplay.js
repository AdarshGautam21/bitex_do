import React from "react";
import banner01 from "../../assets/img/banner/00.webp";
import banner02 from "../../assets/img/banner/01.webp";
import banner04 from "../../assets/img/banner/03.webp";
import styles from "../../assets/css/ui/StaticBannerDisplay.module.css";

const StaticBannerDisplay = () => {
  return (
    // Setting the background color directly on the root div
    <div style={{ backgroundColor: "#ffffff", padding: "30px" }}>
      <div className={styles.flexContainer}>
        <div className={styles.item}>
          <a href="/btxCoin">
            <img
              src={banner01}
              alt="bitcoin and crypto exchange"
              width="400"
              height="auto"
            />
          </a>
        </div>
        <div className={styles.item}>
          <a href="/btxCoin">
            <img
              src={banner02}
              alt="bitcoin and crypto exchange"
              width="400"
              height="auto"
            />
          </a>
        </div>
        <div className={styles.item}>
          <a href="/login">
            <img
              src={banner04}
              alt="bitcoin and crypto exchange"
              width="400"
              height="auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default StaticBannerDisplay;
