let city="tenkasi";
let container=document.querySelector(".container")
let apikey="c94afd9f90bda3adc26cac08109f742c"
// c94afd9f90bda3adc26cac08109f742c
let apiurl=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`
let tempDataset=[];
let windDataset=[];


google.charts.load('current', {packages: ['corechart', 'line']});

function drawBackgroundColor() {

    //   temperture dataset and graph
      var tempData = new google.visualization.DataTable();
      tempData.addColumn('string', 'time');
      tempData.addColumn('number', 'temperature');
      

      tempData.addRows(tempDataset);

      var tempOptions = {
        width:1350,
        height:300,
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Temperature'
        },
        backgroundColor: ''
    };
    var tempChart = new google.visualization.LineChart(document.getElementById('temp_chart_div'));
    tempChart.draw(tempData, tempOptions);



    //   wind dataset and graph
      var windData = new google.visualization.DataTable();
      windData.addColumn('string', 'time');
      windData.addColumn('number', 'wind');

      windData.addRows(windDataset);

      var windOptions = {
        width:1350,
        height:300,
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Wind'
        },
        backgroundColor: ''
      };

      var windChart = new google.visualization.LineChart(document.getElementById('wind_chart_div'));
      windChart.draw(windData, windOptions);
}

//--------------------------------------getting  data on temperature for a list of time interval---------------------------------------------------
function displayWeather(weatherList){
    for(item of weatherList){
        tempDataset.push([ item.dt_txt.split(" ")[1],item.main.temp])
        windDataset.push([item.dt_txt.split(" ")[1],item.wind.speed])
    }
    google.charts.setOnLoadCallback(drawBackgroundColor);

}

//-----------------------------------getting location of background-------------------------------------------
function getBackground(location){
    let mapelem=
                `
                <div class="gmap_canvas">
                    <iframe class="gmap_iframe" width="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=${location}&amp;t=p&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                </div>
                `
    document.querySelector(".mapouter").innerHTML=mapelem
}


// ----------------------------------------display all time weather------------------------------------------------

function alltimeweather(list){
  let vid;
  for(item of list){
      let weathercondition=item.weather[0].main;
      let weatherdesc=item.weather[0].description;
     if(weathercondition=="Clouds"){
      if(weatherdesc=="scattered clouds" || weatherdesc=="clear sky"){
        vid="./assests/clearskyi.png"
      }
      else if(weatherdesc=="overcast clouds"){
       vid="./assests/overcastcloudi.png"
      }
      else{
       vid="./assests/fewcloudsi.png"
      }
     }
     else if(weathercondition=="Rain"){
      if(weatherdesc=="light rain"){
        vid="./assests/lightraini.png"
      }
      else{
        vid="./assests/heavyraini.png"
      }
     }
     else if(weathercondition=="Snow"){
      vid="./assests/snowflakei.png"
     }
     else{
      vid="./assests/windi.png"
     }
     let tempelem=`<div class="temp_list">
     <p>${item.dt_txt}</p>
     <p>temp:${item.main.temp}</p>
     <img src=${vid} autoplay muted loop></img>
     <p>wind speed:${item.wind.speed}</p>
      </div>`
      container.innerHTML+=tempelem

  } 
}

// display main weather info

async function maindata(){

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
  .then((res)=>res.json())
  .then((data)=>{
    let vid;
    let weathercondition=data.weather[0].main;
    let weatherdesc=data.weather[0].description;
    if(weathercondition=="Clouds"){
      if(weatherdesc=="scattered clouds"){
        vid="./assests/clearsky.mp4"
      }
      else if(weatherdesc=="overcast clouds"){
       vid="./assests/overcastcloud.mp4"
      }
      else{
       vid="./assests/fewclouds.mp4"
      }
     }
     else if(weathercondition=="Rain"){
      if(weatherdesc=="light rain"){
        vid="./assests/lightrain.mp4"
      }
      else{
        vid="./assests/heavyrain.mp4"
      }
     }
     else if(weathercondition=="Snow"){
      vid="./assests/snowflake.mp4"
     }
     else{
      vid="./assests/wind.mp4"
     }
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    let maindisplayelem=`
    <div class="imginfo">
    <h1>${data.main.temp}<span>&#8451</span></h1>
    <video src=${vid} muted autoplay loop></video>
    </div> 
    <h1>${data.name}</h1>
    <h1>${datetime}</h1>
    <h1>humidity: ${data.main.humidity}</h1>
    <h1>minimum temperatre: ${data.main.temp_min}</h1>
    <h1>maximum temperature: ${data.main.temp_max}</h1>
    `
    console.log(data)
    document.querySelector(".info").innerHTML=maindisplayelem
    // <h1>ground level: ${data.main?.grnd_level}</h1>
    // <h1>sea level: ${data.main?.sea_level}</h1>
  
  })
}

// --------------------------------------------------------getting data----------------------------------------------
async function searching(city,apikey){
  maindata(city)
    fetch(apiurl)
        .then((Response) => Response.json())
        .then((data) => {
            if(data.cod>=400){
                console.log("place not found",data.cod)
            }
            else{
                console.log(data)};
                displayWeather(data.list)
                alltimeweather(data.list)
                getBackground(city)
                // region=data.city.name
                // temp=data.list[0].main.temp
                

            }
        )
}

// ----------default--------------
searching("tenkasi",apikey)

let form=document.querySelector("form")
form.addEventListener("submit",(e)=>{
  e.preventDefault()
  let inp=document.querySelector("#inputbox")
  if(inp.value==""){
    alert("please enter a city name !!")
  }
  else{
    city=inp.value
    container.innerHTML=""
    searching(city,apikey);
  }
})




