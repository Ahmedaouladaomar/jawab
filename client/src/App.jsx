import './App.scss';
import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HOME, LOGIN, PROFILE, REGISTER, VERIFICATION } from './pages/routes';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/Header';
import Guard from './guard';
import Register from './pages/Register';
import Verification from './pages/Verification';

function App() {
  return (
      <Router>
        <Routes>
          <Route path={LOGIN} element={<Login />}/>
          <Route path={REGISTER} element={<Register />}/>
          <Route path={VERIFICATION} element={<Verification />}/>
          <Route path='*' element={
            <Guard>
              <Header />
              <Routes>
                <Route path={HOME} element={<Home />}/>
                <Route path={PROFILE} element={<Profile />}/>
              </Routes>
            </Guard>
          }
          />
        </Routes>
      </Router>
  )
}

export default App
