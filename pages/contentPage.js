import {
  Card,
  Container,
  Grid,
  Text,
  useTheme,
  Input,
  Spacer,
  Button,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

// import Weather from "./api/wheather";

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
    method: "GET",
    url: "https://weatherbit-v1-mashape.p.rapidapi.com/current",
    headers: {
      "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com",
      "X-RapidAPI-Key": "0feeca8649mshfafbef702e63449p147c60jsn28830813af0f",
    },
    params: {
      lon: "100.877808",
      lat: "14.646118000000001",
      units: "metric",
      lang: "en",
    },
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
  console.log(params);
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

  const getWeatherData = async () => {
    let data = await Weather.getWeather(location);
    setDataWheather(data);
    console.log(data);
  };

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(function (position) {
    //   setLocaton({
    //     lat: position.coords.latitude,
    //     lon: position.coords.longitude,
    //   });
    // });
    // console.log("test");
    // getWeatherData();
    // console.log(search("test"));
  }, []);

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>Whett</a>
        </h1>

        <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
          <Grid sm={6} md={12} xs={8}>
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
                  setListLocation(await search(searchKey));
                  console.log(listLocation);
                }
              }}
            />
          </Grid>
          <Grid sm={6} md={12} xs={6}>
            {listLocation.length > 0 && (
              <Card
                style={{
                  flexDirection: "row",
                }}
              >
                {listLocation.map((e, i) => {
                  return (
                    <>
                      <Button
                        light
                        color="primary"
                        onClick={() => {
                          setSelectLocation(e);
                          setListLocation([]);
                        }}
                      >
                        <i className="bx bxs-map" /> {e.name}, {e.country}
                      </Button>
                      <Spacer y={0.3} />
                    </>
                  );
                })}
              </Card>
            )}
          </Grid>
        </Grid.Container>

        {selectLocation && (
          <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
            <Grid sm={6} md={12} xs={8}>
              {/* {dataWheather} */}
              <Card
                style={{
                  height: 250,
                  backgroundColor: isDark ? "#fff" : theme.colors.blue600.value,
                }}
              >
                <Text
                  h6
                  size={40}
                  color={isDark ? "#000" : "#fff"}
                  css={{ mt: 0 }}
                >
                  {selectLocation.name}
                </Text>
                <Text
                  h6
                  size={40}
                  color={isDark ? "#000" : "#fff"}
                  css={{ mt: 0 }}
                >
                  {selectLocation.country}
                </Text>
                <Text
                  size={60}
                  color={isDark ? "#000" : "#fff"}
                  css={{ mt: 0 }}
                >
                  <i className="bx bx-sun"></i>
                </Text>
              </Card>
            </Grid>
          </Grid.Container>
        )}

        {dataWheather.length > 0 && (
          <>
            <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
              <Grid xs={8} sm={6}>
                <MockItem text={"111"} />
              </Grid>
              <Grid xs={8} sm={6}>
                <MockItem text={"222"} />
              </Grid>
            </Grid.Container>

            <Grid.Container gap={2} justify="center" style={{ maxWidth: 800 }}>
              <Grid xs={8} sm={6}>
                <MockItem text={"333"} />
              </Grid>
              <Grid xs={8} sm={6}>
                <MockItem text={"444"} />
              </Grid>
            </Grid.Container>
          </>
        )}
      </main>
    </>
  );
}
