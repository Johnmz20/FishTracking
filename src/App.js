import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
    const [fishData, setFishData] = useState({
        //fish you are currently typing into the form
        name: "",
        length: "",
        weight: "",
        location: "",
        timeOfDay: "morning",
        image: "",
    });

    const [fishLog, setFishLog] = useState([]); //list of all fish caught so far
    const [searchTerm, setSearchTerm] = useState(""); //  Search state
    const [selectedFishIndex, setSelectedFishIndex] = useState(null); // editing fish caught
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const getFishEmoji = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('striped bass')) return '🐟';
      if (lowerName.includes('shark')) return '🦈';
      if (lowerName.includes('catfish')) return '🐡';
      if (lowerName.includes('salmon')) return '🐠';
      if (lowerName.includes('trout')) return '🐟';
      if (lowerName.includes('tuna')) return '🐟';
      if (lowerName.includes('snapper')) return '🐠';
      if (lowerName.includes('perch')) return '🐟';
      if (lowerName.includes('flounder')) return '🦑';
      if (lowerName.includes('porgy')) return '🐟';
      return '🎣'; // default fishing pole emoji if no match
    };

    useEffect(() => {
        const savedLog = localStorage.getItem("fishLog");
        if (savedLog) {
            setFishLog(JSON.parse(savedLog));
        }
    }, []);

    useEffect(() => {
        if (fishLog.length > 0) {
            localStorage.setItem("fishLog", JSON.stringify(fishLog));
        } else {
            localStorage.removeItem("fishLog");
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
            updatedLog[selectedFishIndex] = { ...fishData, name: cleanedName };
            setFishLog(updatedLog);
            setSelectedFishIndex(null);
        } else {
            // add a new fish to the list
            setFishLog([...fishLog, { ...fishData, name: cleanedName }]);
        }

        setFishData({
            name: "",
            length: "",
            weight: "",
            location: "",
            timeOfDay: "morning",
            image: "",
        });
    };
    //remove the fish from the list on its index
    const handleDelete = (indexToDelete) => {
        setFishLog(fishLog.filter((_, index) => index !== indexToDelete));
        if (selectedFishIndex === indexToDelete) {
            setFishData({
                name: "",
                length: "",
                weight: "",
                location: "",
                timeOfDay: "morning",
            });
            setSelectedFishIndex(null);
        }
    };
    //edit the fish in the form, set selectedFishIndex to remember which fish its editing
    const handleEdit = (index) => {
        const fish = fishLog[index];
        setFishData({ ...fish });
        setSelectedFishIndex(index);
    };

    //.redude() to create a new object, shows how many of each fish were caught
    const groupedFish = fishLog.reduce((acc, fish) => {
        const name = fish.name;
        acc[name] = acc[name] ? acc[name] + 1 : 1;
        return acc;
    }, {});

    // Filter detailed log based on search
    const filteredLog = fishLog
  .filter((fish) =>
    fish.name.includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.name.localeCompare(b.name));

    //shows a pie chart of each fish caught
    const  pieData = {
        labels: Object.keys(groupedFish).map(name => name.charAt(0).toUpperCase() + name.slice(1)),
        datasets: [
            {
                label: 'fish caught',
                data: Object.values(groupedFish),
                backgroundColor: [
                   '#ff6384',
                    '#36a2eb',
                    '#ffcd56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff9f40',
                    '#66ff66',
                    '#ff6666',
                ],
                borderWidth: 1,
            },
        ],
    };

    //reset their fish log
    const handleClearAll = () => {
        if(window.confirm('are you sure you want to clear all fish?')) {
            setFishLog([]);
            localStorage.removeItem('fishLog');
        }
    }

    return (
        <div
          style={{
            maxWidth: "800px",
            margin: "40px auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: isDarkMode ? "#2c2c2c" : "#a6cbda",
            color: isDarkMode ? "#fff" : "#000",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1>🎣 Fish Tracker</h1>
    
          <button
            type="button"
            onClick={() => setIsDarkMode(prev => !prev)}
            style={{
              padding: '8px 16px',
              backgroundColor: isDarkMode ? '#444' : '#ddd',
              color: isDarkMode ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button 
            type="button"
            onClick={handleClearAll}
            style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px',
                marginLeft: '10px'
            }}
          >
          🧹 Clear All Fish
          </button>
    
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              marginBottom: "20px",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Fish Name"
              value={fishData.name}
              onChange={handleChange}
              required
              style={{ padding: "10px", marginBottom: "10px", width: "100%", maxWidth: "400px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              name="length"
              placeholder="Fish Length"
              value={fishData.length}
              onChange={handleChange}
              style={{ padding: "10px", marginBottom: "10px", width: "100%", maxWidth: "400px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              name="weight"
              placeholder="Fish Weight"
              value={fishData.weight}
              onChange={handleChange}
              style={{ padding: "10px", marginBottom: "10px", width: "100%", maxWidth: "400px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={fishData.location}
              onChange={handleChange}
              style={{ padding: "10px", marginBottom: "10px", width: "100%", maxWidth: "400px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <select
              name="timeOfDay"
              value={fishData.timeOfDay}
              onChange={handleChange}
              style={{ padding: "10px", marginBottom: "10px", width: "100%", maxWidth: "400px", borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFishData(prev => ({ ...prev, image: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ padding: "10px", marginBottom: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button
              type="submit"
              style={{ padding: "10px 20px", backgroundColor: selectedFishIndex !== null ? "#007bff" : "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
            >
              {selectedFishIndex !== null ? "Update Fish" : "Add Fish"}
            </button>
          </form>
    
          <input
            type="text"
            placeholder="Search fish name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "100%", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
    
          <p>Total Fish Caught: {fishLog.length}</p>
    
          <h2>Grouped by type</h2>
    
          <div style={{ maxWidth: "300px", margin: "20px auto" }}>
            <Pie data={pieData} />
          </div>
    
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {fishLog.length === 0 ? (
              <li style={{ textAlign: "center", marginTop: "20px", fontSize: "18px" }}>
                🎣 No fish caught yet! Add your first catch above.
              </li>
            ) : filteredLog.length > 0 ? (
              filteredLog.map((fish, index) => (
                <li key={index}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    backgroundColor: isDarkMode ? "#444" : "#a6dacf",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    textAlign: "center"
                  }}
                >
                  {fish.image && (
                    <img
                      src={fish.image}
                      alt={fish.name}
                      style={{ maxWidth: "100px", height: "auto", marginBottom: "10px", borderRadius: "8px", display: "block", margin: "0 auto" }}
                      onClick={() => setSelectedImage(fish.image)}
                    />
                  )}
                  <strong>{getFishEmoji(fish.name)} {fish.name.charAt(0).toUpperCase() + fish.name.slice(1)}</strong> - {fish.length}" • {fish.weight} lb •{" "}
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(fish.location)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>
                    {fish.location}
                  </a> • {fish.timeOfDay}
                  <div>
                    <button onClick={() => handleEdit(index)} style={{ margin: "10px 5px 0 0", backgroundColor: "#007bff", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(index)} style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li style={{ textAlign: "center", marginTop: "20px", fontSize: "18px" }}>
                No fish matched your search.
              </li>
            )}
          </ul>
    
          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                cursor: "pointer",
                transition: "opacity 0.3s ease",
                opacity: selectedImage ? 1 : 0,
              }}
            >
              <img
                src={selectedImage}
                alt="Expanded Fish"
                style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px", boxShadow: "0 0 10px white", transition: "transform 0.3s ease" }}
              />
            </div>
          )}
        </div>
      );
    }
    
    export default App;