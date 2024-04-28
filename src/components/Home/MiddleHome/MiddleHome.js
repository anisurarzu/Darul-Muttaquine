import React, { useEffect, useState } from "react";

import icon1 from "../../../images/icon01_small.png";
import icon2 from "../../../images/icon02_small.png";
import icon3 from "../../../images/icon03_small.png";
import icon4 from "../../../images/icon04_small.png";

import { Tag } from "primereact/tag";

import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";

export default function MiddleHome() {
  const [products, setProducts] = useState([
    {
      name: "What Is Life",
      image:
        "https://shirley-demo.myshopify.com/cdn/shop/products/book-cover0_3fc9a3e2-8b9c-42a2-bb51-942c624395b1_large.jpg?v=1574075610",
      price: 29.99,
      inventoryStatus: "In Stock",
    },
    {
      name: "Pyramid",
      image:
        "https://shirley-demo.myshopify.com/cdn/shop/products/book-cover-03-psd_78a87a1f-634d-4e4d-8f82-efb1d1f6698e_large.jpg?v=1574075628",
      price: 39.99,
      inventoryStatus: "Out of Stock",
    },
    {
      name: "The Golden Memories",
      image:
        "https://shirley-demo.myshopify.com/cdn/shop/products/book-cover02_b16bd855-a3aa-48fd-973f-79c0e8038381_large.jpg?v=1574075620",
      price: 49.99,
      inventoryStatus: "In Stock",
    },
    {
      name: "Product With Video",
      image:
        "https://shirley-demo.myshopify.com/cdn/shop/products/book-cover0_3fc9a3e2-8b9c-42a2-bb51-942c624395b1_large.jpg?v=1574075610",
      price: 19.99,
      inventoryStatus: "In Stock",
    },
    {
      name: "Demo Product 5",
      image: "demo-product-5.jpg",
      price: 59.99,
      inventoryStatus: "Out of Stock",
    },
    {
      name: "Demo Product 6",
      image: "demo-product-6.jpg",
      price: 34.99,
      inventoryStatus: "In Stock",
    },
    {
      name: "Demo Product 7",
      image: "demo-product-7.jpg",
      price: 25.99,
      inventoryStatus: "Out of Stock",
    },
    {
      name: "Demo Product 8",
      image: "demo-product-8.jpg",
      price: 44.99,
      inventoryStatus: "In Stock",
    },
    {
      name: "Demo Product 9",
      image: "demo-product-9.jpg",
      price: 69.99,
      inventoryStatus: "In Stock",
    },
    {
      name: "Demo Product 10",
      image: "demo-product-10.jpg",
      price: 19.99,
      inventoryStatus: "Out of Stock",
    },
  ]);
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const productTemplate = (product) => {
    return (
      <div className="border border-rounded m-2 text-center py-5 mx-4 hover:shadow-lg">
        <div className="flex justify-center">
          <img
            src={`${product.image}`}
            alt={product.name}
            className="w-[250px]  shadow-2"
          />
        </div>
        <div className="p-4 text-justify">
          <h4 className="text-[24px] text-gray-600 hover:text-green-600 ">
            {product.name}
          </h4>
          <h6 className="text-[19px] text-green-600">${product.price}</h6>

          <div className=" flex flex-wrap gap-2 justify-content-center">
            <Button
              icon="pi pi-star-fill"
              className="text-yellow-500 text-[19px]"
            />
            <Button
              icon="pi pi-star-fill"
              className="text-yellow-500 text-[19px]"
            />
            <Button
              icon="pi pi-star-fill"
              className="text-yellow-500 text-[19px]"
            />
            <Button
              icon="pi 
              pi-star"
              className="text-yellow-500 text-[19px]"
            />
            <Button icon="pi pi-star" className="text-yellow-500 text-[19px]" />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {/* 1st part */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 pt-16 mx-32">
        {/* 1 */}
        <div className="grid grid-cols-3">
          <div className="pt-2">
            <img className="w-1/2" src={icon1} alt="" />
          </div>
          <div className="col-span-2">
            <h3 className="text-[20px] ">Quick Delivery</h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[16px]">
              Most product are free <br />
              shipping.
            </p>
          </div>
        </div>
        {/* 2 */}
        <div className="grid grid-cols-3">
          <div className="pt-2">
            <img className="w-1/2" src={icon2} alt="" />
          </div>
          <div className="col-span-2">
            <h3 className="text-[20px] ">Pay with Easy</h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[16px]">
              Most product are free <br /> shipping.
            </p>
          </div>
        </div>
        {/* 3 */}
        <div className="grid grid-cols-3 ">
          <div className="pt-2">
            <img className="w-1/2" src={icon3} alt="" />
          </div>
          <div className="col-span-2">
            <h3 className="text-[20px] ">Best Deal</h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[16px]">
              Most product are free <br /> shipping.
            </p>
          </div>
        </div>
        {/* 4 */}
        <div className="grid grid-cols-3">
          <div className="pt-2">
            <img className="w-1/2" src={icon4} alt="" />
          </div>
          <div className="col-span-2">
            <h3 className="text-[20px] ">Secured Payment</h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[16px]">
              Most product are free <br /> shipping.
            </p>
          </div>
        </div>
      </div>
      {/* 2nd part */}

      <div className="mx-32 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 pt-24">
        <di className="middle-div-one text-white">
          <h4 className="text-[18px] py-4 pl-4 font-semibold">SPECIAL OFFER</h4>
          <h2 className="text-[38px] font-semibold pl-4">
            Buy 3. Get <br /> 1 Free
          </h2>
        </di>
        <div className="middle-div-two text-white">
          <h4 className="text-[18px] py-4 pl-4 font-semibold">$50.00</h4>
          <h2 className="text-[38px] font-semibold pl-4">
            Praise for <br /> The Night Child
          </h2>
        </div>
      </div>

      {/* 3rd part */}
      <div className="card mx-32">
        <Carousel
          value={products}
          numScroll={1}
          numVisible={4}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>
    </div>
  );
}
