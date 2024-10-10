import React, { useState, useEffect } from "react";
import { Image, Modal, Button, Typography, Badge, Alert } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductDetails from "./ProductDetails";
import { useHistory } from "react-router-dom";
import OrderTrack from "./OrderTrack";

const { Text, Title } = Typography;

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [product, setProduct] = useState();
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [cart, setCart] = useState({});
  const [orderNo, setOrderNo] = useState("");
  const [orderData, setOrderData] = useState(null);
  const history = useHistory();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const products = [
    {
      name: "Ladies' Fashionable Shoes (White)",
      id: 1,
      image: "https://i.ibb.co.com/WKJZn9H/shoe-woman-01.png",
      description: "This is a DMF Polo Shirt",
      price: 1290,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
    {
      name: "Ladies' Fashionable Shoes (Brown)",
      id: 2,
      image: "https://i.ibb.co.com/XVypqRH/shoe-woman-02.png",
      description: "This is a DMF Polo Shirt",
      price: 1290,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
    {
      name: "Sneakers -01",
      id: 3,
      image:
        "https://i.ibb.co.com/9g6Mjdn/462546053-912001237502182-7548883070234090839-n-removebg-preview.png",
      description: "This is a DMF Polo Shirt",
      price: 1450,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
    {
      name: "Sneakers -02",
      id: 4,
      image: "https://i.ibb.co.com/BBZfJ2s/keds-4.png",
      description: "This is a DMF Polo Shirt",
      price: 1450,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
    {
      name: "Sneakers -03",
      id: 5,
      image: "https://i.ibb.co.com/r5B8MX7/keds-3.png",
      description: "This is a DMF Polo Shirt",
      price: 1450,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
    {
      name: "Sneakers -04",
      id: 6,
      image: "https://i.ibb.co.com/xD09x2g/keds-2.png",
      description: "This is a DMF Polo Shirt",
      price: 1450,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
    {
      name: "Mens' Sandals (100% leather)",
      id: 7,
      image:
        "https://i.ibb.co.com/gSVCff6/461477645-534887729163365-7552023182099717256-n-removebg-preview.png",
      description: "This is a DMF Polo Shirt",
      price: 750,
      productType: "shoes",
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details: "",
    },
  ];

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const quantity = prevCart[product.id]
        ? prevCart[product.id].quantity + 1
        : 1;
      const updatedCart = {
        ...prevCart,
        [product.id]: { ...product, quantity },
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId].quantity > 1) {
        updatedCart[productId].quantity -= 1;
      } else {
        delete updatedCart[productId];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setOrderData(null);
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const toggleCartModal = () => {
    setCartModalVisible(!cartModalVisible);
  };

  return (
    <div className="relative">
      <div style={{ background: "#BDDE98" }}>
        <Title
          level={2}
          className="text-center text-2xl lg:text-[28px] py-4 text-white bangla-text"
          style={{ color: "#2F5811" }}>
          আমাদের পণ্য
        </Title>
      </div>

      {/* Alert for Order Tracking Instructions */}
      <Alert
        message="আপনার অর্ডার স্ট্যাটাসের জন্য অনুগ্রহ করে অর্ডার ট্যাকে ক্লিক করুন"
        type="info"
        showIcon
        className="mb-4 mx-8"
      />

      {/* Products Grid */}
      <div className="lg:mx-20">
        <div className="flex justify-center">
          <Button
            className="mt-2 lg:mt-0 xl:mt-0 "
            type="primary"
            onClick={() => {
              setIsModalOpen2(true);
            }}>
            অর্ডার ট্র্যাকিং
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-6 xl:gap-6 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-md shadow-lg p-4 flex flex-col justify-between h-full">
              <div className="flex justify-center">
                <Image
                  className="object-cover rounded-md"
                  src={product?.image}
                  alt={product?.name}
                  preview={true}
                  width={144}
                  height={144}
                />
              </div>
              <h3 className="bangla-text text-[12px] lg:text-[18px] text-center mt-3">
                {product?.name}
              </h3>

              <Text className="block text-[12px] text-green-600">
                {product?.stockStatus} (সকল সাইজের জুতা পাওয়া যাচ্ছে)
              </Text>
              <div className="flex justify-between items-center mt-2">
                <div className="text-green-600 font-semibold text-lg">
                  ৳ {product?.price}
                </div>
                <Button
                  type="primary"
                  className="bg-green-600 text-lg py-1 px-2 font-bold"
                  onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Cart Icon */}
      <div
        className="fixed right-2 top-[140px] lg:top-[160px] flex items-center justify-center bg-green-600 rounded-full w-16 h-16 lg:w-20 lg:h-20 shadow-lg cursor-pointer lg:mx-20"
        onClick={toggleCartModal}>
        <Badge count={Object.keys(cart).length} offset={[-2, 2]}>
          <ShoppingCartOutlined className="text-white text-3xl lg:text-4xl" />
        </Badge>
      </div>

      {/* Cart Modal */}
      <Modal
        title={
          <div className="flex justify-center items-center">
            <ShoppingCartOutlined className="mr-2 text-green-600 text-3xl lg:text-4xl" />
            <Title
              level={4}
              className="text-green-600 bangla-text mb-0 text-xl lg:text-2xl">
              আপনার কার্ট
            </Title>
          </div>
        }
        open={cartModalVisible}
        onCancel={toggleCartModal}
        footer={[
          <Button
            key="clear"
            onClick={clearCart}
            danger
            className="text-white bangla-text rounded-md px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base">
            কার্ট পরিষ্কার করুন
          </Button>,
          <Button
            key="checkout"
            type="primary"
            className="bg-blue-600 text-white bangla-text rounded-md px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
            onClick={() => history.push("/checkout")}>
            চেকআউট করুন
          </Button>,
          <Button
            key="close"
            onClick={toggleCartModal}
            className="bangla-text text-sm lg:text-base">
            বন্ধ করুন
          </Button>,
        ]}>
        {Object.keys(cart).length > 0 ? (
          Object.values(cart).map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={50}
                  height={50}
                  preview={false}
                />
                <div className="ml-4 bangla-text">
                  <Title level={5}>{product.name}</Title>
                  <Text>৳ {product.price}</Text>
                </div>
              </div>
              <div>
                <Button onClick={() => handleRemoveFromCart(product.id)}>
                  -
                </Button>
                <Text className="mx-2">{product.quantity}</Text>
                <Button onClick={() => handleAddToCart(product)}>+</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center">
            <Text className="bangla-text">আপনার কার্ট খালি</Text>
          </div>
        )}
      </Modal>

      {/* Order Tracking Modal */}
      <Modal
        open={isModalOpen2}
        footer={null}
        onCancel={handleCancel}
        width={800}>
        <OrderTrack orderData={orderData} setOrderData={setOrderData} />
      </Modal>
    </div>
  );
};

export default Product;
