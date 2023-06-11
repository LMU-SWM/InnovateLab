import React, { Component } from 'react';
import './PopUp.css';

class CreateMeetingPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Title',
            location: 'Location',
            startTime: 'Start time',
            endTime: 'End time',
        };
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    };

    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    };

    handleStartTimeChange = (event) => {
        this.setState({ startTime: event.target.value });
    };

    handleEndTimeChange = (event) => {
        this.setState({ endTime: event.target.value });
    };

    handleSubmit = () => {
        const { title, description, startTime, endTime } = this.state;

        // Perform the necessary logic to create the meeting using the provided data
        console.log('Meeting edited:', { title, description, startTime, endTime });

        // Close the pop-up component
        this.props.onClose();
    };

    render() {
        const { open , title, location, startTime, endTime } = this.props;
        console.log(`${open}`)

        return (
            <div>
                {open && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <h2>Edit Meeting</h2>
                            <div className="input-container">
                                <label>Title:</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={this.handleTitleChange}
                                />
                            </div>
                            <div className="input-container">
                                <label>Location:</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={this.handleDescriptionChange}
                                />
                            </div>
                            <div className="input-container">
                                <label>Start Time:</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Start Time"
                                    value={startTime}
                                    onChange={this.handleStartTimeChange}
                                />
                            </div>
                            <div className="input-container">
                                <label>End Time:</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="End Time"
                                    value={endTime}
                                    onChange={this.handleEndTimeChange}
                                />
                            </div>
                            <div className="button-group">
                                <button className="create-button" onClick={this.handleSubmit}>
                                    Save
                                </button>
                                <button className="cancel-button" onClick={this.props.onClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default CreateMeetingPopup;
