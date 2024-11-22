import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        throw new Error("Invalid JSON: Missing 'data' field");
      }

      // Reset error and filtered response
      setError(null);
      setFilteredResponse(null);

      // Call the backend API
      const result = await axios.post("http://localhost:3000/bfhl", parsedInput);
      setResponse(result.data);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions);

    if (!response) return;

    const filtered = {};
    selectedOptions.forEach((filter) => {
      if (response[filter.value]) {
        filtered[filter.value] = response[filter.value];
      }
    });

    setFilteredResponse(filtered);
  };

  return (
    <div className="App">
      {/* Website Title */}
      <h1>ABCD123</h1>

      {/* JSON Input Section */}
      <div>
        <textarea
          rows="5"
          placeholder='Enter JSON, e.g., {"data": ["A", "1", "b", "4"]}'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {/* Multi-Select Dropdown */}
      {response && (
        <div>
          <Select
            options={options}
            isMulti
            onChange={handleFilterChange}
            placeholder="Filter response..."
          />
        </div>
      )}

      {/* Filtered Response */}
      {filteredResponse && (
        <div className="filtered-response">
          <h3>Filtered Response:</h3>
          <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
        </div>
      )}

      {/* Full Response */}
      {response && (
        <div className="full-response">
          <h3>Full Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
