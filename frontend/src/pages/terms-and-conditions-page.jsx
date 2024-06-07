/**
 * 
 * @description Terms and conditions for formality
 * @author Gacel Perfinian
 * @date 05/10/2024
 */

import "./App.css";
import "../Neptune.css";

const TermsAndConditionsPage = () => {
    const goBackHistory = () => {
        // Handle going back functionality to renavigate user to previous page
        window.history.back(); // Default browser back button behavior
      };
  
  return (
    <>
    <div className="app app-auth-sign-up align-content-stretch d-flex flex-wrap justify-content-end">
      <title>Terms and Conditions | PICSEL</title>
      <div className="app-auth-background"></div>
      <div className="app-signup-container">
        <div className="app-auth-container-background" style={{marginTop: "1000px"}}>
          <div className="logo">
            <a href="index.html">Neptune</a>
          </div>
          <p className="auth-description m-t-xs m-b-xs" style={{textAlign:"justify"}}>
          <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px"}}>Terms and Conditions</h5>
            Please read these terms and conditions ("terms and conditions", "terms") carefully before using picsel-e4l.vercel.app website (“website”, "service") operated by E4L ("us", 'we", "our").
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>Conditions of use</h5>
            By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to stop using the website accordingly. E4L only grants use and access of this website, its products, and its services to those who have accepted its terms.
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>Privacy policy</h5>
            Before you continue using our website, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>Age restriction</h5>
            You must be at least 18 (eighteen) years of age before you can use this website. By using this website, you warrant that you are at least 18 years of age and you may legally adhere to this Agreement. E4L assumes no responsibility for liabilities related to age misrepresentation.
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>Intellectual property</h5>
            You agree that all materials, products, and services provided on this website are the property of E4L, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. You also agree that you will not reproduce or redistribute the E4L’s intellectual property in any way, including electronic, digital, or new trademark registrations.
            You grant E4L a royalty-free and non-exclusive license to display, use, copy, transmit, and broadcast the content you upload and publish. For issues regarding intellectual property claims, you should contact the company in order to come to an agreement.
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>User accounts</h5>
            As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. You are also responsible for all activities that occur under your account or password.
            If you think there are any possible issues regarding the security of your account on the website, inform us immediately so we may address them accordingly.
            We reserve all rights to terminate accounts, edit or remove content and cancel orders at our sole discretion.
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>Applicable law</h5>
            By using this website, you agree that the laws of the Philippines, without regard to principles of conflict laws, will govern these terms and conditions, or any dispute of any sort that might come between E4L and you, or its business partners and associates.
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}> Disputes</h5>
            Any dispute related in any way to your use of this website or to products you purchase from us shall be arbitrated by the federal court of the Philippines and you consent to exclusive jurisdiction and venue of such courts.
            Indemnification
            You agree to indemnify E4L and its affiliates and hold E4L harmless against legal claims and demands that may arise from your use or misuse of our services. We reserve the right to select our own legal counsel. 
            <h5 style={{color:"black", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>Limitation on liability</h5>
            E4L is not liable for any damages that may occur to you as a result of your misuse of our website.
            E4L reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of these changes through electronic mail. This Agreement is an understanding between E4L and the user, and this supersedes and replaces all prior agreements regarding the use of this website.
        </p>
        <br/>
        <button class="btn btn-dark" style={{lineHeight:"2.75em", marginBottom:"50px"}} onClick={goBackHistory}>Go back</button>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        </div>
        </div>
    </div>
    </>
  );
};

export default TermsAndConditionsPage;
