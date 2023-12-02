

var searchArea = document.querySelector(".search-area");
var cityInput = document.querySelector("#inlineFormInputCityName");

var pastSearchArea = $("#past-search");
var oneDayArea = $("#one-day");
var fiveDayArea = $("#five-day");

let searchHistory = JSON.parse(localStorage.getItem("city-search")) || [];



function citySearch(cityName){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=65a04a7f24adaeb91e134ca4aa8960a0&units=imperial`)
  .then(function (response){
    return response.json()
  })
  .then(function (data){
    
    searchHistory.push(cityName)
    localStorage.setItem('city-search', JSON.stringify(searchHistory))

    var cityLat = data.coord.lat
    var cityLon = data.coord.lon
    var today = dayjs.unix(data.dt)

    
    oneDayArea.html("")
    var oneDayDisplay = `
    <div class="forecast-box col-2">
      <h4>${cityName} ${today.format("M/D/YYYY")}</h4>
      <div><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></div>
      <div><p>Temp: ${data.main.temp}F</p></div>
      <div><p>Wind: ${data.wind.speed} MPH</p></div>
      <div><p>Humidity: ${data.main.humidity}%</p></div>
    </div>`

    oneDayArea.append(oneDayDisplay)

    fiveDayRender(cityLat, cityLon)
    displayHistory()
  })
}


function fiveDayRender(cityLat, cityLon){
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=65a04a7f24adaeb91e134ca4aa8960a0&units=imperial`)
  .then(function (response){
    return response.json()
  })
  .then(function(info){
    
  fiveDayArea.html("")
  for(var x=0; x < info.list.length; x++){
    if(x===5 || x===13 || x===21 || x===29 || x===37){
      var fiveDayDisplay = `
      <div class="col-2 forecast-box" >
        <h4>${dayjs.unix(info.list[x].dt).format("M/D/YYYY HH:mm")}</h4>
        <div><img src="https://openweathermap.org/img/wn/${info.list[x].weather[0].icon}.png"  alt="${info.list[x].weather[0].description}"></div>
        <div><p>Temp: ${info.list[x].main.temp}F</p></div>
        <div><p>Wind: ${info.list[x].wind.speed} MPH</p></div>
        <div><p>Humidity: ${info.list[x].main.humidity}%</p></div>
      </div>`

      fiveDayArea.append(fiveDayDisplay)
      }
    }
  })
}

function displayHistory(){

  pastSearchArea.html("")
  
  for(x=0; x<searchHistory.length; x++){
    var searchRender = `
    <button type="submit" value="${searchHistory[x]}" class="btn btn-primary history-button">${searchHistory[x]}</button>`

    pastSearchArea.append(searchRender)
  }
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

pastSearchArea.on("click", function(event){
  event.preventDefault();
  if(event.target.matches(".history-button")){
    console.log(event.target.value)
    var cityName = event.target.value;
    if(cityName === "" || cityName === null){
      alert(`oi, you didn't put anything in`)
    }else{
      citySearch(cityName)
    }
  }
})

displayHistory()