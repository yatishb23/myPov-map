import React,{useState} from 'react';
import { Search } from '@mui/icons-material';
import { TextField } from '@mui/material';


const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
  
    const handleSearch = () => {
      if (query.trim()) {
        onSearch(query);
      }
    };
  
    return (
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "90%", 
          maxWidth: "600px", 
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            padding: "8px",
          }}
        >
          <TextField
            type="text"
            placeholder="Search location..."
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height:"46px",
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderRadius: '12px 0 0 12px',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9e9e9e',
                },
                '& input': {
                  padding: '12px 14px',
                  fontSize: '16px',
                  '&::placeholder': {
                    color: '#9e9e9e',
                    opacity: 1,
                  },
                },
              },
            }}
            InputProps={{
              sx: {
                // '& .MuiOutlinedInput-notchedOutline': {
                //   border:"none",

                // },
                // borderRadius:"10px 0 0 10px"
              },
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '14px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '0 12px 12px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '50px',
              height: '48px', 
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
          >
            <Search style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>
    );
  };

export default SearchBar;