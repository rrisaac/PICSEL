/* Description: An error page which informs users that the page they're trying visit is non-existent due to wrong path entered in browser.

@author Reynaldo R. Isaac Jr.
@date 04/04/2024
*/

import { useRouteError } from "react-router-dom";
import './App.css';
import '../Gimri.css'

const ErrorPage = () => {  
    const error = useRouteError();
    console.error(error);

    const goBackHistory = () => {
        // Handle going back functionality to renavigate user to previous page
        window.history.back(); // Default browser back button behavior
      };
  
    return (
        <div className="app app-auth-sign-in align-content-stretch d-flex flex-wrap justify-content-end">
    <title>Error | PICSEL</title>
      <div className="app-auth-background"></div>
        <div className='app-login-container add-padding'>
        <div class="app app-error align-content-stretch d-flex flex-wrap">
            <div class="app-error-info">
                <h5 className="error-headline">Oops!</h5>
                <span>It seems that the page you are looking for no longer exists. <br></br>
                    We will try our best to fix this soon.</span>
                <button class="btn btn-dark" onClick={goBackHistory}>Go back</button>
            </div>
        </div></div></div>
    );
}

export default ErrorPage;