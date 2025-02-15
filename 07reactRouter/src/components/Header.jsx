import { Link,NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header classNameNameName="shadow sticky z-50 top-0">
            <nav classNameNameName="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div classNameNameName="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" classNameNameName="flex items-center">
                        <img
                            src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                            classNameNameName="mr-3 h-12"
                            alt="Logo"
                        />
                    </Link>
                    <div classNameNameName="flex items-center lg:order-2">
                        <Link
                            to="#"
                            classNameNameName="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Log in
                        </Link>
                        <Link
                            to="#"
                            classNameNameName="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Get started
                        </Link>
                    </div>
                    <div
                        classNameNameName="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul classNameNameName="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    classNameNameName={({isActive}) =>
                                        `${isActive ? "text-orange-700 " : "text-gray-700"}

                                        block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    classNameNameName={({isActive}) =>
                                        `${isActive ? "text-orange-700 ": "text-gray-700"}
                                        block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/contact"
                                    classNameNameName={({isActive}) =>
                                    `${isActive ? "text-orange-700 ": "text-gray-700"}
                                    block py-2 pr-4 pl-3 duration-200 border-b 
                                    border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Contact
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/github"
                                    classNameNameName={({isActive}) =>
                                    `${isActive ? "text-orange-700 ": "text-gray-700"}
                                    block py-2 pr-4 pl-3 duration-200 border-b 
                                    border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Github
                                </NavLink>
                            </li>
                            
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

