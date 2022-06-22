import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import "antd/dist/antd.css";
import {
  Row,
  Col,
  Layout,
  Card,
  Pagination,
  Form,
  Button,
  DatePicker,
  InputNumber,
} from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Meta from "antd/lib/card/Meta";
import moment from "moment";

const { RangePicker } = DatePicker;

function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setdata] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(12);

  const getData = async (url) => {
    setLoading(true);
    setdata([]);

    const config = {
      method: "GET",
      url,
    };
    const response = await axios(config);
    const data = response.data.data;

    await setdata(data);

    if (data !== undefined) {
      setLoading(false);
    }
  };

  const handleChange = (pageNumber, pageSize) => {
    setMinValue((pageNumber - 1) * pageSize);
    setMaxValue(pageNumber * pageSize);
  };

  useEffect(() => {
    getData("http://localhost:5000/api");
  }, []);

  const searchDate = async (values) => {
    const url =
      "http://localhost:5000/api/date/" +
      moment(values.date).format("YYYY-MM-DD");
    getData(url);
  };

  const searchRange = async (values) => {
    const url =
      "http://localhost:5000/api/range/" +
      moment(values.range[0]).format("YYYY-MM-DD") +
      "/" +
      moment(values.range[1]).format("YYYY-MM-DD");

    getData(url);
  };

  const searchNumber = async (values) => {
    const url = "http://localhost:5000/api/count/" + values.count;
    getData(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <Header>
          <h1 style={{ color: "#FFFFFF" }}>APOD Visualization</h1>
        </Header>
        <Content>
          <h1>Loading...</h1>
        </Content>
        <Footer>Wait please</Footer>
      </Layout>
    );
  }
  return (
    <Layout>
      <Header>
        <h1 style={{ color: "#FFFFFF" }}>APOD Visualization</h1>
      </Header>
      <Content style={{ margin: "24px 16px 0" }}>
        <Row justify="center">
          <Col span={8}>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={searchDate}
            >
              <Form.Item name="date" label="Fecha" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Buscar
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={8}>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={searchRange}
            >
              <Form.Item
                name="range"
                label="Rango de Fechas"
                rules={[{ required: true }]}
              >
                <RangePicker />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Buscar
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={8}>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={searchNumber}
            >
              <Form.Item
                name="count"
                label="Numero exacto"
                rules={[{ required: true }]}
              >
                <InputNumber max={1000} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Buscar
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Pagination
              defaultCurrent={1}
              onChange={handleChange}
              total={data.length}
              defaultPageSize={12}
            ></Pagination>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {data.length > 0 &&
            data.slice(minValue, maxValue).map((register, i) => {
              return (
                <Col span={6} key={i}>
                  <Card
                    hoverable
                    style={{
                      maxHeight: 400,
                    }}
                    cover={
                      <img
                        alt={register.title}
                        src={
                          register.hdurl
                            ? register.hdurl
                            : register.thumbnail_url
                        }
                        style={{
                          maxHeight: 300,
                        }}
                      />
                    }
                  >
                    <Meta
                      title={register.title}
                      description={register.copyright}
                    ></Meta>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Content>

      <Footer>Made with love by Juanes Rios</Footer>
    </Layout>
  );
}

export default App;
