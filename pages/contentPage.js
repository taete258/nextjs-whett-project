import { Grid, Text, useTheme, Col, Image } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import iconJson from '../assets/iconData.json';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useTheme as useNextTheme } from 'next-themes';

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
  console.log(response);

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

  const onLoad = async () => {
    const hours = new Date().getHours();
    const isDayTime = hours > 6 && hours < 20;
    setTheme(isDayTime ? 'light' : 'dark');

    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        let data = await getWeather(
          position.coords.latitude + ',' + position.coords.longitude
        );
        setDataWheather(data);
        setSelectLocation(
          data.location.name + ', ' + data.location.country
        );
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
    let data = await getWeather(item.name);
    setDataWheather(data);
    setSelectLocation(item.name);
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

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <div style={{ minHeight: 300 }}>
        <Grid.Container
          gap={1}
          justify="center"
          style={{ maxWidth: 800 }}
        >
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
          </Grid>
        </Grid.Container>

        <Grid.Container
          gap={1}
          justify="center"
          style={{ maxWidth: 800 }}
        >
          <Grid sm={10} md={12} xs={10}>
            <div style={{ width: '100%' }}>
              <ReactSearchAutocomplete
                styling={{ width: 800, zIndex: 1 }}
                items={listLocation}
                onSearch={handleOnSearch}
                onHover={handleOnHover}
                onSelect={handleOnSelect}
                autoFocus
                formatResult={formatResult}
              />

              <div style={{ marginTop: 20, zIndex: 1 }}>
                {selectLocation && (
                  <Col
                    justify="flex-start"
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
                      size={35}
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
            </div>
          </Grid>
        </Grid.Container>

        <Grid.Container
          gap={1}
          justify="center"
          style={{ maxWidth: 800 }}
        >
          <Grid
            sm={10}
            md={12}
            xs={10}
            style={{ justifyContent: 'space-between' }}
          >
            <Col
              justify="center"
              align="center"
              style={{
                backgroundColor: isDark
                  ? theme.colors.white.value
                  : theme.colors.blue600.value,
                borderRadius: 20,
                padding: 10,

                minHeight: 100,
                width: '48%',
              }}
            >
              <Text>1</Text>
            </Col>
            <Col
              justify="center"
              align="center"
              style={{
                backgroundColor: isDark
                  ? theme.colors.white.value
                  : theme.colors.blue600.value,
                borderRadius: 20,
                padding: 10,
                minHeight: 100,
                width: '48%',
              }}
            >
              <Text>1</Text>
            </Col>
          </Grid>
        </Grid.Container>

        <Grid.Container
          gap={1}
          justify="center"
          style={{ maxWidth: 800 }}
        >
          <Grid
            sm={10}
            md={12}
            xs={10}
            style={{ justifyContent: 'space-between' }}
          >
            <Col
              justify="center"
              align="center"
              style={{
                backgroundColor: isDark
                  ? theme.colors.white.value
                  : theme.colors.blue600.value,
                borderRadius: 20,
                padding: 10,

                minHeight: 100,
                width: '48%',
              }}
            >
              <Text>1</Text>
            </Col>
            <Col
              justify="center"
              align="center"
              style={{
                backgroundColor: isDark
                  ? theme.colors.white.value
                  : theme.colors.blue600.value,
                borderRadius: 20,
                padding: 10,
                minHeight: 100,
                width: '48%',
              }}
            >
              <Text>1</Text>
            </Col>
          </Grid>
        </Grid.Container>

        <Grid.Container
          gap={1}
          justify="center"
          style={{ maxWidth: 800 }}
        >
          <Grid
            sm={10}
            md={12}
            xs={10}
            style={{ justifyContent: 'space-between' }}
          >
            <Col
              justify="center"
              align="center"
              style={{
                backgroundColor: isDark
                  ? theme.colors.white.value
                  : theme.colors.blue600.value,
                borderRadius: 20,
                padding: 10,

                minHeight: 100,
                width: '48%',
              }}
            >
              <Text>1</Text>
            </Col>
            <Col
              justify="center"
              align="center"
              style={{
                backgroundColor: isDark
                  ? theme.colors.white.value
                  : theme.colors.blue600.value,
                borderRadius: 20,
                padding: 10,
                minHeight: 100,
                width: '48%',
              }}
            >
              <Text>1</Text>
            </Col>
          </Grid>
        </Grid.Container>
      </div>
    </>
  );
};

export default ContentPage;
