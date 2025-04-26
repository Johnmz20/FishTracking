import { useEffect, useState } from 'react';

function App() {
  const [fishData, setFishData] = useState({ //fish you are currently typing into the form
    name: '',
    length: '',
    weight: '',
    location: '',
    timeOfDay: 'morning',
  });

  const [fishLog, setFishLog] = useState([]); //list of a;; fish caught so far
  const [searchTerm, setSearchTerm] = useState(''); //  Search state
  const [selectedFishIndex, setSelectedFishIndex] = useState(null); // editing fish caught

  useEffect(() => {
    const savedLog = localStorage.getItem('fishLog');
    if (savedLog) {
      setFishLog(JSON.parse(savedLog));
    }
  }, []);
  
  useEffect(() => {
    if (fishLog.length > 0) {
      localStorage.setItem('fishLog', JSON.stringify(fishLog));
    } else {
      localStorage.removeItem('fishLog');
    }
  }, [fishLog]);

  const handleChange = (e) => {
    setFishData({ ...fishData, [e.target.name]: e.target.value }); // handleChange updates fishData
  };

  //when clicked, checks if the fish name isn't empty
  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedName = fishData.name.trim().toLowerCase();
    if (!cleanedName) return;
    // if selectedFishIndex !== null update the fish
    if (selectedFishIndex !== null) {
      const updatedLog = [...fishLog];
      updatedLog[selectedFishIndex] = {...fishData, name: cleanedName };
      setFishLog(updatedLog);
      setSelectedFishIndex(null);
    } else { // add a new fish to the list
      setFishLog([
        ...fishLog,
        {...fishData, name: cleanedName}
      ]);
    }

    setFishData({
      name: '',
      length: '',
      weight: '',
      location: '',
      timeOfDay: 'morning',
    });
  };
  //remove the fish from the list on its index
  const handleDelete = (indexToDelete) => {
    setFishLog(fishLog.filter((_, index) => index !== indexToDelete));
    if (selectedFishIndex === indexToDelete) {
      setFishData({
        name: '',
        length: '',
        weight: '',
        location: '',
        timeOfDay: 'morning',
      });
      setSelectedFishIndex(null);
    }
  };
  //edit the fish in the form, set selectedFishIndex to remember which fish its editing
  const handleEdit = (index) => {
    const fish = fishLog[index];
    setFishData({...fish});
    setSelectedFishIndex(index);
  };

  //.redude() to create a new object, shows how many of each fish were caught
  const groupedFish = fishLog.reduce((acc, fish) => {
    const name = fish.name;
    acc[name] = acc[name] ? acc[name] + 1 : 1;
    return acc;
  }, {});

  // Filter detailed log based on search
  const filteredLog = fishLog.filter((fish) =>
    fish.name.includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{  
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#a6cbda',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
      <h1>🎣 Fish Tracker</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="fish name"
          value={fishData.name}
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '50%',
            borderRadius: '5px',
            border: '1px solid #ccc',

          }}
        />
        <input
          type="number"
          name="length"
          placeholder="fish length"
          value={fishData.length}
          onChange={handleChange}
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '50%',
            borderRadius: '5px',
            border: '1px solid #ccc',

          }}
        />
        <input
          type="number"
          name="weight"
          placeholder="fish weight"
          value={fishData.weight}
          onChange={handleChange}
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '50%',
            borderRadius: '5px',
            border: '1px solid #ccc',

          }}
        />
        <input
          type="text"
          name="location"
          placeholder="location"
          value={fishData.location}
          onChange={handleChange}
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '50%',
            borderRadius: '5px',
            border: '1px solid #ccc',

          }}
        />
        <select name="timeOfDay" value={fishData.timeOfDay} onChange={handleChange}
        style={{
          padding: '10px',
          marginBottom: '10px',
          width: '50%',
          borderRadius: '5px',
          border: '1px solid #ccc',

        }}>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
        <button type="submit" 
        style={{ 
          padding: '10px 20px',
          backgroundColor: selectedFishIndex !== null ? '#007bff' : '#28a745', 
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px', 

          }}>
          {selectedFishIndex !== null ? 'update Fish' : 'add Fish'}
        </button>
      </form>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search fish name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '8px',
          width: '100%',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <p>Total Fish Caught: {fishLog.length}</p>

      <h2>Grouped by type</h2>
      <ul>
        {Object.entries(groupedFish).map(([name, count], index) => (
          <li key={index}>
            {name.charAt(0).toUpperCase() + name.slice(1)} (x{count})
          </li>
        ))}
      </ul>

      <h2>Detailed Log</h2>
      <ul>
        {filteredLog.length > 0 ? (
          fishLog.map((fish, index) => 
          fish.name.includes(searchTerm.toLowerCase()) && (
            <li key={index}
            style={{
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#a6dacf',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            >
              <strong>
                {fish.name.charAt(0).toUpperCase() + fish.name.slice(1)}
              </strong>
              - {`${fish.length}" • ${fish.weight} lb • ${fish.location} • ${fish.timeOfDay}`}
              <button
                onClick={() => handleEdit(index)}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                style={{ 
                  marginLeft: '5px', 
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          )
        )
        ) : (
          <li>No fish matched your search.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
