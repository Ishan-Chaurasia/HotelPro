import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Plus,
  Trash2,
  Edit,
  BedDouble,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    roomNumber: '',
    type: 'Deluxe',
    pricePerNight: '',
    maxGuests: '2',
    bedType: 'King Bed',
    sizeSqFt: '400',
    amenities: 'Free High-Speed Wi-Fi, Air Conditioning, Flat-Screen TV, Private Bathroom',
    images: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    description: '',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setFormData({
      title: '',
      roomNumber: '',
      type: 'Deluxe',
      pricePerNight: '',
      maxGuests: '2',
      bedType: 'King Bed',
      sizeSqFt: '400',
      amenities: 'Free High-Speed Wi-Fi, Air Conditioning, Flat-Screen TV, Private Bathroom',
      images: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      description: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      title: room.title,
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      bedType: room.bedType || 'King Bed',
      sizeSqFt: room.sizeSqFt || '400',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities,
      images: Array.isArray(room.images) ? room.images[0] : room.images,
      description: room.description,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const payload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        maxGuests: Number(formData.maxGuests),
        sizeSqFt: Number(formData.sizeSqFt),
        amenities: formData.amenities.split(',').map((a) => a.trim()),
        images: [formData.images],
      };

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, payload);
        setFormSuccess('Room updated successfully');
      } else {
        await api.post('/rooms', payload);
        setFormSuccess('New room added to inventory');
      }

      setShowModal(false);
      fetchRooms();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to remove Room #${roomNumber} from inventory?`)) {
      return;
    }

    try {
      await api.delete(`/rooms/${roomId}`);
      setFormSuccess(`Room #${roomNumber} removed`);
      fetchRooms();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Navigation & Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <Link to="/admin/dashboard" className="text-muted small text-decoration-none d-flex align-items-center gap-1 mb-1">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="display-6 fw-bold font-serif text-dark mb-0">Room Inventory Management</h1>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn btn-hotelpro d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm"
          >
            <Plus size={18} />
            <span>Add New Room</span>
          </button>
        </div>

        {formSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 small py-2 mb-4">
            <CheckCircle size={18} />
            <span>{formSuccess}</span>
          </div>
        )}

        {/* Search & Filter Filter Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Filter rooms by title, room number, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Room Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Room Details</th>
                  <th>Type</th>
                  <th>Rate</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredRooms.map((room) => (
                  <tr key={room._id}>
                    <td>
                      <div className="rounded-3 overflow-hidden" style={{ width: '65px', height: '50px' }}>
                        <img
                          src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=200&q=80'}
                          alt={room.title}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{room.title}</div>
                      <span className="badge bg-light text-muted border">#{room.roomNumber}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 rounded-pill">
                        {room.type}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">${room.pricePerNight}</span>
                      <span className="text-muted small"> / night</span>
                    </td>
                    <td>
                      <div>{room.maxGuests} Guests</div>
                      <div className="text-muted small">{room.bedType}</div>
                    </td>
                    <td>
                      <span className={`badge ${room.isAvailable ? 'bg-success' : 'bg-warning'}`}>
                        {room.isAvailable ? 'Operational' : 'Maintenance'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(room)}
                          className="btn btn-sm btn-outline-secondary rounded-circle p-2"
                          title="Edit Room"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                          className="btn btn-sm btn-outline-danger rounded-circle p-2"
                          title="Delete Room"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add / Edit Room */}
        {showModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold font-serif">
                    {editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Hotel Room'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {formError && (
                  <div className="alert alert-danger mx-3 mt-3 mb-0 d-flex align-items-center gap-2 small py-2">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-bold">Room Title / Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Presidential Ocean Suite"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Room Number / ID</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 301, PH-10"
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Room Category</label>
                        <select
                          className="form-select"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Suite">Suite</option>
                          <option value="Executive">Executive</option>
                          <option value="Family">Family</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Nightly Price ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          placeholder="250"
                          value={formData.pricePerNight}
                          onChange={(e) =>
                            setFormData({ ...formData, pricePerNight: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Max Guests</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="10"
                          value={formData.maxGuests}
                          onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Bed Configuration</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 1 King Bed"
                          value={formData.bedType}
                          onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Size in Sq. Ft</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="500"
                          value={formData.sizeSqFt}
                          onChange={(e) => setFormData({ ...formData, sizeSqFt: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold">Image URL (Unsplash or CDN)</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://images.unsplash.com/..."
                          value={formData.images}
                          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold">
                          Amenities (comma-separated)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Free Wi-Fi, Balcony, Spa Tub, Smart TV"
                          value={formData.amenities}
                          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold">Full Room Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Describe room features, view, and unique selling points..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-hotelpro rounded-pill px-4"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : editingRoom ? 'Update Room' : 'Add to Inventory'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRooms;
