import React from "react";

const Product = () => {
  const products = [
    {
      name: "Product 1",
      id: 0,
      description: "This is Product 1",
      price: "$10",
      pdf: "/path/to/product1.pdf",
    },
    {
      name: "Product 2",
      id: 1,
      description: "This is Product 2",
      price: "$20",
      pdf: "/path/to/product2.pdf",
    },
    {
      name: "Product 3",
      id: 2,
      description: "This is Product 3",
      price: "$30",
      pdf: "/path/to/product3.pdf",
    },
    {
      name: "Product 4",
      id: 3,
      description: "This is Product 4",
      price: "$40",
      pdf: "/path/to/product4.pdf",
    },
  ];

  return (
    <div className="">
      <div style={{ background: "#408F49" }}>
        <h2 className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text">
          আমাদের পণ্য
        </h2>
      </div>
    </div>
  );
};

export default Product;
