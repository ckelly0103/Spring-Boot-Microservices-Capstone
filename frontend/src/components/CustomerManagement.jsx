import { useState, useEffect } from 'react'
import Header from './Header'
import CustomerList from './CustomerList'
import CustomerForm from './CustomerForm'
import CustomerFilter from './CustomerFilter'
import NLPQuery from './NLPQuery'
import apiService from '../api.js'
import './CustomerManagement.css'

function CustomerManagement({ onLogout, onNavigate }) {
  const [customers, setCustomers] = useState([])
  const [allCustomers, setAllCustomers] = useState([]) // Keep original list for filtering
  const [selected, setSelected] = useState(null)
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // 5 columns × 2 rows = 10 customers per page
  const [isNLPProcessing, setIsNLPProcessing] = useState(false)
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    companyName: '', 
    location: '', 
    employeeCount: 0,
    phoneNumber: '',
    jobTitle: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const data = await apiService.getAllCustomers()
      setCustomers(data)
      setAllCustomers(data)
      setActiveFilter(null)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const selectCustomer = async (id) => {
    if (selected === id) {
      console.log('Deselecting customer:', id)
      setSelected(null)
      clearForm()
    } else {
      console.log('Selecting customer:', id)
      setSelected(id)
      try {
        const customer = await apiService.getCustomer(id)
        setForm({ 
          name: customer.name, 
          email: customer.email, 
          companyName: customer.companyName,
          location: customer.location,
          employeeCount: customer.employeeCount,
          phoneNumber: customer.phoneNumber || '',
          jobTitle: customer.jobTitle || ''
        })
      } catch (error) {
        console.error('Error fetching customer:', error)
        // Fallback to finding in the list
        const customer = customers.find(c => (c._id || c.id) === id)
        if (customer) {
          setForm({ 
            name: customer.name, 
            email: customer.email, 
            companyName: customer.companyName,
            location: customer.location,
            employeeCount: customer.employeeCount,
            phoneNumber: customer.phoneNumber || '',
            jobTitle: customer.jobTitle || ''
          })
        }
      }
    }
  }

  const clearForm = () => {
    setForm({ 
      name: '', 
      email: '', 
      companyName: '', 
      location: '', 
      employeeCount: 0,
      phoneNumber: '',
      jobTitle: ''
    })
  }

  const save = async () => {
    try {
      if (selected) {
        console.log('Updating customer:', selected, form)
        await apiService.updateCustomer(selected, form)
      } else {
        console.log('Adding new customer:', form)
        await apiService.createCustomer(form)
      }
      await loadCustomers()
      setSelected(null)
      clearForm()
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const deleteCustomer = async () => {
    try {
      console.log('Deleting customer:', selected)
      await apiService.deleteCustomer(selected)
      await loadCustomers()
      setSelected(null)
      clearForm()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const cancel = () => {
    console.log('Cancelling operation')
    setSelected(null)
    clearForm()
  }

  // Pagination helper functions
  const getPaginatedCustomers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return customers.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(customers.length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSelected(null) // Clear selection when changing pages
    clearForm()
  }

  const handleFilter = async (filterType, filterValue) => {
    setIsFiltering(true)
    try {
      let filteredData
      
      switch (filterType) {
        case 'name':
          filteredData = await apiService.filterCustomersByName(filterValue)
          break
        case 'company':
          filteredData = await apiService.filterCustomersByCompany(filterValue)
          break
        case 'location':
          filteredData = await apiService.filterCustomersByLocation(filterValue)
          break
        case 'attributes':
          filteredData = await apiService.filterCustomersByAttributes(filterValue)
          break
        default:
          throw new Error('Unknown filter type')
      }
      
      setCustomers(filteredData)
      setActiveFilter({ type: filterType, value: filterValue })
      setCurrentPage(1) // Reset to first page when filtering
      setSelected(null) // Clear selection when filtering
      clearForm()
    } catch (error) {
      console.error('Error filtering customers:', error)
      alert('Error filtering customers: ' + error.message)
    } finally {
      setIsFiltering(false)
    }
  }

  const handleClearFilter = () => {
    setCustomers(allCustomers)
    setActiveFilter(null)
    setCurrentPage(1) // Reset to first page when clearing filters
    setSelected(null)
    clearForm()
  }

  const handleNLPQuery = async (action, parameters) => {
    setIsNLPProcessing(true)
    try {
      switch (action) {
        case 'filter':
          // Handle filtering operations
          if (parameters.location) {
            await handleFilter('location', parameters.location)
          } else if (parameters.companyName) {
            await handleFilter('company', parameters.companyName)
          } else if (parameters.name) {
            await handleFilter('name', parameters.name)
          } else if (parameters.employeeCount) {
            // For employee count, we'll use the attributes filter
            await handleFilter('attributes', { employeeCount: parameters.employeeCount })
          } else {
            // Generic attribute filter
            await handleFilter('attributes', parameters)
          }
          break

        case 'add':
          // Handle adding new customer
          const newCustomer = {
            name: parameters.name || '',
            email: parameters.email || '',
            companyName: parameters.companyName || '',
            location: parameters.location || '',
            employeeCount: parameters.employeeCount || 0,
            phoneNumber: parameters.phoneNumber || '',
            jobTitle: parameters.jobTitle || ''
          }
          setForm(newCustomer)
          await apiService.createCustomer(newCustomer)
          await loadCustomers()
          clearForm()
          break

        case 'update':
          // Handle updating existing customer
          if (parameters.identifier && parameters.updates) {
            // Find customer by name or email
            const customer = allCustomers.find(c => 
              c.name.toLowerCase().includes(parameters.identifier.toLowerCase()) ||
              c.email.toLowerCase().includes(parameters.identifier.toLowerCase())
            )
            
            if (customer) {
              const customerId = customer._id || customer.id
              // Merge existing customer data with updates
              const updatedCustomer = { ...customer, ...parameters.updates }
              await apiService.updateCustomer(customerId, updatedCustomer)
              await loadCustomers()
            } else {
              throw new Error(`Customer "${parameters.identifier}" not found`)
            }
          }
          break

        case 'delete':
          // Handle deleting customer
          if (parameters.identifier) {
            // Find customer by name or email
            const customer = allCustomers.find(c => 
              c.name.toLowerCase().includes(parameters.identifier.toLowerCase()) ||
              c.email.toLowerCase().includes(parameters.identifier.toLowerCase())
            )
            
            if (customer) {
              const customerId = customer._id || customer.id
              await apiService.deleteCustomer(customerId)
              await loadCustomers()
            } else {
              throw new Error(`Customer "${parameters.identifier}" not found`)
            }
          }
          break

        default:
          throw new Error('Unknown action: ' + action)
      }
    } catch (error) {
      console.error('Error executing NLP query:', error)
      throw error // Re-throw so the NLP component can handle it
    } finally {
      setIsNLPProcessing(false)
    }
  }

  return (
    <div>
      <Header 
        onLogout={onLogout} 
        currentView="customers" 
        onNavigate={onNavigate} 
      />
      
      {/* Two-column layout for NLP and Filter */}
      <div className="filter-container">
        <NLPQuery 
          onExecuteQuery={handleNLPQuery}
          customers={allCustomers}
          isProcessing={isNLPProcessing}
        />
        <CustomerFilter 
          onFilter={handleFilter}
          onClearFilter={handleClearFilter}
          isFiltering={isFiltering}
        />
      </div>
      
      {/* Customer list and form */}
      <div className="container">
        <CustomerList 
          customers={getPaginatedCustomers()}
          totalCustomers={customers.length}
          selectedCustomerId={selected}
          onSelectCustomer={selectCustomer}
          activeFilter={activeFilter}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={getTotalPages()}
          onPageChange={handlePageChange}
          onClearFilter={handleClearFilter}
        />
        <CustomerForm
          form={form}
          onFormChange={setForm}
          isEditing={!!selected}
          onSave={save}
          onDelete={deleteCustomer}
          onCancel={cancel}
          hasSelection={!!selected}
        />
      </div>
    </div>
  )
}

export default CustomerManagement
