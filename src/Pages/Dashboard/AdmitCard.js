import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import DMFLogo from "../../images/dmf-logo-report.png";
import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Button } from "antd";

const AdmitCard = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`scholarship-info/${id}`);
      if (response?.status === 200) {
        setData(response?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  useEffect(() => {
    fetchScholarshipInfo();
  }, []);

  const print = () => {
    window.print();
  };

  return (
    // START
    <div>
      <div className="layout-invoice-page  mx-28">
        {/* START BUTTON */}
        <div className="flex gap-8  w-full mt-8 mx-0">
          <Button
            type="primary"
            onClick={print}
            className="p-mb-3"
            icon={<PrinterOutlined />}
          >
            Print
          </Button>

          <Button
            onClick={() => {
              history.goBack();
            }}
            className="p-mr-2"
            title="Back"
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
        </div>
        {/* END BUTTON */}
      </div>

      <div className="layout-invoice-content w-full mt-8 bg-[#F1F5F9] print:!bg-white">
        <div>
          {/* Top */}
          <div className="flex items-center mx-44">
            <div>
              <img src={DMFLogo} alt="logo" className="w-28 h-24" />
            </div>
            <div className="font-bold uppercase text-4xl pl-10">
              <p>Darul Muttaquine foundation</p>
            </div>
          </div>
          {/* END TOP */}

          {/* Header */}
          <p className="text-3xl font-bold uppercase underline text-center pt-0">
            DMF scholarship 2024
          </p>
          <p className="text-xl font-bold text-center pt-4">
            ( Aug-Sept 2024 Examination )
          </p>
          {/* END Header */}

          <div className="grid grid-cols-12 mt-10">
            <div className="col-span-9">
              <table className="w-full text-[12px]">
                <colgroup>
                  <col style={{ width: "23%" }} />
                  <col style={{ width: "33%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "22%" }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      Roll Number
                    </td>
                    <td className="border border-black print:!border-black pl-1 font-semibold">
                      {data?.scholarship?.scholarshipRollNumber}
                    </td>
                    <td className="border border-black print:!border-black"></td>
                    <td className="border border-black print:!border-black"></td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      Name
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      {data?.scholarship?.name}
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      Class
                    </td>
                    <td className="border border-black print:!border-black pl-1">
                      {data?.scholarship?.instituteClass}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      DOB
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      {data?.scholarship?.dateOfBirth}
                    </td>
                    <td className="border border-black print:!border-black pl-1">
                      GENDER
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      {data?.scholarship?.gender}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      Parent Name
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      {data?.scholarship?.parentName}
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      Blood Group
                    </td>
                    <td className="border border-black print:!border-black pl-1 uppercase">
                      {data?.scholarship?.bloodGroup}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      PHONE NUMBER
                    </td>
                    <td
                      className="border border-black print:!border-black pl-1 uppercase"
                      colSpan={3}
                    >
                      {data?.scholarship?.phone}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      ADDRESS
                    </td>
                    <td
                      className="border border-black print:!border-black pl-1 uppercase"
                      colSpan={3}
                    >
                      {data?.scholarship?.presentAddress}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      Institute
                    </td>
                    <td
                      className="border border-black print:!border-black pl-1 uppercase"
                      colSpan={3}
                    >
                      {data?.scholarship?.institute}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      Institute Roll No.
                    </td>
                    <td
                      className="border border-black print:!border-black pl-1 uppercase"
                      colSpan={3}
                    >
                      {data?.scholarship?.instituteRollNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black print:!border-black pl-1 uppercase py-1">
                      EXAM CENTER
                    </td>
                    <td
                      className="border border-black print:!border-black pl-1 uppercase"
                      colSpan={3}
                    >
                      {data?.scholarship?.examCenter}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-span-3">
              <div className="flex justify-center items-center">
                <img
                  src={data?.scholarship?.image}
                  alt="logo"
                  className="w-56 h-56 border py-2"
                />
              </div>
              <p className="font-semibold text-2xl text-center pt-6">
                ADMIT CARD
              </p>
            </div>
          </div>

          {/* Start Instruction */}
          <div className="mt-8">
            <p className="font-bold text-xl">Exam Instructions:</p>
            <table className="w-full text-[12px] mt-3">
              <colgroup>
                <col style={{ width: "3%" }} />
                <col style={{ width: "97%" }} />
              </colgroup>
              <tbody>
                {data?.instructions?.map((value, index) => {
                  const serialNumber = index + 1;
                  return (
                    <tr key={index}>
                      <td className="border border-black print:!border-black py-1 text-center">
                        {serialNumber}
                      </td>
                      <td className="border border-black print:!border-black pl-2 uppercase py-1">
                        {value.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* End Instruction */}

          {/* END */}
        </div>
      </div>
      {/* END END MAIN ADMIN CARD REPORT */}
    </div>
    // END
  );
};

export default AdmitCard;
