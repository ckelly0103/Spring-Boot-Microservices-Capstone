import { useState } from 'react'
import './CustomerFilter.css'

function CustomerFilter({ onFilter, onClearFilter, isFiltering }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [advancedFilters, setAdvancedFilters] = useState({
    name: '',
    email: '',
    companyName: '',
    location: '',
    employeeCount: '',
    phoneNumber: '',
    jobTitle: ''
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
    
    if (advancedFilters.name.trim()) filters.name = advancedFilters.name.trim()
    if (advancedFilters.email.trim()) filters.email = advancedFilters.email.trim()
    if (advancedFilters.companyName.trim()) filters.companyName = advancedFilters.companyName.trim()
    if (advancedFilters.location.trim()) filters.location = advancedFilters.location.trim()
    if (advancedFilters.employeeCount) filters.employeeCount = parseInt(advancedFilters.employeeCount)
    if (advancedFilters.phoneNumber.trim()) filters.phoneNumber = advancedFilters.phoneNumber.trim()
    if (advancedFilters.jobTitle.trim()) filters.jobTitle = advancedFilters.jobTitle.trim()

    if (Object.keys(filters).length > 0) {
      await onFilter('attributes', filters)
    }
  }

  const handleClearAll = () => {
    setFilterType('')
    setFilterValue('')
    setAdvancedFilters({
      name: '',
      email: '',
      companyName: '',
      location: '',
      employeeCount: '',
      phoneNumber: '',
      jobTitle: ''
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
      <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Filter Customers</h3>
        <span className={`filter-arrow ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          {/* Simple Filter */}
          <div className="simple-filter">
        <h4>Quick Filter</h4>
        <form onSubmit={handleSimpleFilter} className="filter-form">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Select Filter Type</option>
            <option value="name">Filter by Name</option>
            <option value="company">Filter by Company</option>
            <option value="location">Filter by Location</option>
          </select>
          
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter filter value"
            className="filter-input"
            disabled={!filterType}
          />
          
          <button 
            type="submit" 
            className="btn primary"
            disabled={!filterType || !filterValue.trim() || isFiltering}
          >
            {isFiltering ? 'Filtering...' : 'Apply Filter'}
          </button>
        </form>
      </div>

      <div className="advanced-filter">
        <h4>Advanced Filter (Multiple Criteria)</h4>
        <form onSubmit={handleAdvancedFilter} className="advanced-filter-form">
          <div className="filter-grid">
            <input
              type="text"
              value={advancedFilters.name}
              onChange={(e) => updateAdvancedFilter('name', e.target.value)}
              placeholder="Filter by name"
              className="filter-input"
            />
            
            <input
              type="email"
              value={advancedFilters.email}
              onChange={(e) => updateAdvancedFilter('email', e.target.value)}
              placeholder="Filter by email"
              className="filter-input"
            />
            
            <input
              type="text"
              value={advancedFilters.companyName}
              onChange={(e) => updateAdvancedFilter('companyName', e.target.value)}
              placeholder="Filter by company"
              className="filter-input"
            />
            
            <input
              type="text"
              value={advancedFilters.location}
              onChange={(e) => updateAdvancedFilter('location', e.target.value)}
              placeholder="Filter by location"
              className="filter-input"
            />
            
            <input
              type="number"
              value={advancedFilters.employeeCount}
              onChange={(e) => updateAdvancedFilter('employeeCount', e.target.value)}
              placeholder="Min employee count"
              className="filter-input"
              min="0"
            />
            
            <input
              type="tel"
              value={advancedFilters.phoneNumber}
              onChange={(e) => updateAdvancedFilter('phoneNumber', e.target.value)}
              placeholder="Filter by phone"
              className="filter-input"
            />
            
            <input
              type="text"
              value={advancedFilters.jobTitle}
              onChange={(e) => updateAdvancedFilter('jobTitle', e.target.value)}
              placeholder="Filter by job title"
              className="filter-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn primary"
            disabled={isFiltering || Object.values(advancedFilters).every(val => !val.trim())}
          >
            {isFiltering ? 'Filtering...' : 'Apply Advanced Filter'}
          </button>
        </form>
      </div>

          <button 
            onClick={handleClearAll}
            className="btn secondary clear-btn"
            disabled={isFiltering}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomerFilter
