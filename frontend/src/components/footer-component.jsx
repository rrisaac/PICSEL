/* 
Description: This is a React component for the footer section of the website. 
It includes description, contact details, and website links.

@author Diana Marie Compahinay
@date 03/16/2024
*/

const footerComponent = () => {
    return (
        <>
            {/* Footer Section Start */}
            <footer>
                <div className="footer-widget-area bg-color-3 ptb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-4 col-md-5 mobi-mb-30">
                                <div className="footer-widget about">
                                    <div className="title mb-20">
                                        <img src="../assets/img/logo.png" alt="PICSEL"/>
                                    </div>
                                    <p><strong>PICSEL</strong> (<strong>P</strong>latform for <strong>I</strong>nstitute of <strong>C</strong>omputer <strong>S</strong>cience <strong>E</strong>vents, Scheduling, and <strong>L</strong>ogistics) streamlines room reservations for students, faculty, organizations, and visitors.</p>
                                </div>
                            </div>
                            {/* Widget end */}
                            <div className="col-xs-12 col-sm-4 col-md-4 mobi-mb-30">
                                <div className="footer-widget address">
                                    <div className="title mb-20">
                                        <h4>Contact Us</h4>
                                    </div>
                                    <ul>

                                        <li className="mb-10">
                                            {/* <span>Address:</span>  */}
                                            <div class="footer-info">
                                                <li>
                                                    <img src="../assets/img/icons/location.png" alt="loc" />
                                                    Institute of Computer Science
                                                    <br /> College of Arts and Sciences, UPLB
                                                    <br /> Los Baños Laguna, Philippines 4031
                                                </li>
                                            </div>
                                        </li>
                                        <li class="footer-info"> 
                                            <img src="../assets/img/icons/call.png" alt="call" />
                                            <a href="tel:(049) 536 2302 ">(049) 536 2302 </a> |
                                            <a href="tel:63-49-536-2302"> 63-49-536-2302</a>
                                        </li>
                                        <li class="footer-info">
                                            <img src="../assets/img/icons/mail.png" alt="email" />
                                            <a href="mailto:ics.uplb@up.edu.ph">
                                                ics.uplb@up.edu.ph
                                            </a>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                            {/* Widget end */}
                            <div className="col-xs-12 col-sm-4 col-md-3">
                                <div>
                                    <div className="title mb-20">
                                        <h4>Websites</h4>
                                    </div>
                                    <div className="social-link">
                                    <ul className="clearfix d-inblock">
                                            <li>
                                                <a href="https://ics.uplb.edu.ph/" target="_blank" rel="noreferrer">
                                                    ICS UPLB
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://cas.uplb.edu.ph/" target="_blank" rel="noreferrer">
                                                    CAS UPLB
                                                </a>
                                            </li>
                                            <li> 
                                                <a href="https://uplb.edu.ph/" target="_blank" rel="noreferrer">
                                                    UP Los Baños
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Widget end */}
                        </div>
                    </div>
                </div>
                {/* /.Widget Area End */}
                <div className="copyright black-bg ptb-15">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <div className="text">
                                    <p>
                                        © 2024 PICSEL is powered by CMSC 128 E-4L SY 2023-2024
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default footerComponent;