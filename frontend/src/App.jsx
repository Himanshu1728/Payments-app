import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard2 from './pages/Dashboard2';
import LandingPage from './pages/LandingPage';
import Request from './pages/Request';
import SendMoney from './pages/SendMoney';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/request" element={<Request />} />
        {/* Optional: Catch-all route for 404 */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
