import { useState } from 'react'
import './EventFilter.css'

function EventFilter({ onFilter, onClearFilter, isFiltering }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [advancedFilters, setAdvancedFilters] = useState({
    eventName: '',
    eventDescription: '',
    eventAvailability: '',
    eventStartDate: ''
  })

  const handleSimpleFilter = async (e) => {
    e.preventDefault()
    if (filterType && filterValue.trim()) {
      await onFilter(filterType, filterValue.trim())
    }
  }

  const handleAdvancedFilter = async (e) => {
    e.preventDefault()
    const filters = {}
    
    if (advancedFilters.eventName.trim()) filters.eventName = advancedFilters.eventName.trim()
    if (advancedFilters.eventDescription.trim()) filters.eventDescription = advancedFilters.eventDescription.trim()
    if (advancedFilters.eventAvailability) filters.eventAvailability = parseInt(advancedFilters.eventAvailability)
    if (advancedFilters.eventStartDate) filters.eventStartDate = advancedFilters.eventStartDate

    if (Object.keys(filters).length > 0) {
      await onFilter('attributes', filters)
    }
  }

  const handleClearAll = () => {
    setFilterType('')
    setFilterValue('')
    setAdvancedFilters({
      eventName: '',
      eventDescription: '',
      eventAvailability: '',
      eventStartDate: ''
    })
    onClearFilter()
  }

  const updateAdvancedFilter = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="filter-section">
      <h3>Filter Events</h3>
      
      {/* Simple Filter */}
      <form onSubmit={handleSimpleFilter} className="simple-filter">
        <div className="filter-row">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Select filter type</option>
            <option value="name">Event Name</option>
            <option value="description">Description</option>
            <option value="availability">Availability</option>
            <option value="date">Date</option>
          </select>
          
          <input
            type={filterType === 'availability' ? 'number' : filterType === 'date' ? 'date' : 'text'}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={
              filterType === 'name' ? 'Enter event name' :
              filterType === 'description' ? 'Enter description keyword' :
              filterType === 'availability' ? 'Enter availability count' :
              filterType === 'date' ? 'Select date' :
              'Enter search term'
            }
            className="filter-input"
          />
          
          <button 
            type="submit" 
            className="btn primary filter-btn"
            disabled={!filterType || !filterValue || isFiltering}
          >
            {isFiltering ? 'Filtering...' : 'Filter'}
          </button>
        </div>
      </form>

      {/* Advanced Filter Toggle */}
      <div className="advanced-toggle">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn secondary toggle-btn"
        >
          {isExpanded ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filter */}
      {isExpanded && (
        <form onSubmit={handleAdvancedFilter} className="advanced-filter">
          <div className="advanced-grid">
            <div className="advanced-column">
              <label>Event Name</label>
              <input
                type="text"
                value={advancedFilters.eventName}
                onChange={(e) => updateAdvancedFilter('eventName', e.target.value)}
                placeholder="Filter by event name"
              />
              
              <label>Description</label>
              <input
                type="text"
                value={advancedFilters.eventDescription}
                onChange={(e) => updateAdvancedFilter('eventDescription', e.target.value)}
                placeholder="Filter by description"
              />
            </div>
            
            <div className="advanced-column">
              <label>Availability</label>
              <input
                type="number"
                value={advancedFilters.eventAvailability}
                onChange={(e) => updateAdvancedFilter('eventAvailability', e.target.value)}
                placeholder="Filter by availability"
                min="0"
              />
              
              <label>Start Date</label>
              <input
                type="date"
                value={advancedFilters.eventStartDate}
                onChange={(e) => updateAdvancedFilter('eventStartDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="advanced-buttons">
            <button 
              type="submit" 
              className="btn primary"
              disabled={isFiltering}
            >
              {isFiltering ? 'Filtering...' : 'Apply Advanced Filter'}
            </button>
          </div>
        </form>
      )}

      {/* Clear All Button */}
      <div className="clear-section">
        <button 
          type="button"
          onClick={handleClearAll}
          className="btn secondary clear-all-btn"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}

export default EventFilter
