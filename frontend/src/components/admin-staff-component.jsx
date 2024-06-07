/*
    Description: This component displays the staff in
    the ICS Admin Office - Cecilio L Junsay Jr.,
    Reggie S. Pelayo, and Romel Lawas. This include
    their duties in relation to PICSEL.

    @author Gacel Perfinian
    @date 03/17/2024
*/

import { ROOM_NAMES } from "../utilities/constant";

 const adminStaffComponent = () => {
    return (
        <>
            {/* Our Team Section Start */}
            <div className="team-area section-ptb white-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <div className="section-title pb-80">
                                <h2 className="mb-15">The <span className="theme-color">Admin</span> Office</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row text-center">
                        <div className="disp-inline-block col-text-center v-align-top col-xs-12 col-sm-6 col-md-4 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg min-h-450">
                                <img className="staff-team" src="assets/img/staff/CJunsay.png" alt="Cecilio L Junsay Jr." />
                                <h3 className="mb-5">Cecilio L. Junsay Jr.</h3>
                                <h6 className="mb-15">Senior Administrative II</h6>
                                <p>Overall in charge of approval of ICS room requests.</p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="disp-inline-block col-text-center v-align-top col-xs-12 col-sm-6 col-md-4 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg min-h-450">
                                <img className="staff-team" src="assets/img/staff/RPelayo.png" alt="Reggie S. Pelayo" />
                                <h3 className="mb-5">Reggie S. Pelayo</h3>
                                <h6 className="mb-15">Laboratory Aide III</h6>
                                <p>In charge of {ROOM_NAMES.ICS_MEGA_HALL} and PC Labs 1-5.</p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                        <div className="disp-inline-block col-text-center v-align-top col-xs-12 col-sm-6 col-md-4 mobi-mb-30 tab-mb-50">
                            <div className="team-member white-bg min-h-450">
                                <img className="staff-team" src="assets/img/staff/RLawas.png" alt="Romel Lawas" />
                                <h3 className="mb-5">Romel Lawas</h3>
                                <h6 className="mb-15">Administrative Aide III</h6>
                                <p>In charge of {ROOM_NAMES.ICS_LECTURE_HALL_3} and {ROOM_NAMES.ICS_LECTURE_HALL_4}, PC Labs 6-9 and C100.</p>
                            </div>
                        </div>
                        {/* Team Mamber End */}
                    </div>
                </div>
            </div>
            {/* Our Team Section End */}
        </>


    );
}

export default adminStaffComponent;