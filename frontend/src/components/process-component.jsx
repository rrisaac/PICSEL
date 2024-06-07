import React, { useState } from 'react';

/**
  Added the informations regarding to the process users need to know. 
  A total of 4 secions so far: Introduction of the page, Booking A room reservation
  Managing a Reservation, and Chat feature explanation. All contains step by step process.
  Right side of the page left empty for possible placement for images as a guide as well. 
  (@date 03/16/2024)

  Changes: Fix content alignment and replace 'our dedicated support team' to Kuya JJ

  @author Cyrus Jade Barilea
  @date 04/01/2024
*/


const processComponent = () => {
    return (
        <>
        {/* Blog Section Start */}
        <div className="blog-area blog-details white-bg pt-40 pb-120 clearfix">
          <div className="container" >
            <div >
              <div style={{justifyContent: 'center' , maxWidth: '70%', margin: '0 auto'}}>
                <div>
                  <div className="thumb mb-60" >
                    <img src="assets/img/process_room_pic.png" alt="Room"/>
                  </div>
                  
                  <div className="blog-text plr-50 mb-70" style={{display: "flex", flexDirection: 'column'}}>
                      <p style={{fontSize:"15px", textAlign:"justify"}}>
    Welcome to PICSEL: Platform for Institute of Computer Science Scheduling, Events, and Logistics, your one-stop solution for managing reservations and events within the ICS department. Here's a detailed guide to help you navigate through the booking process seamlessly:</p>
                      <br/>
                      <AccordionComponent/>
                      

                      <p style={{fontSize:"15px", textAlign:"justify"}}>
                      <br/>
                      By following these comprehensive instructions, you can make the most out of PICSEL's features and enjoy a seamless booking experience tailored to your needs. Remember, you have the flexibility to cancel your request at any point before it is marked as "Finalized." We're committed to providing you with a convenient and efficient booking process, ensuring that your events within the ICS department run smoothly.:</p>
                  </div>
                  
                </div>
                {/* Single Post End */}
              </div>
            </div>
          </div>
        </div>
        {/* Blog Section End */}
       
      </>    
    );
}


const AccordionComponent = () => {
  const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isOpen ? 'true' : 'false'}
          >
            {title}
          </button>
        </h2>
        <div
          className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <div className="accordion-body" style={{textAlign:"justify"}}>{content}</div>
        </div>
      </div>
    );
  };

  const App = () => {
    return (
      <div className="accordion" id="accordionExample">
        <AccordionItem
          title="Step 1: Create User Account"
          content="Begin by creating an account on our intuitive web application. Once logged in, familiarize yourself with the platform to ensure a smooth experience."
        />
        <AccordionItem
          title="Step 2: Create Booking Request"
          content="To initiate the booking process, click on 'Book Reservation' where you'll be prompted to enter essential details about your event, including the date, time, and the specific ICS room you wish to reserve. Upon submission, your booking request will be generated with a status of 'pending.'"
        />
        <AccordionItem
          title="Step 3: Track Request Approval"
          content="Keep track of your booking status by visiting the 'Booking Status' section. Here, you'll be able to monitor the progress of your request. Our diligent admin team will review your request to ensure it aligns with the department's schedule, avoiding conflicts with classes or other events. If your request is deemed valid, it will be marked as 'approved with pending documents.' Otherwise, if it does not meet the criteria, it will be marked as 'disapproved,' and the request will be terminated."
        />
        <AccordionItem
          title="Step 4: Supply Essential Documents"
          content="For requests marked as 'approved with pending documents,' you'll need to supply and upload the necessary documentation such as forms, receipts, or any other essential files. This step is crucial for the finalization of your booking."
        />
        <AccordionItem
          title="Step 5: Wait Document Validation"
          content="Once you've uploaded the required attachments, our admin team will review them promptly. If all documents meet the validation criteria, your request will be marked as 'finalized,' indicating that your booking reservation is complete. However, if any discrepancies are found, you'll be notified to upload valid files again."
        />
        <AccordionItem
          title="Step 6: Complete Booking Reservation"
          content="With a finalized booking request, you can now look forward to utilizing the reserved ICS room for your event. Take advantage of the amenities provided in the room to enhance your experience. Additionally, please remember to settle any utility fees with our dedicated workers after the event to ensure a hassle-free process."
        />
      </div>
    );
  };

  return <App />;
};


export default processComponent;
