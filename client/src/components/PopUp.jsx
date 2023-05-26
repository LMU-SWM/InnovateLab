import React, { useState } from 'react';
import './PopUp.css';

const CreateMeetingPopup = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('title');
    const [description, setDescription] = useState('description');
    const [startTime, setStartTime] = useState('time');
    const [endTime, setEndTime] = useState('endtime');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
    };

    const handleSubmit = () => {
        // Perform the necessary logic to create the meeting using the provided data
        console.log('Meeting created:', {
            title,
            description,
            startTime,
            endTime,
        });

        // Close the pop-up component
        handleClose();
    };

    return (
        <div>
            <button className="open-popup-button" onClick={handleOpen}>Create Meeting</button>

            {open && (
                <div className="popup-container">
                    <div className="popup-content">
                        <h2>Create Meeting</h2>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={handleTitleChange}
                        />
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Start Time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                        />
                        <input
                            className="input-field"
                            type="text"
                            placeholder="End Time"
                            value={endTime}
                            onChange={handleEndTimeChange}
                        />
                        <div className="button-group">
                            <button className="create-button" onClick={handleSubmit}>Create</button>
                            <button className="cancel-button" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateMeetingPopup;