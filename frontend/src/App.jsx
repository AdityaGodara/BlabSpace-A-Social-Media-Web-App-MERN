import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import GangInfo from './Pages/GangInfo'
import CreateGang from './Pages/CreateGang'
import YourGang from './Pages/YourGang';
import PostInfo from './Pages/PostInfo';
import AllGangs from './Pages/AllGangs';

function App() {

  const isTokenAvail = window.localStorage.getItem("isToken")

  return (
    <div className='body'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isTokenAvail ? <Home /> : <Login />}/>
          <Route path="/login" element={isTokenAvail ? <Home /> : <Login/>} />
          <Route path="/register" element={isTokenAvail ? <Home /> : <Register/>} />
          <Route path="/gang/info/:id" element={isTokenAvail ? <GangInfo /> : <Login/>} />
          <Route path="/gang/new-gang" element={isTokenAvail ? <CreateGang /> : <Login/>} />
          <Route path="/your-space" element={isTokenAvail ? <YourGang /> : <Login/>} />
          <Route path="/post/info/:id" element={isTokenAvail ? <PostInfo /> : <Login/>} />
          <Route path="/gang/all-gangs" element={isTokenAvail ? <AllGangs /> : <Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;