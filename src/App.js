import { useState } from 'react';

function App() {
  const [fishData, setFishData] = useState({
    name: '',
    length: '',
    weight: '',
    location: '',
    timeOfDay: 'morning',
  });

  const [fishLog, setFishLog] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 🆕 Search state
  const [selectedFishIndex, setSelectedFishIndex] = useState(null);

  const handleChange = (e) => {
    setFishData({ ...fishData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedName = fishData.name.trim().toLowerCase();
    if (!cleanedName) return;

    if (selectedFishIndex !== null) {
      const updatedLog = [...fishLog];
      updatedLog[selectedFishIndex] = {...fishData, name: cleanedName };
      setFishLog(updatedLog);
      setSelectedFishIndex(null);
    } else {
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

  const handleEdit = (index) => {
    const fish = fishLog[index];
    setFishData({...fish});
    setSelectedFishIndex(index);
  };


  const groupedFish = fishLog.reduce((acc, fish) => {
    const name = fish.name;
    acc[name] = acc[name] ? acc[name] + 1 : 1;
    return acc;
  }, {});

  // 🧠 Filter detailed log based on search
  const filteredLog = fishLog.filter((fish) =>
    fish.name.includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1>🎣 Fish Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="fish name"
          value={fishData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="length"
          placeholder="fish length"
          value={fishData.length}
          onChange={handleChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="fish weight"
          value={fishData.weight}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="location"
          value={fishData.location}
          onChange={handleChange}
        />
        <select name="timeOfDay" value={fishData.timeOfDay} onChange={handleChange}>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
        <button type="submit" style={{ padding: '8px 12px', marginTop: '10px' }}>
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
          filteredLog.map((fish, index) => (
            <li key={index}>
              <strong>
                {fish.name.charAt(0).toUpperCase() + fish.name.slice(1)}
              </strong>
              - {` ${fish.length}" • ${fish.weight} lb • ${fish.location} • ${fish.timeOfDay}`}
              <button
              onClick={() => handleEdit(index)}
              style={{ marginLeft: '10px'}}
              > edit</button>
              <button
              onClick={() => handleDelete(index)}
              style={{marginLeft: '5px', color: 'red'}}
              > Delete</button>
            </li>
          ))
        ) : (
          <li>No fish matched your search.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
