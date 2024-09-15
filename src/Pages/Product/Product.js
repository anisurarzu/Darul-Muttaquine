import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  Button,
  Typography,
  Badge,
  Input,
  Divider,
  Steps,
  message,
  Alert,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductDetails from "./ProductDetails";
import bookOne from "../../images/dmf-book-1.png";
import tShirt from "../../images/polo-shirt.jpeg";
import bookTwo from "../../images/dmf-book-2.png";
import dmfBook from "../../images/dmf-book.pdf";
import dmfBook2 from "../../images/dmf-book-2.pdf";
import { useHistory } from "react-router-dom";
import axios from "axios"; // Add this for API requests
import { coreAxios } from "../../utilities/axios";
import OrderTrack from "./OrderTrack";

const { Text, Title } = Typography;
const { Step } = Steps;

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [product, setProduct] = useState();
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [cart, setCart] = useState({});
  const [orderNo, setOrderNo] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
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
      name: "DMF Polo Shirt",
      id: 1,
      image: tShirt,
      description: "This is a DMF Polo Shirt",
      price: 400,
      // pdf: dmfBook,
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
      details:
        "এই পণ্যটি একটি DMF পলো শার্ট। এটি উচ্চমানের মেশ ফ্যাব্রিক দিয়ে তৈরি, যা আরামদায়ক এবং দীর্ঘস্থায়ী। শার্টটি জার্সি টাইপের এবং সাইজের বৈচিত্র্যের সাথে উপলব্ধ।",
    },
    /* {
      name: "আলোকিত পথে যাত্রা",
      id: 1,
      image: bookOne,
      description: "This is Product 1",
      price: 30,
      pdf: dmfBook,
      version: "২০২৩",
      stockStatus: "Stock Out",
    },
    {
      name: "আলোকিত পথে যাত্রা",
      id: 2,
      image: bookTwo,
      description: "This is Product 2",
      price: 30,
      pdf: dmfBook2,
      version: "২০২৪",
      stockStatus: "স্টকে রয়েছে",
    }, */
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
        {/* Search Field for Order Tracking */}
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

        {/* Order Tracking Information */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-6 xl:gap-6 p-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-md shadow-lg p-4">
              <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                <Image
                  className="object-cover rounded-md w-full h-auto"
                  src={product?.image}
                  alt={product?.name}
                  preview={true}
                />
              </div>
              <h3
                level={5}
                className="bangla-text text-[12px] lg:text-[18px] text-center mt-2">
                {product?.name} ({product?.version})
              </h3>
              <h3
                level={5}
                className="text-justify text-[10px] lg:text-[15px] text-center mt-8 mb-2">
                {product?.details}
              </h3>
              <Text className="block text-[12px] text-green-600">
                {product?.stockStatus}
              </Text>
              <div className="flex justify-between items-center mt-2">
                {/* <Button
                  type="primary"
                  className="bg-green-600 text-sm py-1 px-2"
                  onClick={() => {
                    setProduct(product);
                    setIsModalOpen(true);
                  }}>
                  পড়ে দেখুন
                </Button> */}
                <div></div>
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
            onClick={() => history.push("/checkout")} // Add your checkout logic here
          >
            চেকআউট করুন
          </Button>,
          <Button
            key="close"
            onClick={toggleCartModal}
            type="primary"
            className="bg-green-600 text-white bangla-text rounded-md px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base">
            বন্ধ করুন
          </Button>,
        ]}
        bodyStyle={{
          padding: "10px",
          backgroundColor: "#F0F4F8",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        width="80vw"
        centered>
        {Object.values(cart).length > 0 ? (
          <div className="bangla-text">
            {Object.values(cart).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-md lg:p-6">
                <div className="flex flex-col items-start w-2/3">
                  <Text className="font-semibold text-sm lg:text-base">
                    {item.name} ({item.version})
                  </Text>
                  <Text className="text-xs lg:text-sm text-gray-600">
                    মূল্য: ৳{item.price.toFixed(2)} / একক
                  </Text>
                </div>

                <div className="flex items-center">
                  <Button
                    size="small"
                    type="danger"
                    className="text-white bg-red-600 text-xs lg:text-sm"
                    onClick={() => handleRemoveFromCart(item.id)}>
                    -
                  </Button>
                  <Text className="mx-2 font-semibold text-sm lg:text-base">
                    {item.quantity}
                  </Text>
                  <Button
                    size="small"
                    type="primary"
                    className="text-white bg-green-600 text-xs lg:text-sm"
                    onClick={() => handleAddToCart(item)}>
                    +
                  </Button>
                </div>

                <Text className="font-bold text-sm lg:text-base pl-1">
                  মোট: ৳{(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>
            ))}
            <div className="text-right font-bold text-lg lg:text-xl mt-6">
              মোট মূল্য: ৳{calculateTotal().toFixed(2)}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <Text className="text-sm lg:text-base bangla-text text-gray-600">
              আপনার কার্টে কোন পণ্য নেই
            </Text>
          </div>
        )}
      </Modal>

      <Modal title="" open={isModalOpen} onCancel={handleCancel} width={800}>
        <ProductDetails handleCancel={handleCancel} product={product} />
      </Modal>
      <Modal title="" open={isModalOpen2} onCancel={handleCancel} width={800}>
        <OrderTrack
          handleCancel={handleCancel}
          orderData={orderData}
          setOrderData={setOrderData}
        />
      </Modal>
    </div>
  );
};

export default Product;
