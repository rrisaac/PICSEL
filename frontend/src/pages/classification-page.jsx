// Description: The function classificationPage displays a dropdown for User Classifications.
// When the options Faculty or Student Org are selected, another drop down appears to ask for
// the faculty's institute/department or the organization of the student user.
// @author Jan Andrew Senires
// @date 03/16/2024

// Description: The component uses axios to send an http request from the backend to update the necessary information and navigates to login after successful classify
// @author Joseph Ryan Pena
// @date 03/24/2024

// Description: Made the backend functionalities dynamic
// @author Neil Vincent S. Alday
// @date 04/04/2024

// Description: Refactored file to use constants from constant.js

// @author Rheana Mindo
// @date 04/16/2024

// Description: Add explicit validator on the Student Number Field.

// @author Jan Andrew Senires
// @date 05/01/2024

/**
 * @description Refactored to use customized alert
 * @author Pamela Joy Santos
 * @date 05/08/2024
 */

import { USER_TYPES } from '../utilities/constant';
import './App.css';
import '../Neptune.css';
import { useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import * as api from "../utilities/api";
import AlertNotificationComponent from '../components/alert-notification-component';

// The function name does not follow camel case conventions as it shows an error regarding react hook
const ClassificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const emailFromSignup = location.state?.email || ''; // Retrieve the email passed from the signup page

  const [userName, setUserName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [userClassification, setUserClassification] = useState('');
  const [department, setDepartment] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showStudentNumberField, setShowStudentNumberField] = useState(false);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const renderAlert = (success, message) => {
    if (showAlert) {
        return (
           <AlertNotificationComponent
                success={success}
                message={message}
           />
        );
    }
    return null;
  };

  const validateStudentNumber = (number) => {
    const contactNumberRegex = /^\d{4}-\d{5}$/;
    return contactNumberRegex.test(number);
  }

  const handleClassificationChange = (event) => {
    const value = event.target.value;
    setUserClassification(value);

    if (value === USER_TYPES.FACULTY) {
      setShowFacultyDropdown(true);
      setShowOrgDropdown(false);
      setShowStudentNumberField(false);
    } else if (value === USER_TYPES.STUDENT_ORGANIZATION) {
      setShowOrgDropdown(true);
      setShowFacultyDropdown(false);
      setShowStudentNumberField(false);
    } else if (value === USER_TYPES.STUDENT) {
      setShowStudentNumberField(true);
      setShowFacultyDropdown(false);
      setShowOrgDropdown(false);
    } else {
      setShowFacultyDropdown(false);
      setShowOrgDropdown(false);
      setShowStudentNumberField(false);
    }
  };

  const handleClassify = async (e) => {
    e.preventDefault();

    setAlertMessage('');
    setAlertSuccess(false);
    setShowAlert(false);

    const classifyDetails = {
      email: emailFromSignup,
      username: userName,
      classification: userClassification,
      studNumber: studentNumber,
      orgName: orgName,
      department: department
    }    

    const options = {body:classifyDetails};
    const result = await api.classify(options);

    try{
      if (result.data.success) {
        setAlertSuccess(true);
        setAlertMessage(result.data.message);
        setShowAlert(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setAlertSuccess(false);
        setAlertMessage(result.data.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertSuccess(false);
      setAlertMessage(error.response.data.message);
      setShowAlert(true);
    }
  }

  const handleStudentNumberBlur = () => {
    if (!validateStudentNumber(studentNumber)) {
      setValidationErrors(prev => ({
        ...prev,
        studentNumber: 'Expected format: XXXX-XXXXX',
      }));
    } else {
      setValidationErrors(prev => ({ ...prev, studentNumber: '' }));
    }
  };

  const handleStudentNumberChange = (e) => {
    let value = e.target.value;
  
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
  
    // Remove excess characters beyond 11 digits
    value = value.slice(0, 10);
  
    // Insert hyphens at specific positions
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
  
    // Trim excess characters
    value = value.slice(0, 10);
  
    setStudentNumber(value);
  
    // Validate the formatted number
    if (validateStudentNumber(value)) {
      setValidationErrors(prev => ({ ...prev, studentNumber: '' }));
    }
  };


  return (
    <>
    {renderAlert(alertSuccess, alertMessage)}
    <div className="app app-sign-in align-content-stretch d-flex flex-wrap justify-content-end">
      <div className="app-auth-background"></div>
      <div className="app-auth-container">
        <div className="logo"></div>
        <div className="auth-credentials page-m-b-xxl">
          {/* Username Input */}
          <label htmlFor="userName" className="username-form-label">
            Username
          </label>
          <input
            type="text"
            id="userName"
            className="form-control"
            placeholder="Enter Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {/* Users Dropdown */}
          <label htmlFor="userClassification" className="user-form-label">
            User Classification
          </label>
          <select
            id="userClassification"
            className="form-control"
            value={userClassification}
            onChange={handleClassificationChange}
            style={{
              paddingTop: "6px",
              paddingBottom: "6px",
              paddingLeft: "6px",
              paddingRight: "6px"
            }}
          >
            <option value="">---Select User Classification---</option>
            <option value={USER_TYPES.FACULTY}>Faculty</option>
            <option value={USER_TYPES.STUDENT}>Student</option>
            <option value={USER_TYPES.STUDENT_ORGANIZATION}>Student Organization</option>
            <option value={USER_TYPES.GUEST}>Guest</option>
          </select>

          {/* Student Number Input */}
          {showStudentNumberField && (
            <>
              <label htmlFor="studentNumber" className="studentnum-form-label">
                Student Number
              </label>
              <input
                type="text"
                id="studentNumber"
                className="form-control"
                placeholder="Enter Student Number"
                value={studentNumber}
                onChange={handleStudentNumberChange}
                onBlur={handleStudentNumberBlur}
              />
              {validationErrors.studentNumber && (
                <div className="error-message">{validationErrors.studentNumber}</div>
              )}
            </>
          )}

          {/* Faculty Dropdown */}
          {showFacultyDropdown && (
            <>
              <label htmlFor="facultyDropdown" className="faculty-form-label">
                Institute/Department
              </label>
              <select
                id="facultyDropdown"
                className="form-control"
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  paddingLeft: "6px",
                  paddingRight: "6px"
                }}
                onChange = {(e) => setDepartment(e.target.value)}
              >
                <option value="">---Select Institute/Department---</option>
                <option value="INSTITUTE OF COMPUTER SCIENCE (ICS)">INSTITUTE OF COMPUTER SCIENCE (ICS)</option>
                <option value="INSTITUTE OF STATISTICS (INSTAT)">INSTITUTE OF STATISTICS (INSTAT)</option>
                <option value="INSTITUTE OF CHEMISTRY (IC)">INSTITUTE OF CHEMISTRY (IC)</option>
              </select>
            </>
          )}

          {/* Student Org Dropdown */}
          {showOrgDropdown && (
            <div className="org-dropdown-container">
              <label htmlFor="orgDropdown" className="org-form-label">
                Organization
              </label>
              <select
                id="orgDropdown"
                className="form-control"
                style={{
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  paddingLeft: "6px",
                  paddingRight: "6px"
                }}
                onChange = {(e) => setOrgName(e.target.value)}
              >
                <option value="">---Select Organization---</option>
                {/* University-based Organizations */}
                <optgroup label="University-based Organizations">
                  <option value="ADVENTIST MINISTRY TO COLLEGE AND UNIVERSITY STUDENTS UPLB CHAPTER (AMICUS-UPLB CHAPTER)">ADVENTIST MINISTRY TO COLLEGE AND UNIVERSITY STUDENTS UPLB CHAPTER (AMICUS-UPLB CHAPTER)</option>
                  <option value="AIESEC (AIESEC in UPLB)">AIESEC (AIESEC in UPLB)</option>
                  <option value="ALPHA SIGMA FRATERNITY (MASIG)">ALPHA SIGMA FRATERNITY (MASIG)</option>
                  <option value="ANA KALANG SOCIETY (UP AKS)">ANA KALANG SOCIETY (UP AKS)</option>
                  <option value="ASTRONOMICAL SOCIETY (UPLB ASTROSOC)">ASTRONOMICAL SOCIETY (UPLB ASTROSOC)</option>
                  <option value="Ahon Batang CALABARZON - UPLB (ABACA-UPLB)">Ahon Batang CALABARZON - UPLB (ABACA-UPLB)</option>
                  <option value="Alleluia Community-Christ’s Youth in Action UPLB ( AC-CYA UPLB)">Alleluia Community-Christ’s Youth in Action UPLB ( AC-CYA UPLB)</option>
                  <option value="Alliance of Gamers (UP AG)">Alliance of Gamers (UP AG)</option>
                  <option value="BABAYLAN (BABAYLAN)">BABAYLAN (BABAYLAN)</option>
                  <option value="BANAHAW (UP BANAHAW)">BANAHAW (UP BANAHAW)</option>
                  <option value="BASKETBOLEROS, BASKETBOLERAS: ANG LIGANG LAMANG (UP BBALL)">BASKETBOLEROS, BASKETBOLERAS: ANG LIGANG LAMANG (UP BBALL)</option>
                  <option value="BETA KAPPA FRATERNITY (UP BK)">BETA KAPPA FRATERNITY (UP BK)</option>
                  <option value="BETA SIGMA FRATERNITY (UPLB BE)">BETA SIGMA FRATERNITY (UPLB BE)</option>
                  <option value="BUGKOS (BUGKOS)">BUGKOS (BUGKOS)</option>
                  <option value="CABALLEROS (UPC)">CABALLEROS (UPC)</option>
                  <option value="CAGAYANOS (UPC)">CAGAYANOS (UPC)</option>
                  <option value="CALAMBEÑOS (UP CALAMBEÑOS)">CALAMBEÑOS (UP CALAMBEÑOS)</option>
                  <option value="CAMPUS CRUSADE FOR CHRIST (UPLB CCC)">CAMPUS CRUSADE FOR CHRIST (UPLB CCC)</option>
                  <option value="CATANDUNGAN LOS BANOS (UPCATLB)">CATANDUNGAN LOS BANOS (UPCATLB)</option>
                  <option value="CHI EPSILON SORORITY (UP CE)">CHI EPSILON SORORITY (UP CE)</option>
                  <option value="CHORAL ENSEMBLE (UPLB CE)">CHORAL ENSEMBLE (UPLB CE)</option>
                  <option value="CHRISTIANS ON CAMPUS-UPLB (COC-UPLB)">CHRISTIANS ON CAMPUS-UPLB (COC-UPLB)</option>
                  <option value="CIRCLE K CLUB OF THE UNIVERSITY OF THE PHILIPPINES - LOS BANOS (CKI UPLB)">CIRCLE K CLUB OF THE UNIVERSITY OF THE PHILIPPINES - LOS BANOS (CKI UPLB)</option>
                  <option value="Career Assistance Program (UPLB CAP)">Career Assistance Program (UPLB CAP)</option>
                  <option value="Club for UNESCO - UPLB (UNESCO CLUB UPLB)">Club for UNESCO - UPLB (UNESCO CLUB UPLB)</option>
                  <option value="Compassion for Animals Through Service of UPLB Students (CATS of UPLB)">Compassion for Animals Through Service of UPLB Students (CATS of UPLB)</option>
                  <option value="DATA SCIENCE GUILD (UPLBDSG)">DATA SCIENCE GUILD (UPLBDSG)</option>
                  <option value="DELTA LAMBDA SIGMA SORORITY (DLS)">DELTA LAMBDA SIGMA SORORITY (DLS)</option>
                  <option value="DEMOLAY CLUB (UPLB DEMOLAY CLUB)">DEMOLAY CLUB (UPLB DEMOLAY CLUB)</option>
                  <option value="DEPARTMENT OF SCIENCE AND TECHNOLOGY SCHOLARS' SOCIETY (UPLB DOST SS)">DEPARTMENT OF SCIENCE AND TECHNOLOGY SCHOLARS' SOCIETY (UPLB DOST SS)</option>
                  <option value="ECOLOGY AND SYSTEMATICS MAJOR STUDENTS SOCIETY (UP ECOSYSTEMSS)">ECOLOGY AND SYSTEMATICS MAJOR STUDENTS SOCIETY (UP ECOSYSTEMSS)</option>
                  <option value="EPSILON CHI FRATERNITY, BETA CHAPTER (UP EX)">EPSILON CHI FRATERNITY, BETA CHAPTER (UP EX)</option>
                  <option value="EUYEOMUYEO JOJIK (EUYEO)">EUYEOMUYEO JOJIK (EUYEO)</option>
                  <option value="EVERY NATION CAMPUS - UNIVERSITY OF THE PHILIPPINES LOS BANOS (EN CAMPUS UPLB)">EVERY NATION CAMPUS - UNIVERSITY OF THE PHILIPPINES LOS BANOS (EN CAMPUS UPLB)</option>
                  <option value="FILM CIRCLE (UPFC)">FILM CIRCLE (UPFC)</option>
                  <option value="GAMMA SIGMA FRATERNITY UP RED SCORPIONS (UPGS)">GAMMA SIGMA FRATERNITY UP RED SCORPIONS (UPGS)</option>
                  <option value="GAMMA SIGMA SORORITY UP RED SCORPIONS (GSS)">GAMMA SIGMA SORORITY UP RED SCORPIONS (GSS)</option>
                  <option value="GAWAD KALINGA - LOS BANOS (UPGK-LB)">GAWAD KALINGA - LOS BANOS (UPGK-LB)</option>
                  <option value="GRAND ORDER OF THE EAGLES (UP EAGLES)">GRAND ORDER OF THE EAGLES (UP EAGLES)</option>
                  <option value="GRANGE ASSOCIATION (GRANGE)">GRANGE ASSOCIATION (GRANGE)</option>
                  <option value="GRAPHIC LITERATURE GUILD (GLG)">GRAPHIC LITERATURE GUILD (GLG)</option>
                  <option value="GUILD OF UNITED MINDS (UP PRAEFECTS)">GUILD OF UNITED MINDS (UP PRAEFECTS)</option>
                  <option value="Gabay Isko - University of the Philippines Los Baños (GABI - UPLB)">Gabay Isko - University of the Philippines Los Baños (GABI - UPLB)</option>
                  <option value="Game On (UPLB GO)">Game On (UPLB GO)</option>
                  <option value="HARMONYA: THE STRING ENSEMBLE OF UPLB (HARMONYA)">HARMONYA: THE STRING ENSEMBLE OF UPLB (HARMONYA)</option>
                  <option value="HIN-AY (HIN-AY)">HIN-AY (HIN-AY)</option>
                  <option value="ISABELA SOCIETY (UPIS)">ISABELA SOCIETY (UPIS)</option>
                  <option value="JAMMERS' CLUB (UPJC)">JAMMERS' CLUB (UPJC)</option>
                  <option value="JOCKS (THE UPLB JOCKS)">JOCKS (THE UPLB JOCKS)</option>
                  <option value="KAIBAN (KAIBAN)">KAIBAN (KAIBAN)</option>
                  <option value="KAPATIRANG PITONG LAWA SA UPLB (KAPWA SA UPLB)">KAPATIRANG PITONG LAWA SA UPLB (KAPWA SA UPLB)</option>
                  <option value="KAPATIRANG PLEBEIANS-UPLB CURIA (Plebes UPLB)">KAPATIRANG PLEBEIANS-UPLB CURIA (Plebes UPLB)</option>
                  <option value="KAPPA EPSILON FRATERNITY, UPLB CHAPTER (UP KE)">KAPPA EPSILON FRATERNITY, UPLB CHAPTER (UP KE)</option>
                  <option value="KAPPA PHI SIGMA - CONSERVATION AND DEVELOPMENT SOCIETY (UP KPS-CDS)">KAPPA PHI SIGMA - CONSERVATION AND DEVELOPMENT SOCIETY (UP KPS-CDS)</option>
                  <option value="KARTUNISTA-MANUNULAT KOLEKTIB (KK)">KARTUNISTA-MANUNULAT KOLEKTIB (KK)</option>
                  <option value="LAKAS-ANGKAN YOUTH FELLOWSHIP (UPLB-LAYF)">LAKAS-ANGKAN YOUTH FELLOWSHIP (UPLB-LAYF)</option>
                  <option value="LAWN TENNIS RACQUETEERS' LEAGUE (UP LATERAL)">LAWN TENNIS RACQUETEERS' LEAGUE (UP LATERAL)</option>
                  <option value="LISIEUX MUSIC MINISTRY (UPLB LMM)">LISIEUX MUSIC MINISTRY (UPLB LMM)</option>
                  <option value="LUMABAY - LABAY CLUB '57 (LABAY 57)">LUMABAY - LABAY CLUB '57 (LABAY 57)</option>
                  <option value="MAKILING CAMPUS RUNNERS (MACRUNNERS)">MAKILING CAMPUS RUNNERS (MACRUNNERS)</option>
                  <option value="MAKILING ULTIMATE CLUB (MUC)">MAKILING ULTIMATE CLUB (MUC)</option>
                  <option value="MASBATENOS (MASBA)">MASBATENOS (MASBA)</option>
                  <option value="MI-ABEYABE (MIYABE)">MI-ABEYABE (MIYABE)</option>
                  <option value="MINDORENOS (UP MINDORENOS)">MINDORENOS (UP MINDORENOS)</option>
                  <option value="MOUNTAINEERS (UPLB MOUNTAINEERS)">MOUNTAINEERS (UPLB MOUNTAINEERS)</option>
                  <option value="MUNSCI ALUMNI SOCIETY (UP MUNSCIALS)">MUNSCI ALUMNI SOCIETY (UP MUNSCIALS)</option>
                  <option value="Missionary Families of Christ CAMPUS - UPLB (MFC CAMPUS - UPLB)">Missionary Families of Christ CAMPUS - UPLB (MFC CAMPUS - UPLB)</option>
                  <option value="NEXUS FILIAE SORORITY (NEXUS FILIAE)">NEXUS FILIAE SORORITY (NEXUS FILIAE)</option>
                  <option value="NOVO ECIJANOS (UPNE)">NOVO ECIJANOS (UPNE)</option>
                  <option value="OFFICE OF STUDENT ACTIVITIES (UPLB OSA)">OFFICE OF STUDENT ACTIVITIES (UPLB OSA)</option>
                  <option value="OROQUIETA (UPO)">OROQUIETA (UPO)</option>
                  <option value="PAINTERS' CLUB (UPPC)">PAINTERS' CLUB (UPPC)</option>
                  <option value="PALARIS CONFRATERNITY (UPPC)">PALARIS CONFRATERNITY (UPPC)</option>
                  <option value="PARLIAMENT: UPLB DEBATE SOCIETY (UPLB DEBSOC)">PARLIAMENT: UPLB DEBATE SOCIETY (UPLB DEBSOC)</option>
                  <option value="PENINSULARES (UP PENINSULARES)">PENINSULARES (UP PENINSULARES)</option>
                  <option value="PENINSULARES (UPP)">PENINSULARES (UPP)</option>
                  <option value="PHOTOGRAPHERS' SOCIETY (UP PHOTOS)">PHOTOGRAPHERS' SOCIETY (UP PHOTOS)</option>
                  <option value="Pickleball Club (UPLB PC)">Pickleball Club (UPLB PC)</option>
                  <option value="RANCHERS' CLUB PHILIPPINES (RANCHERS)">RANCHERS' CLUB PHILIPPINES (RANCHERS)</option>
                  <option value="RED CROSS YOUTH OF UNIVERSITY OF THE PHILIPPINES LOS BANOS (RCY OF UPLB)">RED CROSS YOUTH OF UNIVERSITY OF THE PHILIPPINES LOS BANOS (RCY OF UPLB)</option>
                  <option value="RHETORICIANS - UPLB SPEECH COMMUNICATION ORGANIZATION (Rheto)">RHETORICIANS - UPLB SPEECH COMMUNICATION ORGANIZATION (Rheto)</option>
                  <option value="RIZALENOS (RIZALEÑOS)">RIZALENOS (RIZALEÑOS)</option>
                  <option value="SAMAHAN NG MGA MAG-AARAL NG TEKNOLOHIYANG PANLIPUNAN-UPLB (STP-UPLB)">SAMAHAN NG MGA MAG-AARAL NG TEKNOLOHIYANG PANLIPUNAN-UPLB (STP-UPLB)</option>
                  <option value="SAMAHANG BUSKO - UPLB (UP BUSKO)">SAMAHANG BUSKO - UPLB (UP BUSKO)</option>
                  <option value="SANDAYAW CULTURAL GROUP (SANDAYAW)">SANDAYAW CULTURAL GROUP (SANDAYAW)</option>
                  <option value="SANDIWA SAMAHANG BULAKENYO (UPSSB)">SANDIWA SAMAHANG BULAKENYO (UPSSB)</option>
                  <option value="SANTA ROSA SCIENCE AND TECHNOLOGY ALUMNI ORGANIZATION (UP STRATOS)">SANTA ROSA SCIENCE AND TECHNOLOGY ALUMNI ORGANIZATION (UP STRATOS)</option>
                  <option value="SARONG BANGGI (UPSB)">SARONG BANGGI (UPSB)</option>
                  <option value="SENTAI ONGAKU MANGA ANIME SOSHIKI (UP SOMA SOSHIKI)">SENTAI ONGAKU MANGA ANIME SOSHIKI (UP SOMA SOSHIKI)</option>
                  <option value="SIGMA ALPHA NU SORORITY (EAN)">SIGMA ALPHA NU SORORITY (EAN)</option>
                  <option value="SIGMA ALPHA SORORITY (UP SIGMA ALPHA)">SIGMA ALPHA SORORITY (UP SIGMA ALPHA)</option>
                  <option value="SIGMA BETA SORORITY LOS BANOS CHAPTER (UP EB)">SIGMA BETA SORORITY LOS BANOS CHAPTER (UP EB)</option>
                  <option value="SIGMA DELTA PHI (SDP)">SIGMA DELTA PHI (SDP)</option>
                  <option value="SIGMA RHO FRATERNITY (SIGMA RHO)">SIGMA RHO FRATERNITY (SIGMA RHO)</option>
                  <option value="UP SILAKBO (SLKB)">UP SILAKBO (SLKB)</option>
                  <option value="SOCIETY OF AGRICULTURAL AND RURAL DEVELOPMENT SCHOLARS (UPLB ARDSS)">SOCIETY OF AGRICULTURAL AND RURAL DEVELOPMENT SCHOLARS (UPLB ARDSS)</option>
                  <option value="SOCIETY OF EXCHANGE STUDENTS UP (SExS-UP)">SOCIETY OF EXCHANGE STUDENTS UP (SExS-UP)</option>
                  <option value="STATE VARSITY CHRISTIAN FELLOWSHIP (SVCF-UPLB)">STATE VARSITY CHRISTIAN FELLOWSHIP (SVCF-UPLB)</option>
                  <option value="STUDENTS OF DESTINY (UP SOD)">STUDENTS OF DESTINY (UP SOD)</option>
                  <option value="Samahan ng mga Lantay na Diamante (UP SALADIA)">Samahan ng mga Lantay na Diamante (UP SALADIA)</option>
                  <option value="Student Catholic Action - Los Baños (UPSCA-LB)">Student Catholic Action - Los Baños (UPSCA-LB)</option>
                  <option value="TARABIDAN 'Y ANG MGA PALAWEÑO (UP TARABIDAN)">TARABIDAN 'Y ANG MGA PALAWEÑO (UP TARABIDAN)</option>
                  <option value="THETA EPSILON SORORITY (UP THE)">THETA EPSILON SORORITY (UP THE)</option>
                  <option value="Triskelion (UPLB Triskelions)">Triskelion (UPLB Triskelions)</option>
                  <option value="UPSILON SIGMA PHI (UPSILON)">UPSILON SIGMA PHI (UPSILON)</option>
                  <option value="VARRONS LTD. (UPVL)">VARRONS LTD. (UPVL)</option>
                  <option value="WYRE UNDERGROUND OF UPLB (WYRE)">WYRE UNDERGROUND OF UPLB (WYRE)</option>
                  <option value="YOUNG ENTREPRENEURS' SOCIETY UP (YES UP)">YOUNG ENTREPRENEURS' SOCIETY UP (YES UP)</option>
                  <option value="YOUTH FOR CHRIST UPLB (YFC-UPLB)">YOUTH FOR CHRIST UPLB (YFC-UPLB)</option>
                </optgroup>

                {/* CA-based Organizations */}
                <optgroup label="CA-based Organizations">
                  <option value="AGRICULTURAL SOCIETY (UP AGRISOC)">AGRICULTURAL SOCIETY (UP AGRISOC)</option>
                  <option value="ANIMAL SCIENCE SOCIETY (UPASS)">ANIMAL SCIENCE SOCIETY (UPASS)</option>
                  <option value="CONCORDIA SCIENTIA ANIMALIS (UPCSA)">CONCORDIA SCIENTIA ANIMALIS (UPCSA)</option>
                  <option value="ENTOMOLOGICAL SOCIETY (UP EntomSoc)">ENTOMOLOGICAL SOCIETY (UP EntomSoc)</option>
                  <option value="GENETIC RESEARCHERS AND AGRICULTURAL INNOVATORS SOCIETY (UP GRAINS)">GENETIC RESEARCHERS AND AGRICULTURAL INNOVATORS SOCIETY (UP GRAINS)</option>
                  <option value="HORTICULTURAL SOCIETY (UP HortSoc)">HORTICULTURAL SOCIETY (UP HortSoc)</option>
                  <option value="LEAGUE OF AGRICULTURAL BIOTECHNOLOGY STUDENTS (UP LABS)">LEAGUE OF AGRICULTURAL BIOTECHNOLOGY STUDENTS (UP LABS)</option>
                  <option value="PABULUM SCIENTIA SODALITAS (UP PSS)">PABULUM SCIENTIA SODALITAS (UP PSS)</option>
                  <option value="PHILIPPINE ASSOCIATION OF FOOD TECHNOLOGISTS, INC. - BETA CHAPTER (PAFT BETA)">PHILIPPINE ASSOCIATION OF FOOD TECHNOLOGISTS, INC. - BETA CHAPTER (PAFT BETA)</option>
                  <option value="PHYTOPATHOLOGICAL SOCIETY (UPPS)">PHYTOPATHOLOGICAL SOCIETY (UPPS)</option>
                  <option value="SOCIETY OF AGRONOMY MAJOR STUDENTS (UPHILSAMS)">SOCIETY OF AGRONOMY MAJOR STUDENTS (UPHILSAMS)</option>
                  <option value="SOIL SCIENCE SOCIETY (UPSSS)">SOIL SCIENCE SOCIETY (UPSSS)</option>
                  <option value="The UP Landscape Agroforestry, Agricultural Systems and Extension Society (The UP LAES/UP LAES)">The UP Landscape Agroforestry, Agricultural Systems and Extension Society (The UP LAES/UP LAES)</option>
                </optgroup>

                {/* CAS-based Organizations */}
                <optgroup label="CAS-based Organizations">
                  <option value="ACTUARIAL SCIENCE SOCIETY (UPLB ACTSS)">ACTUARIAL SCIENCE SOCIETY (UPLB ACTSS)</option>
                  <option value="ALLIANCE OF COMPUTER SCIENCE STUDENTS UPLB (ACSS UPLB)">ALLIANCE OF COMPUTER SCIENCE STUDENTS UPLB (ACSS UPLB)</option>
                  <option value="ALLIANCE OF STATISTICS MAJORS UPLB (ASM UPLB)">ALLIANCE OF STATISTICS MAJORS UPLB (ASM UPLB)</option>
                  <option value="ALLIANCE OF STUDENTS UNIFIED FOR SOCIOLOGY (UP ASUS)">ALLIANCE OF STUDENTS UNIFIED FOR SOCIOLOGY (UP ASUS)</option>
                  <option value="CELL BIOLOGICAL SOCIETY (UP CELLS)">CELL BIOLOGICAL SOCIETY (UP CELLS)</option>
                  <option value="CHEMICAL KINETICS SOCIETY (UPLB CHEMO)">CHEMICAL KINETICS SOCIETY (UPLB CHEMO)</option>
                  <option value="CHEMICAL SOCIETY (UPLB CHEMSOC)">CHEMICAL SOCIETY (UPLB CHEMSOC)</option>
                  <option value="COM ARTS SOCIETY (COMARTSOC)">COM ARTS SOCIETY (COMARTSOC)</option>
                  <option value="UPLB COMPUTER SCIENCE SOCIETY (UPLB COSS)">UPLB COMPUTER SCIENCE SOCIETY (UPLB COSS)</option>
                  <option value="Cheerdance Team (UPLBCDT)">Cheerdance Team (UPLBCDT)</option>
                  <option value="GENETICS SOCIETY (GENESOC)">GENETICS SOCIETY (GENESOC)</option>
                  <option value="GURO: MATHEMATICS AND SCIENCE TEACHING SOCIETY (U.P. GURO)">GURO: MATHEMATICS AND SCIENCE TEACHING SOCIETY (U.P. GURO)</option>
                  <option value="KABATAANG ALYANSA NG MAY DUGONG TAGA- HILAGANG KAMARINES (UP KAADHIKA)">KABATAANG ALYANSA NG MAY DUGONG TAGA- HILAGANG KAMARINES (UP KAADHIKA)</option>
                  <option value="LEAGUE OF AGRICULTURAL CHEMISTRY STUDENTS (UP LACS)">LEAGUE OF AGRICULTURAL CHEMISTRY STUDENTS (UP LACS)</option>
                  <option value="MATHEMATICAL SCIENCES SOCIETY (UPLB MASS)">MATHEMATICAL SCIENCES SOCIETY (UPLB MASS)</option>
                  <option value="MICROBIOLOGICAL SOCIETY (UPLB MICROSOC)">MICROBIOLOGICAL SOCIETY (UPLB MICROSOC)</option>
                  <option value="PHILOBIOSCIENTIA, THE UPLB LIFE SCIENCES SOCIETY (PHILEOS)">PHILOBIOSCIENTIA, THE UPLB LIFE SCIENCES SOCIETY (PHILEOS)</option>
                  <option value="PHILOSOPHICAL SOCIETY OF UPLB (PHILOSOC)">PHILOSOPHICAL SOCIETY OF UPLB (PHILOSOC)</option>
                  <option value="PHYSIKA, UP APPLIED PHYSICS SOCIETY (PHYSIKA)">PHYSIKA, UP APPLIED PHYSICS SOCIETY (PHYSIKA)</option>
                  <option value="SOCIETY OF APPLIED MATHEMATICS OF UPLB (SAM-UP)">SOCIETY OF APPLIED MATHEMATICS OF UPLB (SAM-UP)</option>
                  <option value="SOCIETY OF MATH MAJORS (SMM)">SOCIETY OF MATH MAJORS (SMM)</option>
                  <option value="SOCIETY OF PRE-MED STUDENTS (SPS)">SOCIETY OF PRE-MED STUDENTS (SPS)</option>
                  <option value="SOCIOLOGY SOCIETY (SOCIOSOC)">SOCIOLOGY SOCIETY (SOCIOSOC)</option>
                  <option value="SOCIUS (UP SOCIUS)">SOCIUS (UP SOCIUS)</option>
                  <option value="STATISTICAL SOCIETY (UPLB STATS)">STATISTICAL SOCIETY (UPLB STATS)</option>
                  <option value="SYMBIOSIS, THE UPLB BIOLOGICAL SOCIETY (SYMBIOSIS)">SYMBIOSIS, THE UPLB BIOLOGICAL SOCIETY (SYMBIOSIS)</option>
                  <option value="Sophia Circle (Sophia Circle)">Sophia Circle (Sophia Circle)</option>
                  <option value="VOLLEYBALL CLUB (UPLB VC)">VOLLEYBALL CLUB (UPLB VC)</option>
                  <option value="YOUNG SOFTWARE ENGINEERS' SOCIETY (YSES)">YOUNG SOFTWARE ENGINEERS' SOCIETY (YSES)</option>
                  <option value="ZOOLOGICAL SOCIETY (OZOOMS)">ZOOLOGICAL SOCIETY (OZOOMS)</option>
                </optgroup>

                {/* CDC-based Organizations */}
                <optgroup label="CDC-based Organizations">
                  <option value="ALLIANCE OF DEVELOPMENT COMMUNICATION STUDENTS (UP ADS)">ALLIANCE OF DEVELOPMENT COMMUNICATION STUDENTS (UP ADS)</option>
                  <option value="COMMUNITY BROADCASTERS' SOCIETY (UP COMBROADSOC)">COMMUNITY BROADCASTERS' SOCIETY (UP COMBROADSOC)</option>
                  <option value="DEVELOPMENT COMMUNICATORS' SOCIETY (UPLB DCS)">DEVELOPMENT COMMUNICATORS' SOCIETY (UPLB DCS)</option>
                </optgroup>

                {/* CEAT-based Organizations */}
                <optgroup label="CEAT-based Organizations">
                  <option value="ALLIANCE OF CHEMICAL ENGINEERING STUDENTS (UP AChES)">ALLIANCE OF CHEMICAL ENGINEERING STUDENTS (UP AChES)</option>
                  <option value="BROTHERHOOD OF NOBLE ENGINEERS (UP BNE)">BROTHERHOOD OF NOBLE ENGINEERS (UP BNE)</option>
                  <option value="CIVIL ENGINEERING EXECUTIVE ORGANIZATION (CEO)">CIVIL ENGINEERING EXECUTIVE ORGANIZATION (CEO)</option>
                  <option value="CIVIL ENGINEERING SOCIETY (UPCES)">CIVIL ENGINEERING SOCIETY (UPCES)</option>
                  <option value="ENGINEERING RADIO GUILD - LOS BANOS (UP ERG - LB)">ENGINEERING RADIO GUILD - LOS BANOS (UP ERG - LB)</option>
                  <option value="ENGINEERING SOCIETY (UPLB ENGSOC)">ENGINEERING SOCIETY (UPLB ENGSOC)</option>
                  <option value="ENGINEERING STUDENTS' GUILD (UPESG)">ENGINEERING STUDENTS' GUILD (UPESG)</option>
                  <option value="INDUSTRIAL ENGINEERING STUDENTS' ORGANIZATION (UPLB IESO)">INDUSTRIAL ENGINEERING STUDENTS' ORGANIZATION (UPLB IESO)</option>
                  <option value="LEAGUE OF AGRICULTURAL ENGINEERING STUDENTS (N.G.)">LEAGUE OF AGRICULTURAL ENGINEERING STUDENTS (N.G.)</option>
                  <option value="SOCIETY OF AGRICULTURAL ENGINEERING STUDENTS (UP SAGES)">SOCIETY OF AGRICULTURAL ENGINEERING STUDENTS (UP SAGES)</option>
                  <option value="SOCIETY OF CHEMICAL ENGINEERING STUDENTS (UPLB SChemES)">SOCIETY OF CHEMICAL ENGINEERING STUDENTS (UPLB SChemES)</option>
                  <option value="SOCIETY OF ELECTRICAL ENGINEERING STUDENTS (UPLB SELES)">SOCIETY OF ELECTRICAL ENGINEERING STUDENTS (UPLB SELES)</option>
                  <option value="TAU ALPHA FRATERNITY (TAU ALPHA)">TAU ALPHA FRATERNITY (TAU ALPHA)</option>
                  <option value="Tau Lambda Alpha (TLA)">Tau Lambda Alpha (TLA)</option>
                  <option value="University of the Philippines Los Banos Mechanical Engineering Guild (UPLB MEG)">University of the Philippines Los Banos Mechanical Engineering Guild (UPLB MEG)</option>
                </optgroup>

                {/* CEM-based Organizations */}
                <optgroup label="CEM-based Organizations">
                  <option value="AGRIBUSINESS SOCIETY (UP ABS)">AGRIBUSINESS SOCIETY (UP ABS)</option>
                  <option value="ALLIANCE OF ECONOMICS AND MANAGEMENT STUDENTS (UPAEMS)">ALLIANCE OF ECONOMICS AND MANAGEMENT STUDENTS (UPAEMS)</option>
                  <option value="Agricultural and Applied Economics Circle (UPAAEC)">Agricultural and Applied Economics Circle (UPAAEC)</option>
                  <option value="ECONOMICS SOCIETY (ECONSOC)">ECONOMICS SOCIETY (ECONSOC)</option>
                  <option value="JUNIOR EXECUTIVE SOCIETY (UPJES)">JUNIOR EXECUTIVE SOCIETY (UPJES)</option>
                  <option value="SOCIETY OF MANAGEMENT AND ECONOMICS STUDENTS (UP SMES)">SOCIETY OF MANAGEMENT AND ECONOMICS STUDENTS (UP SMES)</option>
                </optgroup>

                {/* CFNR-based Organizations */}
                <optgroup label="CFNR-based Organizations">
                  <option value="ASSOCIATION OF FILIPINO FORESTRY STUDENTS-UPLB (AFFS-UPLB, INC.)">ASSOCIATION OF FILIPINO FORESTRY STUDENTS-UPLB (AFFS-UPLB, INC.)</option>
                  <option value="FORESTRY SOCIETY (UPLB FS)">FORESTRY SOCIETY (UPLB FS)</option>
                  <option value="MUSSAENDA HONOR SORORITY (UP MHS)">MUSSAENDA HONOR SORORITY (UP MHS)</option>
                  <option value="SAMAHANG EKOLOHIYA NG UPLB (SAMAEKO-UPLB)">SAMAHANG EKOLOHIYA NG UPLB (SAMAEKO-UPLB)</option>
                  <option value="ZETA BETA RHO HONOR FRATERNITY (UP ZBRHF)">ZETA BETA RHO HONOR FRATERNITY (UP ZBRHF)</option>
                </optgroup>

                {/* CHE-based Organizations */}
                <optgroup label="CHE-based Organizations">
                  <option value="HUMAN AND FAMILY DEVELOPMENT SOCIETY (UP HFDSOC)">HUMAN AND FAMILY DEVELOPMENT SOCIETY (UP HFDSOC)</option>
                  <option value="HUMAN ECOLOGY STUDENT SOCIETY (UP HESS)">HUMAN ECOLOGY STUDENT SOCIETY (UP HESS)</option>
                  <option value="OIKOS (OIKOS)">OIKOS (OIKOS)</option>
                  <option value="PHILIPPINE ASSOCIATION OF NUTRITION-ALPHA OMEGA CHAPTER (PAN-AO)">PHILIPPINE ASSOCIATION OF NUTRITION-ALPHA OMEGA CHAPTER (PAN-AO)</option>
                  <option value="SOCIETY OF HUMAN SETTLEMENTS PLANNERS (UP HSP Soc)">SOCIETY OF HUMAN SETTLEMENTS PLANNERS (UP HSP Soc)</option>
                </optgroup>

                {/* CVM-based Organizations */}
                <optgroup label="CVM-based Organizations">
                  <option value="ALPHA CHIRON SOCIETY (UPACS)">ALPHA CHIRON SOCIETY (UPACS)</option>
                  <option value="International Veterinary Students' Association UP Los Baños (IVSA UPLB)">International Veterinary Students' Association UP Los Baños (IVSA UPLB)</option>
                  <option value="LADY VETERINARY STUDENTS' ASSOCIATION (UPLVSA)">LADY VETERINARY STUDENTS' ASSOCIATION (UPLVSA)</option>
                  <option value="RODEO CLUB PHILIPPINES (UP RC)">RODEO CLUB PHILIPPINES (UP RC)</option>
                  <option value="SOCIETAS MULIERUM (UPSMSORO)">SOCIETAS MULIERUM (UPSMSORO)</option>
                  <option value="SOCIETY FOR THE ADVANCEMENT OF VETERINARY EDUCATION AND RESEARCH (UP SAVER)">SOCIETY FOR THE ADVANCEMENT OF VETERINARY EDUCATION AND RESEARCH (UP SAVER)</option>
                  <option value="VENERABLE KNIGHT VETERINARIANS FRATERNITY (VKV FRATERNITY)">VENERABLE KNIGHT VETERINARIANS FRATERNITY (VKV FRATERNITY)</option>
                  <option value="VENERABLE LADY VETERINARIANS SORORITY (UP VLV Sorority)">VENERABLE LADY VETERINARIANS SORORITY (UP VLV Sorority)</option>
                  <option value="VETERINARY MEDICAL STUDENTS' SOCIETY (UP VETSOC)">VETERINARY MEDICAL STUDENTS' SOCIETY (UP VETSOC)</option>
                </optgroup>

                {/* College of Development Communication-based Organizations */}
                <optgroup label="College of Development Communication-based Organizations">
                  <option value="Linking Everyone Towards Service in the College of Development Communication (LETS-CDC)">Linking Everyone Towards Service in the College of Development Communication (LETS-CDC)</option>
                </optgroup>

                {/* College of Public Affairs and Development-based Organizations */}
                <optgroup label="College of Public Affairs and Development-based Organizations">
                  <option value="Development Management and Governance Society (UP DMGS)">Development Management and Governance Society (UP DMGS)</option>
                </optgroup>

                {/* GS-based Organizations */}
                <optgroup label="GS-based Organizations">
                  <option value="ENVIRONMENTAL SCIENCE SOCIETY (UPLB ENVISOC)">ENVIRONMENTAL SCIENCE SOCIETY (UPLB ENVISOC)</option>
                </optgroup>

                {/* N/A-based Organizations */}
                <optgroup label="N/A-based Organizations">
                  <option value="The UPLB Pre-Law Society (UPLB PLS)">The UPLB Pre-Law Society (UPLB PLS)</option>
                  <option value="Umalohokan, Inc. (Umal)">Umalohokan, Inc. (Umal)</option>
                </optgroup>

                {/* NDMO/University-Wide-based Organizations */}
                <optgroup label="NDMO/University-Wide-based Organizations">
                  <option value="League of Filipino Students - UPLB (LFS-UPLB)">League of Filipino Students - UPLB (LFS-UPLB)</option>
                </optgroup>

              </select>
            </div>
          )}

        </div>
        <div className="auth-submit">
          <button className="btn btn-primary" type = "button" onClick={handleClassify}>
            Next
          </button>
        </div>
        <div className="divider" />
      </div>
    </div>
    </>
  );
}

export default ClassificationPage;