/*
    Description: This component renders the current
    status as a pill besides the request title.

    @author Gacel Perfinian
    @date 03/28/2024
*/

// Description: Refactored file to use constants from constant.js

// @author Rheana Mindo
// @date 04/16/2024

import { REQUEST_STATUSES } from '../utilities/constant';

const BookingReservationStatusPillComponent = ({ reservationStatus }) => {
    switch (reservationStatus) {
        case REQUEST_STATUSES.PENDING:
            return (
                <span className="status-pill status-pill-pending">pending</span>
            );
        case REQUEST_STATUSES.APPROVED:
            return (
                <span className="status-pill status-pill-aproved-pending">approved&nbsp;with&nbsp;pending&nbsp;documents</span>
            );
        case REQUEST_STATUSES.DISAPPROVED:
            return (
                <span className="status-pill status-pill-disapproved">disapproved</span>
            );
        case REQUEST_STATUSES.FINALIZED:
            return (
                <span className="status-pill status-pill-finalized">finalized</span>
            );
        case REQUEST_STATUSES.CANCELLED:
            return (
                <span className="status-pill status-pill-cancelled">cancelled</span>
            );
        default:
            return (
                <span className="status-pill">status&nbsp;not&nbsp;available</span>
            );
    }
}

export default BookingReservationStatusPillComponent;