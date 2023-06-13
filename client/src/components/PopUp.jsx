import React, { Component } from 'react';
import axios from 'axios';
import './PopUp.css';

class CreateMeetingPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title,
            location: this.props.location,
            startTime: this.props.startTime,
            endTime: this.props.endTime,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.title !== prevProps.title ||
            this.props.location !== prevProps.location ||
            this.props.startTime !== prevProps.startTime ||
            this.props.endTime !== prevProps.endTime) {
            this.setState({
                title: this.props.title,
                location: this.props.location,
                startTime: this.props.startTime,
                endTime: this.props.endTime,
            });
        }
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    };

    handleLocationChange = (event) => {
        this.setState({ location: event.target.value });
    };

    handleStartTimeChange = (event) => {
        this.setState({ startTime: event.target.value });
    };

    handleEndTimeChange = (event) => {
        this.setState({ endTime: event.target.value });
    };

    handleSubmit = () => {
        const { title, location, startTime, endTime } = this.state;
        const { eventId, calendarId, accessToken } = this.props;

        const eventData = {
            summary: title,
            location: location,
            start: {
                dateTime: startTime,
            },
            end: {
                dateTime: endTime,
            },
        };

        axios.patch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`, eventData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('Meeting edited:', response.data);
                this.props.onUpdate(response.data); // add this line
                this.props.onClose();
            })
            .catch(error => {
                console.log('Error updating meeting:', error);
            });

        this.props.onClose();
    };



    render() {
        const { title, location, startTime, endTime } = this.state;
        const { open } = this.props;
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
                                    onChange={this.handleLocationChange}
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
                                <button className="save-button" onClick={this.handleSubmit}>
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
