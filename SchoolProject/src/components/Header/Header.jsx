import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import './Header.css';
import { Menu, X } from 'lucide-react';

function Header() {
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const authRole = useSelector((state) => state.auth?.user?.role);
  const userProfileImage = useSelector((state) => state.auth?.user?.profileImage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to handleClickOutside
    // console.log('Toggle menu clicked, current isOpen:', isOpen);
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    // console.log('Toggling dropdown, current state:', isDropdownOpen);
    setIsOpen(false);
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.md\\:hidden')) {
        // console.log('Closing mobile nav due to click outside');
        setIsOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.profile-icon')
      ) {
        // console.log('Closing dropdown due to click outside');
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // console.log('handleLogout called');
    try {
      const result = dispatch(logout());
      // console.log('Logout dispatch result:', result);
      navigate('/');
      setIsDropdownOpen(false);
      setIsOpen(false);
    } catch (error) {
      // console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Home', link: '/', status: true },
    { name: 'Contact us', link: '/contact-us', status: true },
    { name: 'Sign in', link: '/', status: !authStatus },
    { name: 'Login', link: '/login', status: !authStatus },
  ];

  return (
    <header>
      <div className=' bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 w-full min-h-[7vh] flex flex-wrap justify-between items-center nav-bar'>
        <div className='w-1/4 pl-4'>
          <h1 className='text-xl font-bold text-black'>School Logo</h1>
        </div>

        {/* Navigation Items and Profile */}
        <div className='flex items-center justify-end w-3/4 pr-4'>
          {/* Navigation Items */}
          <ul className={`hidden md:flex flex-wrap items-center ${authStatus ? 'mr-12' : 'justify-end'} gap-10`}>
            {navItems
              .filter((item) => item.status)
              .map((item) => (
                <li key={item.name} className='nav-li'>
                  <button
                    onClick={() => navigate(item.link)}
                    className='cursor-pointer nav-button font-medium  text-black px-2'
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            {authStatus && authRole === 'admin' && (
              <li className='nav-li'>
                <button
                  onClick={() => navigate('admin')}
                  className='cursor-pointer nav-button font-medium  text-black px-2'
                >
                  Admin
                </button>
              </li>
            )}
            {authStatus && authRole === 'teacher' && (
                <li className='nav-li px-2 py-2'>
                  <button
                    onClick={() => {
                      navigate('teacher/teacher-dashboard');
                      setIsOpen(false);
                    }}
                    className='cursor-pointer nav-button w-full h-full font-medium '
                  >
                    Teacher
                  </button>
                </li>
              )}
          </ul>

          {/* Mobile Profile and Menu Toggle */}
          <div className='md:hidden flex items-center space-x-6'> {/* Note: space-x-4 from previous change */}
            {authStatus && (
              <div className='relative'>
                <button
                  onClick={toggleDropdown}
                  className='profile-icon cursor-pointer flex justify-center rounded-full overflow-hidden w-6 h-6'
                >
                  {userProfileImage ? (
                    <img
                      src={`data:image/jpeg;base64,${userProfileImage}`}
                      alt='User Profile'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-500 flex items-center justify-center text-white text-xs'>
                      U
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Navigating to account');
                        navigate('/account');
                        setIsDropdownOpen(false);
                      }}
                      className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                    >
                      Account
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Navigating to settings');
                        navigate('/settings');
                        setIsDropdownOpen(false);
                      }}
                      className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                    >
                      Settings
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Mobile logout button clicked');
                        handleLogout();
                      }}
                      className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={toggleMenu} className='text-black'>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Desktop Profile Section */}
          {authStatus && (
            <div className='hidden md:block relative'>
              <button
                onClick={toggleDropdown}
                className='profile-icon cursor-pointer flex justify-center rounded-full overflow-hidden w-8 h-8'
              >
                {userProfileImage ? (
                  <img
                    src={`data:image/jpeg;base64,${userProfileImage}`}
                    alt='User Profile'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-500 flex items-center justify-center text-white'>
                    U
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/accountInfo');
                      setIsDropdownOpen(false);
                    }}
                    className='dropdown-item block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Account
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/settings');
                      setIsDropdownOpen(false);
                    }}
                    className='dropdown-item block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Desktop logout button clicked');
                      handleLogout();
                    }}
                    className='dropdown-item block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            ref={menuRef}
            className='fixed top-[7vh] left-0 w-full bg-gray-900  mob-nav z-30'
          >
            <ul className='w-full flex flex-col items-center'>
              {navItems
                .filter((item) => item.status)
                .map((item) => (
                  <li key={item.name} className='nav-li px-2 py-2'>
                    <button
                      onClick={() => {
                        navigate(item.link);
                        setIsOpen(false);
                      }}
                      className='cursor-pointer nav-button w-full h-full font-medium '
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              {authStatus && authRole === 'admin' && (
                <li className='nav-li px-2 py-2'>
                  <button
                    onClick={() => {
                      navigate('admin');
                      setIsOpen(false);
                    }}
                    className='cursor-pointer nav-button w-full h-full font-medium '
                  >
                    Admin
                  </button>
                </li>
              )}
              {authStatus && authRole === 'teacher' && (
                <li className='nav-li px-2 py-2'>
                  <button
                    onClick={() => {
                      navigate('teacher/teacher-dashboard');
                      setIsOpen(false);
                    }}
                    className='cursor-pointer nav-button w-full h-full font-medium '
                  >
                    Teacher
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;