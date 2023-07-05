let searchHistory = [];
let prevCity = "";

let citySearch = function (event) {
  event.preventDefault();
  let city = $("#cityInput").val();
  if (city) {
    getWeather(city);
    $("#cityInput").val("");
  }
};

function getWeather(cityName) {
  let requestURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=4c808a8ff9cb2bd78ffe2263a133da00";
  fetch(requestURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayData(data);
      });
    }
  });
}

function displayData(data) {
  $("#cityName")
    .text(data.name + "(" + dayjs(data.dt * 1000).format("MM/DD/YYYY") + ")")
    .append(
      `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></img>`
    );
  $("#cityTemp").text("AIR HOT: " + data.main.temp.toFixed(1) + "°F");
  $("#cityHumid").text("AIR WET: " + data.main.humidity + "%");
  $("#cityWind").text("AIR FAST: " + data.wind.speed.toFixed(1) + " mph");

  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      data.name +
      "&appid=4c808a8ff9cb2bd78ffe2263a133da00&units=imperial"
  ).then(function (response) {
    response.json().then(function (data) {
      $("#future").empty();
      for (i = 7; i <= data.list.length; i += 8) {
        let futureCard =
          `
                    <section class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <section class="card-body p-1">
                            <h5 class="card-title">` +
          dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") +
          `</h5>
                            <img src="https://openweathermap.org/img/wn/` +
          data.list[i].weather[0].icon +
          `.png" alt="conditions">
                            <p class="card-text">HOT: ` +
          data.list[i].main.temp +
          `</p>
                            <p class="card-text">WET: ` +
          data.list[i].main.humidity +
          `</p>
                        </section>
                    </section>
                    `;
        $("#future").append(futureCard);
      }
    });
  });
  prevCity = data.name;
  saveHistory(data.name);
}

function saveHistory(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    $("#searchHistory").append(
      "<br><a href='#' class='list-group-item list-group-item-action' id=" +
        cityName +
        ">" +
        cityName +
        "</a></br>"
    );
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  localStorage.setItem("prevCity", JSON.stringify(prevCity));
  getHistory();
}

function getHistory() {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  getHistory = JSON.parse(localStorage.getItem("prevCity"));
  if (!searchHistory) {
    searchHistory = [];
  }
  if (!prevCity) {
    prevCity = "";
  }
  $("#searchHistory").empty();
  for (i = 0; i < searchHistory.length; i++) {
    $("#searchHistory").append(
      "<br><a href='#' class='list-group-item list-group-item-action' id=" +
        searchHistory[i] +
        ">" +
        searchHistory[i] +
        "</a></br>"
    );
  }
}

$("#searchForm").submit(citySearch);
$("#searchHistory").on("click", function (event) {
  let historyCity = $(event.target).closest("a").attr("id");
  getWeather(historyCity);
});
