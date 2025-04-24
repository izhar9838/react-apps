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
  const userName = useSelector((state) => state.auth?.user?.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsDropdownOpen(!isDropdownOpen);
  };

  
  

  // Optimize image for small screens using canvas
  useEffect(() => {
    if (userProfileImage && isSmallScreen && !imageError && !optimizedImage) {
      console.log('Attempting to optimize image for small screen');
      const img = new Image();
      img.src = `data:image/jpeg;base64,${userProfileImage}`;
      img.onload = () => {
        console.log('Image loaded successfully for optimization');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 150;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        console.log('Optimized image generated, size:', (optimizedBase64.length * 3) / 4 / 1024, 'KB');
        setOptimizedImage(optimizedBase64);
      };
      img.onerror = () => {
        console.error('Failed to load image for optimization');
        setImageError(true);
      };
    }
  }, [userProfileImage, isSmallScreen, imageError]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.md\\:hidden')) {
        setIsOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.profile-icon')
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (userProfileImage) {
      const sizeInMB = (userProfileImage.length * 3) / 4 / 1024 / 1024;
      console.log('Profile image size:', sizeInMB, 'MB');
      if (!userProfileImage.match(/^[A-Za-z0-9+/=]+$/)) {
        console.error('Invalid Base64 string detected');
        setImageError(true);
      }
    }
  }, [userProfileImage]);

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate('/');
      setIsDropdownOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Home', link: '/', status: true },
    { name: 'Contact us', link: '/contact-us', status: true },
    { name: 'Sign in', link: '/', status: !authStatus },
    { name: 'Login', link: '/login', status: !authStatus },
  ];

  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const isValidBase64 = (str) => str && /^[A-Za-z0-9+/=]+$/.test(str);

  return (
    <header>
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 w-full min-h-[7vh] flex flex-wrap justify-between items-center nav-bar">
        <div className="w-auto pl-0.5 logo-container">
          <h1 className="text-xl font-bold text-black">School Logo</h1>
        </div>

        <div className="w-auto flex items-center justify-end">
          <ul className={`hidden md:flex flex-wrap items-center ${authStatus ? 'mr-12' : 'justify-end'} gap-10`}>
            {navItems
              .filter((item) => item.status)
              .map((item) => (
                <li key={item.name} className="nav-li">
                  <button
                    onClick={() => navigate(item.link)}
                    className="cursor-pointer nav-button font-medium text-black px-2"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              
            {authStatus && authRole === 'admin' && (
              <li className="nav-li">
                <button
                  onClick={() => navigate('admin')}
                  className="cursor-pointer nav-button font-medium text-black px-2"
                >
                  Admin
                </button>
              </li>
            )}
            
            {authStatus && authRole === 'teacher' && (
              <li className="nav-li px-2 py-2">
                <button
                  onClick={() => {
                    navigate('teacher/teacher-dashboard');
                    setIsOpen(false);
                  }}
                  className="cursor-pointer nav-button w-full h-full font-medium"
                >
                  Teacher
                </button>
              </li>
            )}
            {authStatus && authRole === 'student' && (
              <li className="nav-li px-2 py-2">
                <button
                  onClick={() => {
                    navigate('student/student-dashboard');
                    setIsOpen(false);
                  }}
                  className="cursor-pointer nav-button w-full h-full font-medium"
                >
                  Student
                </button>
              </li>
            )}
            
          </ul>

          <div className="md:hidden flex items-center space-x-1.5 flex-none pr-4">
            {authStatus && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="profile-icon mobile-profile cursor-pointer flex justify-center rounded-full overflow-visible w-6 h-6 bg-gray-500"
                >
                  {userProfileImage && isValidBase64(userProfileImage) && !imageError ? (
                    <img
                      src={isSmallScreen && optimizedImage ? optimizedImage : `data:image/jpeg;base64,${userProfileImage}`}
                      alt="User Profile"
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                      crossOrigin="anonymous"
                      onError={() => {
                        console.error('Failed to load mobile profile image');
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      {userInitial}
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                    style={{ zIndex: 200 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/accountInfo');
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Account
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/settings');
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={toggleMenu} className="hamburger-menu">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {authStatus && (
            <div className="hidden md:block relative mr-6">
              <button
                onClick={toggleDropdown}
                className="profile-icon cursor-pointer flex justify-center rounded-full overflow-hidden w-8 h-8 bg-gray-500"
              >
                {userProfileImage && isValidBase64(userProfileImage) && !imageError ? (
                  <img
                    src={`data:image/jpeg;base64,${userProfileImage}`}
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={() => {
                      console.error('Failed to load desktop profile image');
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm">
                    {userInitial}
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                  style={{ zIndex: 200 }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/accountInfo');
                      setIsDropdownOpen(false);
                    }}
                    className="dropdown-item block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Account
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="dropdown-item block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="dropdown-item block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isOpen && (
          <div
            ref={menuRef}
            className="fixed top-[7vh] left-0 w-full bg-gray-900 mob-nav z-20"
          >
            <ul className="w-full flex flex-col items-center">
              {navItems
                .filter((item) => item.status)
                .map((item) => (
                  <li key={item.name} className="nav-li px-2 py-2 w-full text-center">
                    <button
                      onClick={() => {
                        navigate(item.link);
                        setIsOpen(false);
                      }}
                      className="cursor-pointer nav-button font-medium"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              {authStatus && authRole === 'admin' && (
                <li className="nav-li px-2 py-2 w-full text-center">
                  <button
                    onClick={() => {
                      navigate('admin');
                      setIsOpen(false);
                    }}
                    className="cursor-pointer nav-button font-medium"
                  >
                    Admin
                  </button>
                </li>
              )}
              {authStatus && authRole === 'teacher' && (
                <li className="nav-li px-2 py-2 w-full text-center">
                  <button
                    onClick={() => {
                      navigate('teacher/teacher-dashboard');
                      setIsOpen(false);
                    }}
                    className="cursor-pointer nav-button font-medium"
                  >
                    Teacher
                  </button>
                </li>
              )}
              {authStatus && authRole === 'student' && (
                <li className="nav-li px-2 py-2 w-full text-center">
                  <button
                    onClick={() => {
                      navigate('student/student-dashboard');
                      setIsOpen(false);
                    }}
                    className="cursor-pointer nav-button font-medium"
                  >
                    Student
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