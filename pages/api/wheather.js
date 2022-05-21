import axios from "axios";

const Weather = () => {
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
      url: "https://api.weatherapi.com/v1/search.json?key=b8f2fcfa73144c96a35123148222105&q=Lopburi",
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
};

export default Weather;
