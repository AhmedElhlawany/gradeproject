import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default function HotelPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null); // Store bookingId after submission

  const hotel = state?.hotel;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');

  if (!hotel) {
    return (
      <div className="container py-5 text-center">
        <h3>Hotel data not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  if (!currentUser || !token) {
    return (
      <div className="container py-5 text-center">
        <h3>Please log in to book a hotel</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  const prices = hotel.availableRooms.reduce((acc, room) => {
    acc[room.type] = room.price;
    return acc;
  }, {});

  const formik = useFormik({
    initialValues: {
      firstName: currentUser.name?.split(' ')[0] || '',
      lastName: currentUser.name?.split(' ')[1] || '',
      phone: currentUser.phone || '',
      email: currentUser.email || '',
      rooms: [{ type: '', count: 1 }],
      checkIn: '',
      checkOut: '',

      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      phone: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      rooms: Yup.array()
        .of(
          Yup.object({
            type: Yup.string().required('Room type is required'),
            count: Yup.number()
              .min(1, 'At least one room is required')
              .test('max-rooms', 'Exceeds available rooms', function (value) {
                const roomType = this.parent.type;
                const room = hotel.availableRooms.find((r) => r.type === roomType);
                return roomType && room ? value <= room.quantity : true;
              })
              .required('Number of rooms is required'),
          })
        )
        .min(1, 'At least one room selection is required'),
      checkIn: Yup.date().required('Check-in date is required'),
      checkOut: Yup.date()
        .min(Yup.ref('checkIn'), 'Check-out must be after check-in')
        .required('Check-out date is required'),

      cardNumber: Yup.string()
        .matches(/^\d{16}$/, 'Card number must be 16 digits')
        .required('Required'),
      expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)')
        .required('Required'),
      cvv: Yup.string()
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      const totalCost = values.rooms.reduce(
        (sum, room) => sum + (prices[room.type] || 0) * room.count,
        0
      );

      const newBookingId = uuidv4();
      const bookingData = {
        bookingId: newBookingId,
        hotelId: hotel.id,
        hotelName: hotel.name,
        city: hotel.city,
        rooms: values.rooms.map((room) => ({
          type: room.type,
          count: room.count,
          price: prices[room.type],
        })),
        totalCost,
        fullName: `${values.firstName} ${values.lastName}`,
        phone: values.phone,
        email: values.email,
        bookingDate: new Date().toISOString(),
        checkIn: values.checkIn,
        checkOut: values.checkOut,
      };

      try {
        // Update room availability in the backend
        for (const room of values.rooms) {
          const response = await axios.post(
            `http://localhost:3000/api/hotels/${hotel.id}/book`,
            {
              roomType: room.type,
              quantity: room.count,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.status !== 200) {
            throw new Error(response.data.error || 'Booking failed on server');
          }
        }

        // Add booking to user's bookedHotels
        const bookingResponse = await axios.post(
          `http://localhost:3000/api/users/${currentUser.id}/hotel-bookings`,
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (bookingResponse.status !== 200) {
          throw new Error(bookingResponse.data.error || 'Failed to save hotel booking');
        }

        setBookingId(newBookingId); // Store bookingId for cancellation
        setIsConfirmed(true);
      } catch (error) {
        alert(`Booking failed: ${error.response?.data?.error || error.message}`);
      }
    },
  });

  const handleCancelBooking = async () => {
    if (!bookingId) {
      alert('No booking to cancel');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/${currentUser.id}/cancel-hotel-booking`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Failed to cancel booking');
      }

      setIsConfirmed(false);
      setBookingId(null);
      navigate('/hotels');
    } catch (error) {
      alert(`Cancel booking failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const totalCost = formik.values.rooms.reduce(
    (sum, room) => sum + (prices[room.type] || 0) * room.count,
    0
  );

  const addRoomSelection = () => {
    formik.setFieldValue('rooms', [...formik.values.rooms, { type: '', count: 1 }]);
  };

  const removeRoomSelection = (index) => {
    if (formik.values.rooms.length > 1) {
      const newRooms = formik.values.rooms.filter((_, i) => i !== index);
      formik.setFieldValue('rooms', newRooms);
    }
  };

  const availableRoomTypes = hotel.availableRooms.filter((room) => room.quantity > 0);

  return (
    <div className="container mt-4 py-5">
      {isConfirmed ? (
        <div className="text-center">
          <h2>Booking Confirmed!</h2>
          <p>
            Your booking at {hotel.name} for ${totalCost.toFixed(2)} has been confirmed.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => navigate('/hotels')}>
              Back to Hotels
            </button>
            <button className="btn btn-danger" onClick={handleCancelBooking}>
              Cancel Booking
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-4 pt-3">Book Your Room at {hotel.name}</h2>
          <form onSubmit={formik.handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                className="form-control"
                {...formik.getFieldProps('firstName')}
                aria-required="true"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-danger">{formik.errors.firstName}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                className="form-control"
                {...formik.getFieldProps('lastName')}
                aria-required="true"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-danger">{formik.errors.lastName}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                id="phone"
                className="form-control"
                {...formik.getFieldProps('phone')}
                aria-required="true"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                {...formik.getFieldProps('email')}
                aria-required="true"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </div>

            <div className="col-12">
              <h4 className="mb-3">Room Selections</h4>
              {formik.values.rooms.map((room, index) => (
                <div key={index} className="row g-3 mb-3 align-items-end">
                  <div className="col-md-5">
                    <label htmlFor={`roomType-${index}`} className="form-label">
                      Room Type
                    </label>
                    <select
                      id={`roomType-${index}`}
                      className="form-select"
                      {...formik.getFieldProps(`rooms[${index}].type`)}
                      aria-required="true"
                    >
                      <option value="" disabled>
                        Choose...
                      </option>
                      {availableRoomTypes.map((roomOption) => (
                        <option key={roomOption.type} value={roomOption.type}>
                          {roomOption.type.charAt(0).toUpperCase() + roomOption.type.slice(1)} - $
                          {roomOption.price} ({roomOption.quantity} available)
                        </option>
                      ))}
                    </select>
                    {formik.touched.rooms?.[index]?.type && formik.errors.rooms?.[index]?.type && (
                      <div className="text-danger">{formik.errors.rooms[index].type}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor={`roomCount-${index}`} className="form-label">
                      Number of Rooms
                    </label>
                    <input
                      id={`roomCount-${index}`}
                      type="number"
                      className="form-control"
                      min="1"
                      max={
                        formik.values.rooms[index].type
                          ? hotel.availableRooms.find(
                            (r) => r.type === formik.values.rooms[index].type
                          )?.quantity || 1
                          : 1
                      }
                      {...formik.getFieldProps(`rooms[${index}].count`)}
                      aria-required="true"
                    />
                    {formik.touched.rooms?.[index]?.count && formik.errors.rooms?.[index]?.count && (
                      <div className="text-danger">{formik.errors.rooms[index].count}</div>
                    )}
                  </div>

                  <div className="col-md-3">
                    {formik.values.rooms.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeRoomSelection(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addRoomSelection}
                  disabled={formik.values.rooms.length >= availableRoomTypes.length}
                >
                  Add Another Room Type
                </button>
              </div>
            </div>

            <div className="col-12">
              <h5>Total Cost: ${totalCost.toFixed(2)}</h5>
            </div>


<div className="col-md-6">
  <label htmlFor="checkIn" className="form-label">Check-In Date</label>
  <input
    id="checkIn"
    type="date"
    className="form-control"
    {...formik.getFieldProps('checkIn')}
  />
  {formik.touched.checkIn && formik.errors.checkIn && (
    <div className="text-danger">{formik.errors.checkIn}</div>
  )}
</div>

<div className="col-md-6">
  <label htmlFor="checkOut" className="form-label">Check-Out Date</label>
  <input
    id="checkOut"
    type="date"
    className="form-control"
    {...formik.getFieldProps('checkOut')}
  />
  {formik.touched.checkOut && formik.errors.checkOut && (
    <div className="text-danger">{formik.errors.checkOut}</div>
  )}
</div>


            <div className="col-md-6">
              <label htmlFor="cardNumber" className="form-label">
                Card Number
              </label>
              <input
                id="cardNumber"
                className="form-control"
                maxLength={16}
                {...formik.getFieldProps('cardNumber')}
                aria-required="true"
              />
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <div className="text-danger">{formik.errors.cardNumber}</div>
              )}
            </div>

            <div className="col-md-3">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                className="form-control"
                placeholder="MM/YY"
                {...formik.getFieldProps('expiryDate')}
                aria-required="true"
              />
              {formik.touched.expiryDate && formik.errors.expiryDate && (
                <div className="text-danger">{formik.errors.expiryDate}</div>
              )}
            </div>

            <div className="col-md-3">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                id="cvv"
                className="form-control"
                {...formik.getFieldProps('cvv')}
                aria-required="true"
              />
              {formik.touched.cvv && formik.errors.cvv && (
                <div className="text-danger">{formik.errors.cvv}</div>
              )}
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                Confirm Booking
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}