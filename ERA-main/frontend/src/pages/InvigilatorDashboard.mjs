import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../CSS/InvigilatorDashboard.css';

export const InvigilatorDashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [allocatedRoom, setAllocatedRoom] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        eid: '',
        phno: '',
    });
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.user.id;
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/details/${userId}`);
                    setUserDetails(response.data);
                    setFormData({
                        name: response.data.name,
                        email: response.data.email,
                        eid: response.data.eid || '',
                        phno: response.data.phno || '',
                    });
                    setAllocatedRoom(response.data.allocatedRoom);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchUserDetails();
    }, []);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.user.id;
            await axios.put(`http://localhost:5000/api/users/details/${userId}`, formData);
            setEditing(false);
            const response = await axios.get(`http://localhost:5000/api/users/details/${userId}`);
            setUserDetails(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleViewRoom = () => {
        if (allocatedRoom) {
            navigate(`/view-room/${allocatedRoom._id}`);
        }
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="header">
                <h1 className="dashboard-title">Invigilator Dashboard</h1>
                <div className="buttons-container">
                    <button onClick={toggleTheme} className="theme-toggle-button">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </div>
            <div className="user-details-container">
                <h2 className="details-title">Details</h2>
                {userDetails && (
                    <div className="user-details">
                        {editing ? (
                            <form className="edit-form">
                                <div>
                                    <label>Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>EID</label>
                                    <input type="text" name="eid" value={formData.eid} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Phone Number</label>
                                    <input type="text" name="phno" value={formData.phno} onChange={handleChange} />
                                </div>
                                <button type="button" onClick={handleSave} className="save-button">Save</button>
                            </form>
                        ) : (
                            <div className="details-display">
                                <p>Name: {userDetails.name}</p>
                                <p>Email: {userDetails.email}</p>
                                <p>EID: {userDetails.eid}</p>
                                <p>Phone Number: {userDetails.phno}</p>
                                <button onClick={handleEdit} className="edit-button">Edit</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <h2 className="room-title">Allocated Room</h2>
            {allocatedRoom ? (
                <div className="room-details">
                    <p>Room Number: {allocatedRoom.roomNumber}</p>
                    <p>Building: {allocatedRoom.building}</p>
                    <p>Floor: {allocatedRoom.floor}</p>
                    <p>Capacity: {allocatedRoom.capacity}</p>
                    <p>Subject: {allocatedRoom.subject}</p>
                    <p>Exam: {allocatedRoom.exam}</p>
                    <button onClick={handleViewRoom} className="view-room-button">View Room</button>
                </div>
            ) : (
                <p className="no-room">No Room is allocated</p>
            )}
        </div>
    );
};
