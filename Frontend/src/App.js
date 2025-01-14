import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAvatar from './components/SetAvatar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Use lowercase for paths unless you specifically want them uppercase */}
        <Route path="/" element={<Register />} />  {/* lowercase */}
        <Route path="/login" element={<Login />} />        {/* lowercase */}
        <Route path="/setAvatar" element={<SetAvatar />} />        {/* lowercase */}
        <Route path="/chat" element={<Chat />} />          {/* lowercase */}
      </Routes>
    </BrowserRouter>
  );
}
