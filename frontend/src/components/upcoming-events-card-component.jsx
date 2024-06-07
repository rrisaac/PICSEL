/* Description: Displays the number of upcoming events and the number of days from current date to the most upcoming finalized request date.

@author Prince Czedrick Nepomuceno
@date 04/27/2024
*/

import React, { useState, useEffect } from 'react';
import * as api from "../utilities/api.js";

const UpcomingEventsCardComponent = () => {
  const [upcomingEvents, setUpcomingEvents] = useState({
    count: 0,
    closestDate: null,
  });

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.getFinalizedRequests();
        const data = response.data.requests; // Assuming response.data contains the requests

        const formattedRequests = data.map((request) => ({
          ...request,
          startDate: new Date(request.start),
          endDate: new Date(request.end),
        }));

        const today = new Date();

        const upcomingRequests = formattedRequests.filter(
          (request) => request.startDate >= today
        );



        const sortedRequests = upcomingRequests.sort(
          (a, b) => a.startDate - b.startDate
        );

        const upcomingEventCount = sortedRequests.length;
        const closestUpcomingDate = sortedRequests.length > 0 ? sortedRequests[0].startDate : null;

        setUpcomingEvents({
          count: upcomingEventCount,
          closestDate: closestUpcomingDate,
        });
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        // Handle the error in a meaningful way (e.g., display an error message to the user)
      }
    };

    fetchUpcomingEvents();
  }, []);



  const displayUpcomingEvent = () => {
    const { count, closestDate } = upcomingEvents;
    const today = new Date();

    if (count === 0) {
      return (
        <span className="widget-stats-info">No upcoming events</span>
      );
    }

    const daysUntilEvent = closestDate ? (
      closestDate.getDate() === today.getDate() &&
        closestDate.getMonth() === today.getMonth() &&
        closestDate.getFullYear() === today.getFullYear()
        ? 'today'
        : Math.ceil((new Date(closestDate) - today) / (1000 * 60 * 60 * 24))
    ) : 0;

    return (
      <>
        <span className="widget-stats-amount">{count}</span>
        <span className="widget-stats-info">Latest: {daysUntilEvent} day{daysUntilEvent !== 1 ? 's' : ''} from now</span>
      </>
    );
  };

  return (
    <div className="card widget widget-stats">
      <div className="card-body">
        <div className="widget-stats-container d-flex">
          <div className="widget-stats-icon widget-stats-icon-warning">
            <i className="material-icons-outlined">event</i>
          </div>
          <div className="widget-stats-content flex-fill">
            <span className="widget-stats-title">Upcoming Events</span>
            {displayUpcomingEvent()}
          </div>
          <a href="/dashboard/calendar" className="align-self-start"><i className="material-icons">north_east</i></a>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsCardComponent;
