import {useState} from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'

const SearchBar = () => {
  
const [searchTerm, setSearchTerm] = useState("");
const [isOpen, setIsOpen] = useState(false);

const handleSearchToggle = () => {
  setIsOpen(!isOpen);
}

const handleSearch = (e) => {
  e.preventDefault();
  console.log("Searching for:", searchTerm);
  setIsOpen(false);
}
  
  
  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen?"absolute top-0 left-0 w-full bg-white dark:bg-gray-900 h-24 z-50 shadow-md"  : "w-auto"}`}>
    {isOpen ? (
      <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full container mx-auto px-4'>
        <div className="relative w-full md:w-2/3 lg:w-1/2"> 
          <input
            type="text"
            placeholder='Search for products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='bg-gray-50 dark:bg-gray-800 px-6 py-3 pl-4 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-black dark:text-white transition-all shadow-inner' />
            {/* {Search icon} */}
            <button type='submit' className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'>
              <HiMagnifyingGlass className='h-6 w-6'/>
            </button>
        </div>
        {/* {Close icon} */}
        <button type='button' onClick={handleSearchToggle} className='absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2'>
          <HiMiniXMark className='h-6 w-6'/>
        </button>
      </form>
      ) : (
      <button onClick={handleSearchToggle} className='hover:text-black dark:hover:text-white transition-colors'>
        <HiMagnifyingGlass className='h-6 w-6 text-gray-700 dark:text-gray-300' />
        </button>
      )}
    </div>
  )
}

export default SearchBar