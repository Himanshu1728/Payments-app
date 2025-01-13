
import Dashboard from './pages/Dashboard';
import Dashboard2 from './pages/Dashboard2';
import LandingPage from './pages/LandingPage';
import Request from './pages/Request';
import SendMoney from './pages/SendMoney';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/request" element={<Request />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
