import React, { useState, useEffect } from 'react';
import todoIcon from '../components/icons_FEtask/3 dot menu.svg';
import inProgressIcon from '../components/icons_FEtask/in-progress.svg';
import doneIcon from '../components/icons_FEtask/Done.svg';
import cancelledIcon from '../components/icons_FEtask/Cancelled.svg';
import backlogIcon from '../components/icons_FEtask/Backlog.svg';

import priority0Icon from '../components/icons_FEtask/No-priority.svg';
import priority1Icon from '../components/icons_FEtask/Img - Low Priority.svg';
import priority2Icon from '../components/icons_FEtask/Img - Medium Priority.svg';
import priority3Icon from '../components/icons_FEtask/Img - High Priority.svg';
import priority4Icon from '../components/icons_FEtask/SVG - Urgent Priority colour.svg';


const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length === 1) {
        return `${names[0][0]}_`.toUpperCase();
    }
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
};
const statusIcons = {
    'Todo': <img src={todoIcon} alt="Todo" width="24" height="24" />,
    'In progress': <img src={inProgressIcon} alt="In Progress" width="24" height="24" />,
    'Done': <img src={doneIcon} alt="Done" width="24" height="24" />,
    'Cancelled': <img src={cancelledIcon} alt="Cancelled" width="24" height="24" />,
    'Backlog': <img src={backlogIcon} alt="Backlog" width="24" height="24" />,
};

const priorityIcons = {
    0: <img src={priority0Icon} alt="Priority 0" width="24" height="24" />,
    1: <img src={priority1Icon} alt="Priority 1" width="24" height="24" />,
    2: <img src={priority2Icon} alt="Priority 2" width="24" height="24" />,
    3: <img src={priority3Icon} alt="Priority 3" width="24" height="24" />,
    4: <img src={priority4Icon} alt="Priority 4" width="24" height="24" />,
};

