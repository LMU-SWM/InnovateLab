import React from "react";

function EventPopup({ isOpen, eventData, onChange, onSave, onCancel, onDelete }) {
  if (!isOpen) {
    return null;
  }

  const handleChange = (field) => (e) => {
    onChange({ ...eventData, [field]: e.target.value });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Event</h2>
        <label>
          Summary:
          <input
            type="text"
            value={eventData.summary || ""}
            onChange={handleChange('summary')}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            value={eventData.location || ""}
            onChange={handleChange('location')}
          />
        </label>
        <button onClick={onSave}>Save Event</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default EventPopup;
