import { Card, Col, Row, Statistic } from "antd";
import React from "react";
import {
  ShoppingCartOutlined,
  DollarCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

export default function Order() {
  return (
    <div>
      {/* Statistics */}
      <Row gutter={20} className="mb-6 gap-2">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1200}
              prefix={<ShoppingCartOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="My Deposit"
              // value={depositAmount}
              prefix={<DollarCircleOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Deposit"
              // value={totalDepositAmount}
              prefix={<DollarCircleOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              // value={users?.length}
              prefix={<UsergroupAddOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Approved Withdrawal Request"
              // value={costData?.length}
              prefix={<UsergroupAddOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
