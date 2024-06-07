/* Description: A page dedicated to navigating superadmin controls other than from the submenu in sidebar

@author Reynaldo R. Isaac Jr.
@date 04/19/2024
*/
import { Link } from "react-router-dom";
import '../Neptune.css';

const ConfigurationComponent = () => {
    return (
        <>
        <div>
            <div >
                <title>Dashboard | PICSEL</title>
                <div className="page-description">
                    <h1>Configuration</h1>
                </div>
            </div>
            <div className="white-rectangle" style={{ 
                borderRadius: 15, 
                marginLeft: 0,
                marginRight: 8, 
                minHeight: "0px",
                paddingTop:"40px"
                }}>
                
                <div className="widget-stats-container d-flex" style={{flexGrow: 1, padding: 20, overflow: 'hidden'}}>
                    <div className="widget-stats-content flex-fill" >
                    <div class="col-md-6">
                        {/* Rooms Button Card */}
                        <Link to="/dashboard/rooms" className="custom-link">
                            <div class="card text-center config-button">
                                <div className="card-body" style={{height: '180px', display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <i class="material-icons" style={{marginRight:"-25px", fontSize:"40px", marginTop:"-5px"}}>meeting_rooms</i>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><h1 className="card-title" style={{fontSize:"40px"}}>Rooms</h1> </button>              
                                </div>
                            </div>
                        </Link>
                        {/* Rooms Button Card */}
                        <Link to="/dashboard/class-schedules" className="custom-link">
                            <div class="card text-center config-button">
                                <div className="card-body" style={{height: '180px', display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <span><i class="material-icons" style={{marginRight:"10px", fontSize:"40px", marginTop:"-5px"}}>schedule</i></span>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><h1 className="card-title" style={{fontSize:"40px"}}>Class Schedules</h1> </button>              
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div class="col-md-6">
                        {/* Rooms Button Card */}
                        <Link to="/dashboard/users" className="custom-link">
                            <div class="card text-center config-button">
                                <div className="card-body" style={{height: '180px', display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <i class="material-icons" style={{marginRight:"10px", fontSize:"40px", marginTop:"-5px"}}>manage_accounts</i>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><h1 className="card-title" style={{fontSize:"40px"}}>Users</h1> </button>              
                                </div>
                            </div>
                        </Link>
                        {/* Rooms Button Card */}
                        <Link to="/dashboard/settings" className="custom-link">
                            <div class="card text-center config-button">
                                <div className="card-body" style={{height: '180px', display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <i class="material-icons" style={{marginRight:"10px", fontSize:"40px", marginTop:"-5px"}}>settings</i>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><h1 className="card-title" style={{fontSize:"40px"}}>Settings</h1> </button>              
                                </div>
                            </div>
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}


export default ConfigurationComponent;