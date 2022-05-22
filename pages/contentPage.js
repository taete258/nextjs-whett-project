import { Card, Grid, Text, useTheme, Input, Col, Row } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import iconJson from "../assets/iconData.json";

const MockItem = (data) => {
  const { isDark, theme } = useTheme();
  return (
    <Card
      style={{
        height: data.height || 150,
        backgroundColor: isDark ? "#fff" : theme.colors.blue600.value,
      }}
    >
      <Text h6 size={15} color={isDark ? "#000" : "#fff"} css={{ mt: 0 }}>
        {data.text}
      </Text>
    </Card>
  );
};

const getWeather = async (params) => {
  const options = {
    url: `https://api.weatherapi.com/v1/current.json?key=b8f2fcfa73144c96a35123148222105&q=${params}&aqi=yes`,
  };

  const response = await axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  return response;
};

const search = async (params) => {
  const options = {
    url: `https://api.weatherapi.com/v1/search.json?key=b8f2fcfa73144c96a35123148222105&q=${params}`,
  };

  const response = await axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  console.log(response);
  return response;
};

const searchResult = (query) =>
  query.map((e, i) => {
    return {
      value: e.name + ", " + e.country,
      label: (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            color: "#1890ff",
          }}
        >
          {e.name}, {e.country}
        </div>
      ),
    };
  });

export default function ContentPage(props) {
  const { isDark, theme } = useTheme();

  const [location, setLocaton] = useState({
    lat: 0,
    lon: 0,
  });

  const [dataWheather, setDataWheather] = useState([]);
  const [listLocation, setListLocation] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectLocation, setSelectLocation] = useState("");
  const handleSearch = async (value) => {
    setSearchKey(value);
    setListLocation(value && searchResult(await search(value)));
  };

  const onLoad = async () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocaton({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
    let data = await getWeather(location.lat + "," + location.lon);
    setDataWheather(data);
    setSelectLocation(data.location.name + ", " + data.location.country);
  };
  const geticon = () => {
    let url =
      "/icon/" +
      iconJson.find((x) => x.code == dataWheather.current.condition.code).icon +
      ".png";
    return url;
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <div>
        <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
          <Grid sm={12} md={12} xs={12}>
            <h1
              className={styles.title}
              style={{
                color: isDark
                  ? theme.colors.white.value
                  : theme.colors.black.value,
              }}
            >
              <span>Welcome to</span>
              <span
                size={60}
                style={{
                  backgroundColor: "#fff",
                  color: theme.colors.blue600.value,
                  borderRadius: 10,
                  fontWeight: "700",
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginLeft: 15,
                }}
              >
                Whett
              </span>
            </h1>
          </Grid>
        </Grid.Container>

        <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
          <Grid sm={10} md={12} xs={10}>
            <Input
              clearable
              rounded
              shadow
              bordered
              size="lg"
              status={"primary"}
              label="Location"
              placeholder="Location Name"
              width="100%"
              contentLeftStyling={true}
              contentLeft={
                <div style={{ fontSize: 22 }}>
                  <i className="bx bx-search" />
                </div>
              }
              value={selectLocation.name}
              onChange={(event) => {
                setSearchKey(event.target.value);
              }}
              onKeyPress={async (event) => {
                if (event.key === "Enter") {
                  setListLocation(
                    event.target.value &&
                      searchResult(await search(event.target.value))
                  );
                  console.log(listLocation);
                }
              }}
            />
          </Grid>
          {listLocation.length > 0 && (
            <Grid
              sm={6}
              md={12}
              xs={10}
              css={{
                backgroundColor: isDark
                  ? theme.colors.black.value
                  : theme.colors.white.value,
                borderRadius: 25,
                boxShadow: "$md",
                border: "$space$1 solid $gray400",
                position: "absolute",
                top: 430,
                zIndex: 1,
                width: 500,
              }}
            >
              <div
                style={{
                  flexDirection: "row",
                }}
              >
                {listLocation.map((e, i) => {
                  return (
                    <div
                      key={i}
                      style={{ cursor: "pointer", padding: 5 }}
                      onClick={async () => {
                        console.log(e);
                        let data = await getWeather(e.value);
                        setDataWheather(data);
                        setSelectLocation(e.value);
                        setListLocation([]);
                      }}
                    >
                      {e.label}
                    </div>
                  );
                })}
              </div>
            </Grid>
          )}
        </Grid.Container>

        {selectLocation && (
          <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
            <Grid sm={11} md={12} xs={11}>
              <Card
                style={{
                  height: "auto",
                  backgroundColor: isDark ? "#fff" : theme.colors.blue600.value,
                }}
              >
                <Col justify="flex-start" align="center">
                  <Text
                    size={26}
                    color={isDark ? "#000" : "#fff"}
                    css={{ mt: 0 }}
                  >
                    {dataWheather.location.region},{" "}
                    {dataWheather.location.country}
                  </Text>
                  <img width={80} height={80} src={geticon()} />
                  <Text
                    h6
                    size={35}
                    color={isDark ? "#000" : "#fff"}
                    css={{ mt: 0 }}
                  >
                    {dataWheather.current.temp_c} °C
                    {/* {" / "}
                    {dataWheather.current.temp_f} °F */}
                  </Text>
                  <Text
                    size={30}
                    color={isDark ? "#000" : "#fff"}
                    css={{ mt: 0 }}
                  >
                    {dataWheather.current.condition.text}
                  </Text>
                </Col>
              </Card>
            </Grid>
          </Grid.Container>
        )}
      </div>
    </>
  );
}
