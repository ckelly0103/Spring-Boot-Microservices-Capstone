import './EventForm.css'

function EventForm({ 
  form, 
  onFormChange, 
  isEditing, 
  onSave, 
  onDelete, 
  onCancel,
  hasSelection 
}) {
  return (
    <div className="form-section">
      <h3>{isEditing ? 'Update Event' : 'Add Event'}</h3>
      <div className="form-grid">
        <div className="form-column">
          <label>Event Name</label>
          <input
            type="text"
            value={form.eventName}
            onChange={(e) => onFormChange({ ...form, eventName: e.target.value })}
            placeholder="Enter event name"
          />
          
          <label>Event Description</label>
          <textarea
            value={form.eventDescription}
            onChange={(e) => onFormChange({ ...form, eventDescription: e.target.value })}
            placeholder="Enter event description"
            rows={4}
          />
        </div>
        
        <div className="form-column">
          <label>Event Availability</label>
          <input
            type="number"
            value={form.eventAvailability}
            onChange={(e) => onFormChange({ ...form, eventAvailability: parseInt(e.target.value) || 0 })}
            placeholder="Enter availability count"
            min="0"
          />
          
          <label>Event Start Date</label>
          <input
            type="date"
            value={form.eventStartDate}
            onChange={(e) => onFormChange({ ...form, eventStartDate: e.target.value })}
          />
        </div>
      </div>

      <div className="buttons">
        <button 
          className="btn danger" 
          onClick={onDelete}
          disabled={!hasSelection}
        >
          Delete
        </button>
        <button 
          className="btn primary" 
          onClick={onSave}
          disabled={!form.eventName || !form.eventDescription || !form.eventStartDate}
        >
          Save
        </button>
        <button 
          className="btn secondary" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default EventForm
