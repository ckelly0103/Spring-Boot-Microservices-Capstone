import { useState } from 'react'
import './NLPQuery.css'

function NLPQuery({ onExecuteQuery, customers, isProcessing }) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)

    try {
      const schema = {
        customerFields: ['name', 'email', 'companyName', 'location', 'employeeCount', 'phoneNumber', 'jobTitle'],
        sampleCustomer: customers.length > 0 ? customers[0] : {
          name: 'John Doe',
          email: 'john@example.com',
          companyName: 'Example Corp',
          location: 'New York',
          employeeCount: 100,
          phoneNumber: '555-1234',
          jobTitle: 'Manager'
        },
        availableOperations: ['filter', 'add', 'update', 'delete'],
        totalCustomers: customers.length
      }

      const systemPrompt = `You are an AI assistant that interprets natural language queries for a customer management system. 

Customer Database Schema:
- name (string): Customer's full name
- email (string): Email address
- companyName (string): Company name
- location (string): Geographic location
- employeeCount (number): Number of employees
- phoneNumber (string): Phone number
- jobTitle (string): Job title

Available Operations:
1. FILTER: Show customers based on criteria
2. ADD: Create new customer (requires all fields)
3. UPDATE: Modify existing customer data
4. DELETE: Remove customer from database

Your task is to analyze the user's request and return a JSON response with:
{
  "action": "filter|add|update|delete",
  "parameters": {...},
  "requiresInput": boolean,
  "message": "explanation or error message",
  "success": boolean
}

For FILTER operations:
- Extract the field and value to filter by
- Support filtering by any customer field

For ADD operations:
- Extract all customer fields from the query
- If any required fields are missing, set requiresInput: true and list missing fields

For UPDATE operations:
- Extract the customer identifier (name/email) and the fields to update
- Support updating any customer field

For DELETE operations:
- Extract the customer identifier (name/email)

Current customers count: ${schema.totalCustomers}

Be helpful and conversational in your messages while being precise with the JSON structure.`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
      
      if (!apiKey) {
        console.error('VITE_GEMINI_API_KEY not found in environment variables');
        return;
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Query: "${query}"\n\nPlease analyze this query and respond with the appropriate JSON structure.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
          },
        }),
      })

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('API Response data:', data);
      console.log('AI Response text:', data.candidates[0].content.parts[0].text);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response structure from Gemini API');
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text

      let parsedResponse
      try {
        let jsonString = aiResponse.trim()
        
        if (jsonString.startsWith('```json')) {
          jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonString.startsWith('```')) {
          jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
          console.log('Parsed AI response:', parsedResponse)
        } else {
          throw new Error('No valid JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        console.error('Raw AI response:', aiResponse)
        return
      }

      if (parsedResponse.success && !parsedResponse.requiresInput) {
        const action = parsedResponse.action.toLowerCase()
        let parameters = parsedResponse.parameters
        
        // Handle identifier normalization for update and delete operations
        if (action === 'update' || action === 'delete') {
          if (parameters.identifier && typeof parameters.identifier === 'object') {
            parameters.identifier = parameters.identifier.name || parameters.identifier.email || ''
          } else if (parameters.name && !parameters.identifier) {
            parameters = { ...parameters, identifier: parameters.name }
            delete parameters.name
          } else if (parameters.email && !parameters.identifier) {
            parameters = { ...parameters, identifier: parameters.email }
            delete parameters.email
          }
        }
        
        console.log('Executing action:', action, 'with parameters:', parameters)
        await onExecuteQuery(action, parameters)
      }

    } catch (error) {
      console.error('Error processing query:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className="nlp-query-section">
      <div className="nlp-header">
        <h3>Filter by natural language:</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="nlp-form">
        <div className="query-input-container">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query here..."
            className="query-input"
            rows={3}
            disabled={isLoading || isProcessing}
          />
        </div>
        
        <div className="nlp-buttons">
          <button 
            type="submit" 
            className="btn primary"
            disabled={!query.trim() || isLoading || isProcessing}
          >
            {isLoading ? 'Processing...' : 'Send Query'}
          </button>
          
          <button 
            type="button" 
            onClick={handleClear}
            className="btn secondary"
            disabled={isLoading || isProcessing}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default NLPQuery
