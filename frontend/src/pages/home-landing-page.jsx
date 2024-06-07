import './App.css';
import React from 'react'
import HeaderComponent from '../components/header-component';
import FooterComponent from '../components/footer-component';
import CarouselComponent from '../components/carousel-component';
import AdminStaffComponent from '../components/admin-staff-component';
import '../Gimri.css'


const homeLandingPage = () => {
  return (
    <div className="App">
      <title>PICSEL</title>
      <HeaderComponent/>
      <CarouselComponent/>
      <AdminStaffComponent/>
      <FooterComponent/>
      {/* <h1>PICSEL</h1>
      <h2>PICSEL: Platform for Institute of Computer Science Scheduling, Events, and Logistics</h2>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link> */}
    </div>
  );
}

export default homeLandingPage;
