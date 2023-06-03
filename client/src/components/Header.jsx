import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTasks, faPlusSquare, faUserCircle, faBell, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const Header = () => (
  <header className="flex justify-between items-center py-4 px-6 bg-white shadow">
    <div className="flex items-center">
      <Link to="/">
        <h1 className="text-xl font-semibold text-gray-700" style={{ color: '#707070' }}>YourLogo</h1>
      </Link>
    </div>
    <div className="flex items-center">
      <Link to="/calendar" className="flex items-center ml-4 mr-6">
        <FontAwesomeIcon icon={faCalendar} className="h-6 w-6" style={{ color: '#707070' }} />
        <h1 className="text-xl font-semibold ml-2" style={{ color: '#707070' }}>My calendar</h1>
      </Link>
      <Link to="/manage-booking" className="flex items-center ml-6 mr-6">
        <FontAwesomeIcon icon={faTasks} className="h-6 w-6" style={{ color: '#707070' }} />
        <h1 className="text-xl font-semibold ml-2" style={{ color: '#707070' }}>Manage bookings</h1>
      </Link>
      <Link to="/new-booking" className="flex items-center ml-6 mr-4">
        <FontAwesomeIcon icon={faPlusSquare} className="h-6 w-6" style={{ color: '#707070' }} />
        <h1 className="text-xl font-semibold ml-2" style={{ color: '#707070' }}>Add new booking</h1>
      </Link>
    </div>
    <div className="flex items-center space-x-4">
      <FontAwesomeIcon icon={faUserCircle} className="h-7 w-7" style={{ color: '#707070' }} />
      <FontAwesomeIcon icon={faBell} className="h-7 w-7" style={{ color: '#707070' }} />
      <button className="focus:outline-none">
        <FontAwesomeIcon icon={faEllipsisV} className="h-7 w-7" style={{ color: '#707070' }} />
      </button>
    </div>
  </header>
);

export default Header;
