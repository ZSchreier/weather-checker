

var searchArea = document.querySelector(".search-area");
var cityInput = document.querySelector("#inlineFormInputCityName");

var pastSearchArea = $("#past-search");
var oneDayArea = $("#one-day");
var fiveDayArea = $("#five-day");



function citySearch(cityName){
  event.preventDefault()
  console.log(cityName)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=65a04a7f24adaeb91e134ca4aa8960a0&units=imperial`)
  .then(function (response){
    return response.json()
  })
  .then(function (data){
    var cityLat = data.coord.lat
    var cityLon = data.coord.lon
    var today = dayjs.unix(data.dt)

    
    oneDayArea.html("")
    var oneDayDisplay = `
    <h4>${cityName} ${today.format("M/D/YYYY")}</h4>
    <div><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></div>
    <div><p>Temp: ${data.main.temp}F</p></div>
    <div><p>Wind: ${data.wind.speed} MPH</p></div>
    <div><p>Humidity: ${data.main.humidity}%</p></div>`

    oneDayArea.append(oneDayDisplay)
  })
}

searchArea.addEventListener("click", function(event){
  event.preventDefault();
  if(event.target.matches(".search-button")){
    var city = cityInput;
    var cityName = city.value;
    if(cityName === ""){
      alert(`oi, you didn't put anything in`)
    }else{
      citySearch(cityName)
    }
  }
})