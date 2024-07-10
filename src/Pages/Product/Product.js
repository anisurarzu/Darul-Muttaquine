/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState } from "react";

import dmfBook from "../../images/dmf-book.pdf";
import { Image, Modal } from "antd";
import ProductDetails from "./ProductDetails";
import bookOne from "../../images/dmf-book-1.png";
import bookTwo from "../../images/dmf-book-2.png";

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState();
  const products = [
    {
      name: "আলোকিত পথে যাত্রা",
      id: 0,
      image: bookOne,
      description: "This is Product 1",
      price: "$10",
      pdf: dmfBook,
      version: "২০২৩",
      stockStatus: "স্টকে রয়েছে ",
    },
    {
      name: "আলোকিত পথে যাত্রা",
      id: 0,
      image: bookTwo,
      description: "This is Product 1",
      price: "$10",
      pdf: null,
      version: "২০২৪",
      stockStatus: "খুব শিঘ্রই আসছে",
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div style={{ background: "#408F49" }}>
        <h2 className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text">
          আমাদের পণ্য
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4 lg:gap-8 xl:gap-8 mx-8 lg:mx-24 xl:mx-24 my-12">
        {products?.map((product, index) => (
          <div key={index} className=" shadow-md p-3 rounded-md">
            <Image
              className="w-full h-[270px] object-fit rounded-md "
              src={product?.image}
              alt=""
            />
            <h4 className="bangla-text text-[14px] py-1 text-center">
              {product?.name} ({product?.version})
            </h4>
            <div className="flex justify-between ">
              <p
                style={{ color: "#408F49" }}
                className=" my-1 py-1 text-[10px] lg:text-[12px] xl:text-[12px]">
                {product?.stockStatus}
              </p>
              <button
                style={{ background: "#408F49" }}
                className=" text-white rounded-lg py-1 px-2 text-[12px] my-1"
                onClick={() => {
                  setProduct(product);
                  setIsModalOpen(true);
                }}>
                পড়ে দেখুন
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Please Provided Valid Information"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <ProductDetails handleCancel={handleCancel} product={product} />
      </Modal>
    </div>
  );
};

export default Product;
