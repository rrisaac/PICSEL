import HeaderComponent from '../components/header-component';
import FooterComponent from '../components/footer-component';
import './App.css';
import OurTeamComponent from '../components/our-team-component';
import '../Gimri.css'

const aboutPage = () => {
  return (
    <div className="App">
      <title>About Us | PICSEL</title>
      <HeaderComponent />
      <OurTeamComponent/>
      <FooterComponent />
    </div>
  );
}

export default aboutPage;