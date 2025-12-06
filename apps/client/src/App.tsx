import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
