
// Declaring global variables, namely document selectors
// Both standard JS and jquery is used
var searchArea = document.querySelector(".search-area");
var cityInput = document.querySelector("#inlineFormInputCityName");

var pastSearchArea = $("#past-search");
var oneDayArea = $("#one-day");
var fiveDayArea = $("#five-day");

// Here is where local storage is grabbed
let searchHistory = JSON.parse(localStorage.getItem("city-search")) || [];

// This function is called when the user clicks either the submit button, or a past search button. It renders out the current forecast before passing on info to a second function to render the 5-day forecast, as well as tell the search history to update
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

// This function renders out the 5-day forecast. The specified value for 'x' in the for loop corresponds to noon for each of the five days in the response from the API
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

// This is where the rendering out of the search history happens
function displayHistory(){

  pastSearchArea.html("")
  
  for(x=0; x<searchHistory.length; x++){
    var searchRender = `
    <div class="col-2">
      <button type="submit" value="${searchHistory[x]}" class="btn btn-primary history-button">${searchHistory[x]}</button>
    </div>`

    pastSearchArea.append(searchRender)
  }
}

// This event listener listens to the submit button and confirms the user put in something into the field
searchArea.addEventListener("click", function(event){
  event.preventDefault();
  if(event.target.matches(".search-button")){
    var city = cityInput;
    var cityName = city.value;
    if(cityName === ""){
      alert(`I'm not seeing a city name, please try again`)
    }else{
      citySearch(cityName)
    }
  }
})

// This jquery event listener listens for a search history button click and sends the value tag of the button off to the citySearch function to run the fetch
pastSearchArea.on("click", function(event){
  event.preventDefault();
  if(event.target.matches(".history-button")){
    console.log(event.target.value)
    var cityName = event.target.value;
    if(cityName === ""){
      alert(`I can't read this input, try again`)
    }else{
      citySearch(cityName)
    }
  }
})

// This just displays the search history based off of the local storage upon loading the page
displayHistory()