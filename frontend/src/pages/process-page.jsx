import HeaderComponent from '../components/header-component';
import FooterComponent from '../components/footer-component';
import './App.css';
import ProcessComponent from '../components/process-component';
import '../Gimri.css'

const processPage = () => {
  return (
    <div className="App" >
      <title>Process | PICSEL</title>
      <HeaderComponent />
      
      
      <ProcessComponent/>
      
      <FooterComponent />
    </div>
  );
}

export default processPage;