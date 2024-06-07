/* 
    Description: This component is for the About tab in the header. It consists of all information 
    about the software developers, their teams, and their positions which made PICSEL possible.

    @author Pamela Joy Santos
    @date 03/16/2024
*/

import mindo from '../assets/img/team/Mindo.JPG';
import isaac from '../assets/img/team/Isaac.jpg';
import alday from '../assets/img/team/Alday.jpg';
import panga from '../assets/img/team/Panga.jpg';
import barilea from '../assets/img/team/Barilea.png';
import compahinay from '../assets/img/team/Compahinay.png';
import david from '../assets/img/team/David.jpg';
import nepomuceno from '../assets/img/team/Nepomuceno.png';
import novelo from '../assets/img/team/Novelo.png';
import perfinian from '../assets/img/team/Perfinian.jpg';
import santos from '../assets/img/team/Santos.jpg';
import senires from '../assets/img/team/Senires.png';
import cerezo from '../assets/img/team/Cerezo.png';
import flores from '../assets/img/team/Flores.png';
import magno from '../assets/img/team/Magno.png';
import natividad from '../assets/img/team/Natividad.jpg';
import pendon from '../assets/img/team/Pendon.jpg';
import pena from '../assets/img/team/Pena.png';
import zapanta from '../assets/img/team/Zapanta.JPG';
import capuchino from '../assets/img/team/Capuchino.png';

const ourTeamComponent = () => {
    return (
        <>
            {/* Our Team Section Start */}
            <div className="team-area pt-80 white-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <div className="section-title pb-80">
                                <h2 className="mb-15">
                                    Meet The <span className="theme-color">E4L Team</span>
                                </h2>
                                <p>Get to know the talented developers behind PICSEL.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row text-center mb-30">
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb50">
                            <div className="team-member white-bg">
                                <img src={mindo} alt="Rheana Mindo" />
                                <h3 className="mb-5">Rheana Mindo</h3>
                                <h6 className="mb-15">Project Manager <br/>& Database Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:rmmindo@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">rmmindo@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={isaac} alt="Reynaldo Isaac Jr." />
                                <h3 className="mb-5">Reynaldo Isaac Jr.</h3>
                                <h6 className="mb-15">Frontend <br/>Team Leader</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:rrisaac@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">rrisaac@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={alday} alt="Neil Alday" />
                                <h3 className="mb-5">Neil Alday</h3>
                                <h6 className="mb-15">Backend <br/>Team Leader</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:nsalday@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">nsalday@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={panga} alt="Eric Panga III" />
                                <h3 className="mb-5">Eric Panga III</h3>
                                <h6 className="mb-15">Database <br/>Team Leader</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:evpanga2@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">evpanga2@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                    </div>
                    {/* Row End */}
                    <div className="row text-center mb-30">
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={barilea} alt="Cyrus Barilea" />
                                <h3 className="mb-5">Cyrus Barilea</h3>
                                <h6 className="mb-15">Frontend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:cbarilea@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">cbarilea@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={compahinay} alt="Diana Compahinay" />
                                <h3 className="mb-5">Diana Compahinay</h3>
                                <h6 className="mb-15">Frontend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:dpcompahinay@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">dpcompahinay@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={david} alt="Kristian David" />
                                <h3 className="mb-5">Kristian David</h3>
                                <h6 className="mb-15">Frontend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:kpdavid3@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">kpdavid3@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={nepomuceno} alt="Prince Nepomuceno" />
                                <h3 className="mb-5">Prince Nepomuceno</h3>
                                <h6 className="mb-15">Frontend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:pmnepomuceno1@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">pmnepomuceno1@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                    </div>
                    {/* Row End */}
                    <div className="row text-center mb-30">
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={novelo} alt="Aljon Novelo" />
                                <h3 className="mb-5">Aljon Novelo</h3>
                                <h6 className="mb-15">Frontend Developer <br/>& Database Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:aanovelo@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">aanovelo@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={perfinian} alt="Gacel Perfinian" />
                                <h3 className="mb-5">Gacel Perfinian</h3>
                                <h6 className="mb-15">Frontend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:gcperfinian@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">gcperfinian@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={santos} alt="Pamela Santos" />
                                <h3 className="mb-5">Pamela Santos</h3>
                                <h6 className="mb-15">Frontend Developer <br/>& Database Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:pssantos@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">pssantos@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={senires} alt="Jan Señires" />
                                <h3 className="mb-5">Jan Señires</h3>
                                <h6 className="mb-15">Frontend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:jbsenires@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">jbsenires@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                    </div>
                    {/* Row End */}
                    <div className="row text-center mb-30">
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={cerezo} alt="Jet Cerezo" />
                                <h3 className="mb-5">Jet Cerezo</h3>
                                <h6 className="mb-15">Backend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:jvcerezo@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">jvcerezo@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={flores} alt="Rodolfo Flores III" />
                                <h3 className="mb-5">Rodolfo Flores III</h3>
                                <h6 className="mb-15">Backend Developer <br/>& Database Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:rpflores5@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">rpflores5@up.edu.ph</span>
                                    </a> 
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={magno} alt="Raphael Magno" />
                                <h3 className="mb-5">Raphael Magno</h3>
                                <h6 className="mb-15">Backend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:afmagno@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">afmagno@up.edu.ph</span>
                                    </a>
                                </p>
                                {/* Change your social media link */}
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={natividad} alt="Aira Natividad" />
                                <h3 className="mb-5">Aira Natividad</h3>
                                <h6 className="mb-15">Backend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:annatividad@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">annatividad@up.edu.ph</span>
                                    </a> 
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                    </div>
                    {/* Row End */}
                    <div className="row text-center mb-30">
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={pendon} alt="Rainier Pendon" />
                                <h3 className="mb-5">Rainier Pendon</h3>
                                <h6 className="mb-15">Backend Developer <br/>& Database Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:rppendon@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon"/>
                                        <span className="email-text">rppendon@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={pena} alt="Ryan Peña" />
                                <h3 className="mb-5">Ryan Peña</h3>
                                <h6 className="mb-15">Backend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:jppena@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">jppena@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={zapanta} alt="Jeffrey Zapanta" />
                                <h3 className="mb-5">Jeffrey Zapanta</h3>
                                <h6 className="mb-15">Backend <br/>Developer</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:mrzapanta1@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">mrzapanta1@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="col-xs-12 col-sm-6 col-md-3 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg">
                                <img src={capuchino} alt="Jeffrey Zapanta" />
                                <h3 className="mb-5">Earl Samuel Capuchino</h3>
                                <h6 className="mb-15">Adviser</h6>
                                <p className="social-icon style1 text-center mt-20">
                                    <a href="mailto:mrzapanta1@up.edu.ph" target="_blank" rel="noreferrer">
                                        <i className="zmdi zmdi-email email-icon" />
                                        <span className="email-text">ercapuchino@up.edu.ph</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                    </div>
                    {/* Row End */}
                </div>
            </div>
            {/* Our Team Section End */}
        </>
    );
}

export default ourTeamComponent;