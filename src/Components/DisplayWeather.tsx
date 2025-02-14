import React from 'react'
import { CiSearch } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { FaCloudSun } from "react-icons/fa";
import { IoIosCloudy } from "react-icons/io";
import { FaCloudRain } from "react-icons/fa6";
import { FaSun } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { IoPartlySunny } from "react-icons/io5";
import axios from 'axios'

interface weatherDataProps{
    name:string;

    main:{
        temp:number,
        humidity:number
    },
    sys:{
        country:string,
    },
    weather:{
  main:string;
    },
    wind:{
        speed:number
    }
}


function DisplayWeather() {
    const api_key= '6ee55f19dcecd4664a9598638cc45fae';
    const api_Endpoint ='https://api.openweathermap.org/data/2.5/'
    const [weatherData,setWeatherData] = React.useState<weatherDataProps | null >(null)
    const [isLoading,setIsLoading] = React.useState(false);
    const [searchCity,setSearchCity] = React.useState('');

    const fetchData = async(lat:number,lon:number)=>{
       const url =`${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`  
    const response = await axios.get(url);
    return response.data;
    }

    const fetchWeatherData = async(city:string)=>{
       try{
        const url= `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`
      const searchResponse = await axios.get(url);
      const currentSearcResults : weatherDataProps = searchResponse.data
       return {currentSearcResults}
    }
    catch(error){
       console.error('No Data Found');
       throw error;
       
    }
    }

    const handleSubmit = async()=>{
     if(searchCity.trim()=== ""){
        return;
     }

     try{
        const {currentSearcResults} = await fetchWeatherData(searchCity);
        setWeatherData(currentSearcResults)
     }catch(error){
console.error('No Results Found');

     }

    }

    const iconChanger = (weather:string)=>{
        let iconElememt :React.ReactNode;
        let iconColor:string;

        switch(weather){
            case'Rain':
            iconElememt = <FaCloudRain/>
            iconColor="#272829";
            break;

            case'Clear':
            iconElememt= <FaSun/>
            iconColor="#FFC436";
            break;

            case'Clouds':
            iconElememt = <IoIosCloudy/>
            iconColor="#FFC436";
            break;

            case'Mist':
            iconElememt = <FaCloudSun/>
            iconColor="#279EFF";
            break;


            default:iconElememt =<IoPartlySunny/>
            iconColor="#7B2869"
        }

        return <span className='icon' style={{color:iconColor}}>
           {iconElememt}
        </span>
    }


    React.useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude,longitude} = position.coords;
            Promise.all([fetchData(latitude,longitude)]).then(
                ([currentWeather]) =>{
                    setWeatherData(currentWeather);
                    setIsLoading(true)
                    console.log(currentWeather);
                    
                    
                }
            )
        })
    },[])
  return (
    <div>
        <div className="maincontainer">
            <div className="searchArea">
             <input type='text' placeholder='Enter a city...'
             value={searchCity}
             onChange={(e)=> setSearchCity(e.target.value)}
             ></input>   
             <CiSearch   className='searchCircle' onClick={handleSubmit}/>
            </div>
        {
            weatherData && isLoading? (
                <>
                        <div className="weatherArea">
                <h1>{weatherData.name}</h1>
                <span>{weatherData.sys.country}</span>
                <div className="icon">
           {weatherData?.weather?.[0]?.main && iconChanger(weatherData.weather[0].main)}
            </div>

             <div><h2>{weatherData.main.temp} </h2>
             <h4>{weatherData.weather[0].main}</h4></div> 
              
          
             
            </div>

        <div className="bottomArea">
            <div className="humidityLevel">
            <WiHumidity className='humidinfo' />
             <h1>{weatherData.main.humidity}%</h1>
             <p>Humidity</p></div>
        </div>

        <div className="wind">
        <FaWind  className='windIcon'/>
        <h1>{weatherData.wind.speed}</h1>
        <p>Wind Speed</p>
        </div>
  </>
            ):(
                <div className="loading">
               <AiOutlineLoading className='loadingIcon'/> 
                </div>
            )
        }
           
    
     
        </div>
    </div>
  )
}

export default DisplayWeather