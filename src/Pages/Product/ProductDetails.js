/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div className="">
      <div>
        <div className="">
          <iframe
            className="w-[100%] h-[600px]"
            src={product?.pdf}
            frameborder="0"></iframe>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
