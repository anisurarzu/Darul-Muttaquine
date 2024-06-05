import React, { useEffect, useState } from "react";

import icon1 from "../../../images/vecteezy_fund-raising-and-money-donation-illustration_6901910.jpg";
import icon2 from "../../../images/566.jpg";
import icon3 from "../../../images/vecteezy_food-and-groceries-donation-illustration_6916104.jpg";
import icon4 from "../../../images/icon04_small.png";
import voulenteer from "../../../images/voluenteer.jpg";
import eidCard from "../../../images/eid-card.jpg";

import { Tag } from "primereact/tag";

import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import { coreAxios } from "../../../utilities/axios";
import { toast } from "react-toastify";
import ProjectCard from "../../../Pages/Dashboard/Project/ProjectCard";

export default function MiddleHome() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getAllProject = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/project-info`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setLoading(false);
        setProjects(sortedData);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data?.message);
    }
  };
  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setLoading(false);
        setUsers(sortedData);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data?.message);
    }
  };

  useEffect(() => {
    getAllProject();
    // getAllUserList();
  }, []);

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
      <div className="">
        <ProjectCard rowData={product} />
      </div>
    );
  };
  return (
    <div>
      {/* 1st part */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 pt-16 mx-4 lg:mx-32 xl:mx-32 ">
        {/* 1 */}
        <div className="grid grid-cols-3">
          <div className="col-span-1 lg:col-span-1 xl:col-span-1">
            <img className="w-full" src={icon1} alt="" />
          </div>
          <div className="col-span-2 lg:col-span-2 xl:col-span-2">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] ">
              Donate Us
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[16px] xl:text-[16px]">
              "Through your support, we can progress on the path of cooperation
              and development."
            </p>
          </div>
        </div>
        {/* 2 */}
        <div className="grid grid-cols-3">
          <div className="col-span-1 lg:col-span-1 xl:col-span-1">
            <img className="w-full" src={icon2} alt="" />
          </div>
          <div className="col-span-2 lg:col-span-2 xl:col-span-2">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] ">
              Join In Scholarship
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[16px] xl:text-[16px]">
              "Participate in our scholarship program to open doors to your
              future success!"
            </p>
          </div>
        </div>
        {/* 3 */}
        <div className="grid grid-cols-3">
          <div className="col-span-1 lg:col-span-1 xl:col-span-1">
            <img className="w-full" src={icon3} alt="" />
          </div>
          <div className="col-span-2 lg:col-span-2 xl:col-span-2">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] ">
              Food Donation
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[16px] xl:text-[16px]">
              "Food donation not only nourishes bodies but also feeds souls with
              the warmth of kindness."
            </p>
          </div>
        </div>
        {/* 4 */}
      </div>
      {/* 2nd part */}
      <div className="lg:mx-32 xl:mx-32 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-16 py-4 lg:py-24 xl:py-24 ">
        <di className=" text-white">
          <img src={voulenteer} alt="" />
        </di>
        <di className=" text-white">
          <img src={eidCard} alt="" />
        </di>
      </div>
      {/* 3rd part */}
      <div className="card mx:8 lg:mx-32 xl:mx-32 py-8">
        <h3 className=" text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8 underline text-center font-semibold">
          DMF RUNNING PROJECTS
        </h3>
        <Carousel
          value={projects}
          numScroll={1}
          numVisible={4}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>
      <di className=" text-white pt-2 lg:pt-16 xl:pt-20">
        <img src={eidCard} alt="" />
      </di>
    </div>
  );
}
