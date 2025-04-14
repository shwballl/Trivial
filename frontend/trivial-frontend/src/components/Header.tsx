import { Link } from 'react-router-dom';

type HeaderProps = {
    onLoginClick: () => void;
    onRegisterClick: () => void;
  };
  
function Header({ onLoginClick, onRegisterClick }: HeaderProps) {  
    return (
        <>
            <header>
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 bg-white border-b border-gray-600">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl border-solid">
                         <Link to="/" className="flex items-center">
                            <svg width="40" height="40" className="mr-2" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28.6663 46.7212C19.5238 46.29 12.25 38.7575 12.25 29.5C12.25 19.9837 19.9837 12.25 29.5 12.25C38.7575 12.25 46.29 19.5238 46.7212 28.6663L40.6838 26.855C39.505 21.7663 34.9338 18 29.5 18C23.1462 18 18 23.1462 18 29.5C18 34.9338 21.7663 39.505 26.855 40.6838L28.6663 46.7212ZM58.25 29.5C58.25 30.3625 58.2212 31.225 58.135 32.0875L52.4712 30.3913C52.5 30.1038 52.5 29.7875 52.5 29.5C52.5 16.7925 42.2075 6.5 29.5 6.5C16.7925 6.5 6.5 16.7925 6.5 29.5C6.5 42.2075 16.7925 52.5 29.5 52.5C29.7875 52.5 30.1038 52.5 30.3913 52.4712L32.0875 58.135C31.225 58.2212 30.3625 58.25 29.5 58.25C13.63 58.25 0.75 45.37 0.75 29.5C0.75 13.63 13.63 0.75 29.5 0.75C45.37 0.75 58.25 13.63 58.25 29.5ZM47.4112 41.7475L58.25 38.125L29.5 29.5L38.125 58.25L41.7475 47.4112L54.0238 59.6875L59.7163 53.995L47.4112 41.7475Z" fill="black" />
                            </svg>

                            <span className="self-center text-xl font-semibold whitespace-nowrap text-black font-bold">Trivial</span>
                        </Link>
                        <div className="flex items-center lg:order-2">
                            <button
                                onClick={onLoginClick}
                                className="text-white hover:bg-gray-800 bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none focus:ring-gray-800"
                            >
                                Log in
                            </button>
                            <button onClick={onRegisterClick} className="text-white bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800">
                                Get started
                            </button>
                            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <Link to="/" className="block py-2 pr-4 pl-3  rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 text-black" aria-current="page">
                                        Find a Task
                                    </Link>
                                </li>

                                <li>
                                <Link to="/create-task/" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:text-black lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 text-gray-400 lg:hover:text-black hover:bg-gray-700 hover:text-white lg:hover:bg-transparent border-gray-700">
                                        Create a Task
                                    </Link>
                                </li>
                                <li>
                                <Link to="/me/tasks/" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100  hover:text-black lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 text-gray-400 lg:hover:text-black hover:bg-gray-700 hover:text-white lg:hover:bg-transparent border-gray-700">
                                        My Tasks
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
