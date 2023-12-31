import { useEffect, useState } from 'react';
import './App.css';
import Logo from './components/Logo';
import $ from 'jquery'
import Home from './components/Home';
import { Pallete0 } from './constants';
import "./components/ResponsiveScriptScale.js"

function App() {
const [loaded, setLoaded] = useState(false)
const [postloaded, setPostloaded] = useState(true)
const dc = $( document ).ready();

const win = $( window ).on( "load");



useEffect(() => {
  if(JSON.parse(localStorage.getItem('Pallete')) === null || JSON.parse(localStorage.getItem('Pallete')) === ""){
    window.localStorage.setItem("Pallete", JSON.stringify(Pallete0))
    window.dispatchEvent(new Event("Pallete"))
  }
})

setTimeout(()=>{
  if(dc && win){
    //console.log('nigndsjfnd')
    setLoaded(true)
    postload()
    
  }
},1000)

const postload = () => {
  setTimeout(()=>{
    setPostloaded(false)
    
  },100)
  
}
  if(loaded === false){
    return (
      <div className="w-full h-[100vh] flex flex-col">
        <div className='h-full w-full flex justify-center items-center'>
          <Logo loaded={false}/>
        </div>
        <div className='text-[16px] font-Poppins font-bold text-[#ACB1D6] w-full text-center mb-4'>Loading..</div>
      </div>
    );
  }else{
    return (
      <Home anim={postloaded}/>
    );
  }
  
}

export default App;
