/*
    Description: This component shows the summary of reservations.
    It shows a table of room usage, finalized requests, and revenue from reservations.
    @author: Aljon Novelo
    @date: 05/03/2024
*/

/**
 * @description Fetches the data for the room usage, finalized requests, and revenue from reservations tables.
 * Also added search functionality for each table.
 * @author Aira Nicole Natividad
 * @date 05/05/2024
 */

import React, { useState, useEffect } from 'react';
import * as api from "../utilities/api";
const { SUMMARY_REPORT } = require('../utilities/constant.js');

// This is the main component
const SummaryReportModalComponent = ({ showModal, handleClose }) => {
    // Tab constants
    const TABS = {
        OVERVIEW: 'overview',
        REQUEST: 'finalized requests',
        REVENUE: 'revenue'
    };

    // Initialize the state for the active tab
    const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

    // Set inital data
    const [overviewData, setOverviewData] = useState([]);
    const [finalizedRequestsData, setFinalizedRequestsData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    // Filtered data for search function
    const [overviewSearch, setOverviewSearch] = useState('');
    const [requestsSearch, setRequestsSearch] = useState('');
    const [revenueSearch, setRevenueSearch] = useState('');

    // For sorting the tables
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    useEffect(() => {
        fetchRoomUsageOverview(); 
        fetchFinalizedRequestsSR();
        fetchRevenueGeneration();
    }, []); 

    const fetchRoomUsageOverview = async () => {    
        try {
            const result = await api.getRoomUsageOverview();
            if (result.data && result.data.success) {
                setOverviewData(result.data.overviewData);
            }
        } catch (error) {
            console.error("Error during fetchRoomUsageOverview:", error.message);
            return;
        }
    };

    const fetchFinalizedRequestsSR = async () => {    
        try {
            const result = await api.getFinalizedRequestsSR();
            if (result.data && result.data.success) {
                setFinalizedRequestsData(result.data.finalizedRequestsData);
            }
        } catch (error) {
            console.error("Error during fetchFinalizedRequestsSR:", error.message);
            return;
        }
    };

    const fetchRevenueGeneration = async () => {    
        try {
            const result = await api.getRevenueGeneration();
            if (result.data && result.data.success) {
                setRevenueData(result.data.revenueData);
            }
        } catch (error) {
            console.error("Error during fetchRevenueGeneration:", error.message);
            return;
        }
    };

    // Filtered data based on search input
    const filteredOverviewData = overviewData.filter(overview =>
        overview.room.toLowerCase().includes(overviewSearch.toLowerCase())
    );
    const filteredRequestsData = finalizedRequestsData.filter(request =>
        request.room.toLowerCase().includes(requestsSearch.toLowerCase()) ||
        request.eventTitle.toLowerCase().includes(requestsSearch.toLowerCase()) ||
        request.reservedBy.toLowerCase().includes(requestsSearch.toLowerCase()) ||
        request.date.toLowerCase().includes(requestsSearch.toLowerCase())
    );
    const filteredRevenueData = revenueData.filter(revenue =>
        revenue.room.toLowerCase().includes(revenueSearch.toLowerCase())
    );

    const sortedItems = (items) => {
        let sortableItems = [...items];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    };    

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getClassNamesFor = (name) => {
        if (sortConfig.key === name) {
            return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return '↑↓';  // Default icon showing both directions but not active
    };

    // Modal Section
    return (
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ overflow: 'hidden' }}>
            <div className="modal-backdrop fade show" style={{ overflow: 'auto' }}>
                <div className="modal-dialog-sr modal-dialog-centered modal-dialog-scrollable"  >
                    <div className="modal-content summary-report-container">
                        <div className="modal-header">
                            <h2 className="modal-title" id="exampleModalCenterTitle">
                                Summary Report
                            </h2>
                            <p>
                                This report covers the period of the {SUMMARY_REPORT.SEM_NUM} AY {SUMMARY_REPORT.ACAD_YEAR}. It provides details on room utilization and financial performance derived from reservation and revenue data.
                            </p>
                        </div>
                        <div className="modal-body">
                            {/* Tabs */}
                            <ul className="nav nav-tabs summary-report-tabs">
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link clear ${activeTab === TABS.OVERVIEW ? 'active' : ''}`} onClick={() => setActiveTab(TABS.OVERVIEW)}>Room Usage Overview</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link clear ${activeTab === TABS.REQUEST ? 'active' : ''}`} onClick={() => setActiveTab(TABS.REQUEST)}>All Finalized Requests</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link clear ${activeTab === TABS.REVENUE ? 'active' : ''}`} onClick={() => setActiveTab(TABS.REVENUE)}>Revenue Generation</button>
                                </li>
                            </ul>

                            {/* Tab Content */}
                            <div className="tab-content summary-data-container">
                                {/* Room Usage Overview Tab */}
                                {activeTab === TABS.OVERVIEW && (
                                <>
                                    <input
                                        type="text"
                                        className="form-control mb-0"
                                        placeholder="Search by Room Name..."
                                        value={overviewSearch}
                                        onChange={(e) => setOverviewSearch(e.target.value)}
                                    />
                                    <table className="table table-hover summary-table">
                                        <thead className="table-dark ">
                                            {/* The fields of the table */}
                                            <tr>
                                                <th className="overview-field" onClick={() => requestSort('room')}>
                                                    Room Name <span className={`sort-icon ${sortConfig.key === 'room' ? 'active' : ''}`}>{getClassNamesFor('room')}</span></th>
                                                <th className="overview-field" onClick={() => requestSort('totalReservations')}>
                                                    Total Number of Reservations <span className={`sort-icon ${sortConfig.key === 'totalReservations' ? 'active' : ''}`}>{getClassNamesFor('totalReservations')}</span></th>
                                                <th className="overview-field" onClick={() => requestSort('totalDuration')}>
                                                    Total Duration of Reservations (Hours) <span className={`sort-icon ${sortConfig.key === 'totalDuration' ? 'active' : ''}`}>{getClassNamesFor('totalDuration')}</span></th>
                                                <th className="overview-field" onClick={() => requestSort('averageDuration')}>
                                                    Average Duration of Reservations (Hours) <span className={`sort-icon ${sortConfig.key === 'averageDuration' ? 'active' : ''}`}>{getClassNamesFor('averageDuration')}</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="summary-data">
                                            {/* Render the data */}
                                            {sortedItems(filteredOverviewData).map((overview, index) => (
                                                (
                                                    <tr key={index}>
                                                        <td className="overview-table-data">{overview.room}</td>
                                                        <td className="overview-table-data">{overview.totalReservations}</td>
                                                        <td className="overview-table-data">{overview.totalDuration}</td>
                                                        <td className="overview-table-data">{overview.averageDuration}</td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                                )}

                                {/* All Finalized Requests Tab */}
                                {activeTab === TABS.REQUEST && (
                                <>
                                    <input
                                        type="text"
                                        className="form-control mb-0"
                                        placeholder="Search by Room Name, Date, Event Title, or Reserved By..."
                                        value={requestsSearch}
                                        onChange={(e) => setRequestsSearch(e.target.value)}
                                    />
                                    <table className="table table-hover summary-table">
                                        <thead className="table-dark">
                                            {/* The fields of the table */}
                                            <tr>
                                                <th className="overview-field" onClick={() => requestSort('room')}>
                                                    Room Name <span className={`sort-icon ${sortConfig.key === 'room' ? 'active' : ''}`}>{getClassNamesFor('room')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('date')}>
                                                    Date <span className={`sort-icon ${sortConfig.key === 'date' ? 'active' : ''}`}>{getClassNamesFor('date')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('eventTitle')}>
                                                    Event Title <span className={`sort-icon ${sortConfig.key === 'eventTitle' ? 'active' : ''}`}>{getClassNamesFor('eventTitle')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('startTime')}>
                                                    Start Time <span className={`sort-icon ${sortConfig.key === 'startTime' ? 'active' : ''}`}>{getClassNamesFor('startTime')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('endTime')}>
                                                    End Time <span className={`sort-icon ${sortConfig.key === 'endTime' ? 'active' : ''}`}>{getClassNamesFor('endTime')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('reservedBy')}>
                                                    Reserved By <span className={`sort-icon ${sortConfig.key === 'reservedBy' ? 'active' : ''}`}>{getClassNamesFor('reservedBy')}</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="summary-data">
                                            {/* Render the data */}
                                            {sortedItems(filteredRequestsData).map((finalizedRequests, index) => (
                                                (
                                                    <tr key={index}>
                                                        <td className="finalized-requests-table-data">{finalizedRequests.room}</td>
                                                        <td className="finalized-requests-table-data">{finalizedRequests.date}</td>
                                                        <td className="finalized-requests-table-data">{finalizedRequests.eventTitle}</td>
                                                        <td className="finalized-requests-table-data">{finalizedRequests.startTime}</td>
                                                        <td className="finalized-requests-table-data">{finalizedRequests.endTime}</td>
                                                        <td className="finalized-requests-table-data">{finalizedRequests.reservedBy}</td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                                )}
                                {/* Revenue Generation Tab */}
                                {activeTab === TABS.REVENUE && (
                                <>
                                    <input
                                        type="text"
                                        className="form-control mb-0"
                                        placeholder="Search by Room Name..."
                                        value={revenueSearch}
                                        onChange={(e) => setRevenueSearch(e.target.value)}
                                    />
                                    <table className="table table-hover summary-table">
                                        <thead className="table-dark ">
                                            {/* The fields of the table */}
                                            <tr>
                                                <th className="overview-field" onClick={() => requestSort('room')}>
                                                    Room Name <span className={`sort-icon ${sortConfig.key === 'room' ? 'active' : ''}`}>{getClassNamesFor('room')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('totalReservations')}>
                                                    Total Number of Reservations <span className={`sort-icon ${sortConfig.key === 'totalReservations' ? 'active' : ''}`}>{getClassNamesFor('totalReservations')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('totalRevenue')}>
                                                    Total Revenue (₱) <span className={`sort-icon ${sortConfig.key === 'totalRevenue' ? 'active' : ''}`}>{getClassNamesFor('totalRevenue')}</span>
                                                </th>
                                                <th className="overview-field" onClick={() => requestSort('averageRevenue')}>
                                                    Average Revenue of Reservations (₱) <span className={`sort-icon ${sortConfig.key === 'averageRevenue' ? 'active' : ''}`}>{getClassNamesFor('averageRevenue')}</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="summary-data">
                                            {/* Render the data */}
                                            {sortedItems(filteredRevenueData).map((revenue, index) => (
                                                (
                                                    <tr key={index}>
                                                        <td className="revenue-table-data">{revenue.room}</td>
                                                        <td className="revenue-table-data">{revenue.totalReservations}</td>
                                                        <td className="revenue-table-data">{revenue.totalRevenue}</td>
                                                        <td className="revenue-table-data">{revenue.averageRevenue}</td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryReportModalComponent;