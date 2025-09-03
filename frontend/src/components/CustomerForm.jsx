import './CustomerForm.css'

function CustomerForm({ 
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
      <h3>{isEditing ? 'Update' : 'Add'}</h3>
      <div className="form-grid">
        <div className="form-column">
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Enter name"
          />
          
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onFormChange({ ...form, email: e.target.value })}
            placeholder="Enter email"
          />
          
          <label>Company Name</label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => onFormChange({ ...form, companyName: e.target.value })}
            placeholder="Enter company name"
          />
          
          <label>Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => onFormChange({ ...form, location: e.target.value })}
            placeholder="Enter location"
          />
        </div>
        
        <div className="form-column">
          <label>Employee Count</label>
          <input
            type="number"
            value={form.employeeCount}
            onChange={(e) => onFormChange({ ...form, employeeCount: parseInt(e.target.value) || 0 })}
            placeholder="Enter employee count"
          />
          
          <label>Phone Number</label>
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => onFormChange({ ...form, phoneNumber: e.target.value })}
            placeholder="Enter phone number"
          />
          
          <label>Job Title</label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => onFormChange({ ...form, jobTitle: e.target.value })}
            placeholder="Enter job title"
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
          disabled={!form.name || !form.email || !form.companyName || !form.location || !form.phoneNumber || !form.jobTitle}
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

export default CustomerForm
