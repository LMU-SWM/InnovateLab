import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTasks, faPlusSquare, faUserCircle, faBell, faEllipsisV, faCog } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from './LogoutButton';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow">
      <div className="flex items-center">
        <Link to="/">
          <h1 className="text-xl font-semibold text-gray-700" style={{ color: '#707070' }}>
            YourLogo
          </h1>
        </Link>
      </div>
      <div className="flex items-center">
        <Link to="/calendar" className="flex items-center ml-4 mr-6">
          <FontAwesomeIcon icon={faCalendar} className="h-6 w-6" style={{ color: '#707070' }} />
          <h1 className="text-xl font-semibold ml-2" style={{ color: '#707070' }}>
            My calendar
          </h1>
        </Link>
        <Link to="/manage-booking" className="flex items-center ml-6 mr-6">
          <FontAwesomeIcon icon={faTasks} className="h-6 w-6" style={{ color: '#707070' }} />
          <h1 className="text-xl font-semibold ml-2" style={{ color: '#707070' }}>
            Manage bookings
          </h1>
        </Link>
        <Link to="/add_new_booking" className="flex items-center ml-6 mr-4">
          <FontAwesomeIcon icon={faPlusSquare} className="h-6 w-6" style={{ color: '#707070' }} />
          <h1 className="text-xl font-semibold ml-2" style={{ color: '#707070' }}>
            Add new booking
          </h1>
        </Link>
      </div>
      <div className="relative">
        <button onClick={handleDropdownToggle} className="focus:outline-none">
          <FontAwesomeIcon icon={faEllipsisV} className="h-7 w-7" style={{ color: '#707070' }} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/profile" className="flex items-center text-gray-700" style={{ color: '#707070' }}>
                  <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5 mr-2" />
                  Profile
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/settings" className="flex items-center text-gray-700" style={{ color: '#707070' }}>
                  <FontAwesomeIcon icon={faCog} className="h-5 w-5 mr-2" />
                  Settings
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <LogoutButton />
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;