import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { useLocation } from 'react-router-dom';

const Auth = () => {
  const data = JSON.stringify({access_token: localStorage.getItem('at')})
  var auth;

    

  if (process.env.NODE_ENV == 'production') {
    auth = "https://api.srv45036.seohost.com.pl/api/auth"
  } else {
    auth = "http://localhost:3003/api/auth"
  }

  if(localStorage.getItem('at') !== null){
    console.log(data, "reload data")
    $.ajax({
        url:auth,
        type:"POST",
        data: data,
        crossDomain: true,
        headers: {
        "accept": "application/json",
        "Access-Control-Allow-Origin":"*"
        },
        xhrFields: {cors: false},
        contentType:"application/json; charset=utf-8",
        dataType:"json",
    })
    .then((res)=>{
      console.log(res)
      if(res){
        localStorage.setItem("at",res.at)
        localStorage.setItem("rt",res.rt)
        return res
      } 
    })
  }
  
  
}

export default Auth