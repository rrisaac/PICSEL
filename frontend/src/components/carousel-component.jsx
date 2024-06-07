/*
    Description: This renders the carousel portion on the
    homepage. It also includes a button to sign up
    to PICSEL.

    @author: Gacel Perfinian
    @date 03/17/2023
*/

import { Link } from "react-router-dom";
import React, {useState, useEffect} from "react";
import * as api from '../utilities/api';
import { PERMISSIONS } from "../utilities/constant";


const CarouselComponent= () => {
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await api.getSwitches();
                if (response.data.success) {
                    const perms = response.data.switches.reduce((acc, curr) => {
                        const key = `${curr.permission_name}_${curr.user_type}`;
                        acc[key] = curr.is_enabled;
                        return acc;
                    }, {});
                    setPermissions(perms);
                } else {
                    console.error('Failed to fetch permissions');
                }
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    const hasSignupAccess = permissions[`${PERMISSIONS.ALLOW_SIGNUP}_null`];
    return (
        <>
            {/* Slider Section Start */}
            <div className="slider-area slider-one bg-img-1">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="slider-caption ptb-155">
                                <h1>Got events?</h1>
                                <p className="mt-10">With PICSEL, you can now inquire, reserve, and book your ICS room needs in one location for your own events.</p>
                                <div className="mt-20">
                                    <Link to="signup">
                                        <button className="btn theme-btn" disabled={!hasSignupAccess}>Sign Up</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Slider Section End */}
        </>
    );
}

export default CarouselComponent;