import {
  Grid,
  Text,
  useTheme,
  Col,
  Image,
  Row,
  Loading,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import iconJson from '../assets/iconData.json';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useTheme as useNextTheme } from 'next-themes';

const getWeather = async (params) => {
  const options = {
    url: `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${params}&aqi=yes`,
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

const search = async (params) => {
  const options = {
    url: `https://api.weatherapi.com/v1/search.json?key=${process.env.API_KEY}&q=${params}`,
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

const searchResult = (query) =>
  query.map((e, i) => {
    return {
      id: i,
      name: e.name + ', ' + e.country,
    };
  });

const ContentPage = (props) => {
  const { isDark, theme } = useTheme();
  const { setTheme } = useNextTheme();
  const [dataWheather, setDataWheather] = useState([]);
  const [listLocation, setListLocation] = useState([]);

  const [selectLocation, setSelectLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const styleObj = {
    miniCard: {
      backgroundColor: isDark
        ? theme.colors.white.value
        : theme.colors.blue600.value,
      borderRadius: 20,
      padding: 10,
      minHeight: 155,
      width: '100%',
      marginBottom: 10,
      title: {
        fontSize: 22,
        color: isDark
          ? theme.colors.black.value
          : theme.colors.white.value,
      },
    },
  };

  const onLoad = async () => {
    const hours = new Date().getHours();
    const isDayTime = hours > 6 && hours < 20;
    setTheme(isDayTime ? 'light' : 'dark');
    setLoading(true);

    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        let data = await getWeather(
          position.coords.latitude + ',' + position.coords.longitude
        );
        setDataWheather(data);
        setSelectLocation(
          data.location.name + ', ' + data.location.country
        );

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    );
  };
  const geticon = () => {
    let url =
      '/icon/' +
      iconJson.find(
        (x) => x.code == dataWheather.current.condition.code
      ).icon +
      '.png';
    return url;
  };

  const handleOnSearch = async (string) => {
    setListLocation(string && searchResult(await search(string)));
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = async (item) => {
    setLoading(true);
    let data = await getWeather(item.name);
    setDataWheather(data);
    setSelectLocation(item.name);
    setLoading(false);
  };

  const formatResult = (item) => {
    return (
      <div>
        <span style={{ display: 'block', textAlign: 'left' }}>
          {item.name}
        </span>
      </div>
    );
  };

  const uvIndex = (item) => {
    if (item >= 0 && item <= 2.9) return 'Low';
    if (item >= 3 && item <= 5.9) return 'Moderate ';
    if (item >= 6 && item <= 7.9) return 'High  ';
    if (item >= 8 && item <= 10.9) return 'Very High ';
    if (item <= 11) return 'Extreme   ';
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      {loading ? (
        <div>
          <Loading size="xl">
            <Text h2>Loading</Text>
          </Loading>
        </div>
      ) : (
        <>
          <div style={{ minHeight: 300 }}>
            <Grid.Container
              gap={1}
              justify="center"
              style={{ maxWidth: 800 }}
            >
              <Grid sm={12} md={12} xs={12}>
                <Col>
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
                        backgroundColor: '#fff',
                        color: theme.colors.blue600.value,
                        borderRadius: 10,
                        fontWeight: '700',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginLeft: 15,
                      }}
                    >
                      Whett
                    </span>
                  </h1>
                  <div
                    style={{
                      width: '100%',
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <ReactSearchAutocomplete
                      styling={{ width: '100%', zIndex: 1 }}
                      items={listLocation}
                      onSearch={handleOnSearch}
                      onHover={handleOnHover}
                      onSelect={handleOnSelect}
                      autoFocus
                      formatResult={formatResult}
                    />
                  </div>
                </Col>
              </Grid>

              <Grid sm={10} md={12} xs={10} lg={6}>
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  {selectLocation && (
                    <Col
                      justify="flex-end"
                      align="center"
                      style={{
                        backgroundColor: isDark
                          ? theme.colors.white.value
                          : theme.colors.blue600.value,
                        borderRadius: 20,
                        padding: 10,
                      }}
                    >
                      <Text
                        size={26}
                        color={isDark ? '#000' : '#fff'}
                        css={{ mt: 0 }}
                      >
                        {dataWheather.location.region},{' '}
                        {dataWheather.location.country}
                      </Text>
                      <Image
                        width={80}
                        height={80}
                        src={geticon()}
                        alt={`image-${dataWheather.current.condition.text.toLowerCase()}`}
                      />
                      <Text
                        size={30}
                        color={isDark ? '#000' : '#fff'}
                        css={{ mt: 0 }}
                      >
                        {dataWheather.current.condition.text}
                      </Text>
                      <Text
                        h6
                        size={33}
                        color={isDark ? '#000' : '#fff'}
                        css={{ mt: 0 }}
                      >
                        {dataWheather.current.temp_c} °C
                        {' / '}
                        {dataWheather.current.temp_f} °F
                      </Text>
                    </Col>
                  )}
                </div>
              </Grid>

              {selectLocation && (
                <Grid
                  sm={10}
                  md={12}
                  xs={10}
                  lg={6}
                  style={{ justifyContent: 'center' }}
                >
                  <Row
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col style={{ width: '48%' }}>
                      <div style={styleObj.miniCard}>
                        <Text style={styleObj.miniCard.title}>
                          <i className="bx bx-sun" /> UV
                        </Text>
                        <Text
                          style={{
                            fontSize: 26,
                            color: isDark
                              ? theme.colors.black.value
                              : theme.colors.white.value,
                            textAlign: 'center',
                          }}
                        >
                          {dataWheather.current.uv}
                          <Text
                            style={{
                              fontSize: 20,
                              color: isDark
                                ? theme.colors.black.value
                                : theme.colors.white.value,
                            }}
                          >
                            {uvIndex(dataWheather.current.uv)}
                          </Text>
                        </Text>
                      </div>
                      <div style={styleObj.miniCard}>
                        <Text style={styleObj.miniCard.title}>
                          <i className="bx bx-wind" /> wind
                        </Text>
                        <Text
                          style={{
                            fontSize: 26,
                            color: isDark
                              ? theme.colors.black.value
                              : theme.colors.white.value,
                            textAlign: 'center',
                          }}
                        >
                          {dataWheather.current.wind_kph}
                          <Text
                            style={{
                              fontSize: 20,
                              color: isDark
                                ? theme.colors.black.value
                                : theme.colors.white.value,
                            }}
                          >
                            Km/h
                          </Text>
                        </Text>
                      </div>
                    </Col>
                    <Col style={{ width: '48%' }}>
                      <div style={styleObj.miniCard}>
                        <Text style={styleObj.miniCard.title}>
                          <i className="bx bx-tachometer" /> Pressure
                        </Text>
                        <Text
                          style={{
                            fontSize: 26,
                            color: isDark
                              ? theme.colors.black.value
                              : theme.colors.white.value,
                            textAlign: 'center',
                          }}
                        >
                          {dataWheather.current.pressure_mb}
                          <Text
                            style={{
                              fontSize: 20,
                              color: isDark
                                ? theme.colors.black.value
                                : theme.colors.white.value,
                            }}
                          >
                            hPa
                          </Text>
                        </Text>
                      </div>
                      <div style={styleObj.miniCard}>
                        <Text style={styleObj.miniCard.title}>
                          <i className="bx bxs-thermometer" />
                          Feel Like
                        </Text>
                        <Text
                          style={{
                            fontSize: 26,
                            color: '#fff',
                            textAlign: 'center',
                          }}
                        >
                          {dataWheather.current.temp_c} °C
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#fff',
                            }}
                          >
                            {dataWheather.current.temp_f} °F
                          </Text>
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Grid>
              )}
            </Grid.Container>
          </div>
        </>
      )}
    </>
  );
};

export default ContentPage;
