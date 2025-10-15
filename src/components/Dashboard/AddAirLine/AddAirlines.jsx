import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import styles from './AddAirlines.module.css';

export default function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAirlineName, setNewAirlineName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://flyhigh.zeabur.app/api/airlines')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch airlines');
        return res.json();
      })
      .then((data) => {
        setAirlines(data);
        setFilteredAirlines(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching airlines:', err);
        setError('Failed to load airlines. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = airlines.filter((airline) =>
      airline.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAirlines(filtered);
  }, [searchQuery, airlines]);

  const handleAddAirline = async (e) => {
    e.preventDefault();
    if (!newAirlineName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Airline name is required!',
         confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://flyhigh.zeabur.app/api/airlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newAirlineName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add airline');
      }

      const newAirline = await response.json();
      setAirlines((prev) => [...prev, newAirline.airline]);
      setNewAirlineName('');
      setError(null);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Airline added successfully!',
        timer: 1500,
         confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
      });
    } catch (err) {
      console.error('Error adding airline:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to add airline: ${err.message}`,
         confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
      });
    }
  };

  const handleDeleteAirline = async (id) => {
    // Show confirmation dialog before deleting
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this airline?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
     
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://flyhigh.zeabur.app/api/airlines/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete airline');
        }

        setAirlines((prev) => prev.filter((a) => a.id !== id));

        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Airline has been deleted.',
          timer: 1500,
            confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  },
        });
      } catch (err) {
        console.error('Error deleting airline:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to delete airline: ${err.message}`,
            confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  },
        });
      }
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading airlines...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className={styles.sectionTitle}>Airlines</h2>

      {/* Search field */}
      <div className="mb-4">
        <label htmlFor="searchAirline" className="form-label">
          Search Airlines
        </label>
        <input
          id="searchAirline"
          type="text"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter airline name"
        />
      </div>

      {/* Add new airline */}
      <form onSubmit={handleAddAirline} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="newAirline" className="form-label">
              Add New Airline
            </label>
            <input
              id="newAirline"
              type="text"
              className="form-control"
              value={newAirlineName}
              onChange={(e) => setNewAirlineName(e.target.value)}
              placeholder="Enter airline name"
            />
          </div>
          <div className="col-md-3 align-self-end">
            <button type="submit" className="btn btn-primary w-100">
              Add Airline
            </button>
          </div>
        </div>
      </form>

      {/* Display airlines */}
      {filteredAirlines.length === 0 ? (
        <p>No airlines found matching your search.</p>
      ) : (
        <div className="row">
          {filteredAirlines.map((airline) => (
            <div key={airline.id} className="col-md-6 mb-3">
              <div className="card p-3">
                <p><strong>ID:</strong> {airline.id}</p>
                <p><strong>Name:</strong> {airline.name}</p>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteAirline(airline.id)}
                >
                  Delete Airline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}