const TicketCard = ({ ticket, users, groupBy, statusMap, priorityMap }) => {
    const user = users.find(u => u.id === ticket.userId);

    return (
        <div className="ticket-card">
            <div className="ticket-id">{ticket.id}</div>

            <div className="ticket-header">
                {groupBy !== 'status' && (
                    <div>
                        {statusIcons[ticket.status] && (
                            <>
                                {statusIcons[ticket.status]}
                                {/* {statusMap[ticket.status]} */}
                            </>
                        )}
                    </div>
                )}
                <h4 className="ticket-title">{ticket.title}</h4>
                {groupBy !== 'user' && user && (
                    <div className="user-initials">
                        {getInitials(user.name)}
                    </div>
                )}
            </div>

            <div className="ticket-details">
                {groupBy !== 'priority' && (
                    <div>
                        {priorityIcons[ticket.priority] || 'Unknown Priority'}
                        {/* {priorityMap[ticket.priority] || 'Unknown Priority'} */}
                    </div>
                )}
                <div className="ticket-feature">
                    <div className="feature-circle"></div>
                    <div className="ticket-tag-box">
                        <span className="ticket-tag">
                            {ticket.tag[0] || 'No Tag'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GroupSelector = ({ groupBy, sortBy, onGroupByChange, onSortByChange }) => {
    return (
        <div className="group-selector">
            <label>
                Group By:
                <select value={groupBy} onChange={onGroupByChange}>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                </select>
            </label>

            <label>
                Sort By:
                <select value={sortBy} onChange={onSortByChange}>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                </select>
            </label>
        </div>
    );
};

const Dashboard = ({ tickets, users }) => {
    const [groupBy, setGroupBy] = useState(() => {
        return localStorage.getItem('groupBy') || 'status';
    });
    const [sortBy, setSortBy] = useState(() => {
        return localStorage.getItem('sortBy') || 'priority';
    });
    const statusMap = {
        'Todo': 'Todo',
        'In progress': 'In Progress',
        'Done': 'Done',
        'Cancelled': 'Cancelled',
        'Backlog': 'Backlog'
    };

    const priorityMap = {
        0: 'No priority',
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Urgent'
    };
    useEffect(() => {
        localStorage.setItem('groupBy', groupBy);
    }, [groupBy]);

    useEffect(() => {
        localStorage.setItem('sortBy', sortBy);
    }, [sortBy]);

    const handleGroupByChange = (e) => setGroupBy(e.target.value);
    const handleSortByChange = (e) => setSortBy(e.target.value);

    const groupTickets = () => {
        const grouped = {};
        tickets.forEach(ticket => {
            let key;
            if (groupBy === 'status') {
                key = ticket.status;
            } else if (groupBy === 'user') {
                key = ticket.userId;
            } else if (groupBy === 'priority') {
                key = ticket.priority;
            }
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(ticket);
        });
        return grouped;
    };

    const sortTickets = (tickets) => {
        return tickets.sort((a, b) => {
            if (sortBy === 'priority') return b.priority - a.priority;
            return a.title.localeCompare(b.title);
        });
    };

    const groupedTickets = groupTickets();

    return (
        <div>
            <GroupSelector
                groupBy={groupBy}
                sortBy={sortBy}
                onGroupByChange={handleGroupByChange}
                onSortByChange={handleSortByChange}
            />

            <div className="kanban-columns">
                {Object.keys(groupedTickets).map(group => (
                    <div key={group} className="kanban-column">
                        <div className="kanban-header-container">
                            <h3 className={`kanban-header ${groupBy === 'status' ? 'status-header' : groupBy === 'priority' ? 'priority-header' : ''}`}>
                                {groupBy === 'status' ? (
                                    <>
                                        <div>
                                            {/* {statusMap[group] || 'Unknown Status'} */}
                                            {statusIcons[group]}
                                        </div>
                                        {statusMap[group]}
                                        <span style={{ fontSize: '15px', marginLeft: '5px', marginRight: '50px' }}>
                                            {groupedTickets[group].length}
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75 4C8.75 3.58579 8.41421 3.25 8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V7.25H4C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75H7.25V12C7.25 12.4142 7.58579 12.75 8 12.75C8.41421 12.75 8.75 12.4142 8.75 12V8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8.75V4Z" fill="#5C5C5E" />
                                        </svg>

                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <circle cx="2" cy="8" r="2" />
                                            <circle cx="8" cy="8" r="2" />
                                            <circle cx="14" cy="8" r="2" />
                                        </svg>
                                    </>
                                ) : groupBy === 'user' ? (
                                    <>
                                        {users.find(u => u.id === group)?.name} <span style={{ fontSize: '15px', marginLeft: '5px' }}>
                                            {groupedTickets[group].length}
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75 4C8.75 3.58579 8.41421 3.25 8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V7.25H4C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75H7.25V12C7.25 12.4142 7.58579 12.75 8 12.75C8.41421 12.75 8.75 12.4142 8.75 12V8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8.75V4Z" fill="#5C5C5E" />
                                        </svg>

                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <circle cx="2" cy="8" r="2" />
                                            <circle cx="8" cy="8" r="2" />
                                            <circle cx="14" cy="8" r="2" />
                                        </svg>
                                        <div className="user-initials-header">
                                            {getInitials(users.find(u => u.id === group)?.name)}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            {/* {priorityMap[group] || 'Unknown Priority'} */}
                                            {priorityIcons[group] || 'Unknown Priority'}
                                        </div>
                                        {priorityMap[group]} <span style={{ fontSize: '15px', marginLeft: '5px', marginRight: '50px' }}>
                                            {groupedTickets[group].length}
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75 4C8.75 3.58579 8.41421 3.25 8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V7.25H4C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75H7.25V12C7.25 12.4142 7.58579 12.75 8 12.75C8.41421 12.75 8.75 12.4142 8.75 12V8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8.75V4Z" fill="#5C5C5E" />
                                        </svg>

                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <circle cx="2" cy="8" r="2" />
                                            <circle cx="8" cy="8" r="2" />
                                            <circle cx="14" cy="8" r="2" />
                                        </svg>
                                    </>
                                )}
                            </h3>
                            <div className="heading-decoration"></div>
                        </div>
                        {sortTickets(groupedTickets[group]).map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} users={users} groupBy={groupBy} statusMap={statusMap} priorityMap={priorityMap} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
