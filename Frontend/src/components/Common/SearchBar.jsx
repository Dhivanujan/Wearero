import {useState, useEffect} from 'react'
import { HiMagnifyingGlass, HiMiniXMark, HiMicrophone } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/api';

const SearchBar = () => {
  
const [searchTerm, setSearchTerm] = useState("");
const [isOpen, setIsOpen] = useState(false);
const [isListening, setIsListening] = useState(false);
const [suggestions, setSuggestions] = useState([]);
const navigate = useNavigate();

const handleSearchToggle = () => {
  setIsOpen(!isOpen);
  setSuggestions([]);
}

const handleSearch = (e) => {
  e.preventDefault();
  if(searchTerm.trim()){
    navigate(`/collections/all?search=${searchTerm.trim()}`);
    setIsOpen(false);
    setSuggestions([]);
  }
}

useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
    if (searchTerm.trim().length > 2) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products?search=${searchTerm}&limit=5`);
            const data = await response.json();
            setSuggestions(Array.isArray(data) ? data : []);
        } catch(err) {
            console.error(err);
        }
    } else {
        setSuggestions([]);
    }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
}, [searchTerm])

const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice search is not supported in this browser.");
        return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        navigate(`/collections/all?search=${transcript}`);
        setIsOpen(false);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.start();
};
  
  
  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen?"absolute top-0 left-0 w-full bg-white dark:bg-gray-900 h-24 z-50 shadow-md"  : "w-auto"}`}>
    {isOpen ? (
      <>
      <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full container mx-auto px-4'>
        <div className="relative w-full md:w-2/3 lg:w-1/2"> 
          <input
            type="text"
            placeholder='Search for products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='bg-gray-50 dark:bg-gray-800 px-6 py-3 pl-4 pr-24 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-black dark:text-white transition-all shadow-inner' />
            {/* {Search icon} */}
            <button type='submit' className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'>
              <HiMagnifyingGlass className='h-6 w-6'/>
            </button>
            {/* {Voice icon} */}
            <button type='button' onClick={handleVoiceSearch} className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors ${isListening ? 'animate-pulse text-red-500' : ''}`}>
              <HiMicrophone className='h-6 w-6'/>
            </button>
        </div>
        {/* {Close icon} */}
        <button type='button' onClick={handleSearchToggle} className='absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2'>
          <HiMiniXMark className='h-6 w-6'/>
        </button>
      </form>

      {suggestions.length > 0 && (
          <div className="absolute top-24 w-full bg-white dark:bg-gray-900 shadow-xl z-50 border-t border-gray-200 dark:border-gray-700">
            <ul className="container mx-auto px-4 py-4 space-y-2">
              {suggestions.map((product) => (
                <li key={product._id} 
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" 
                    onClick={() => { 
                        navigate(`/product/${product._id}`); 
                        setIsOpen(false);
                        setSuggestions([]);
                    }}>
                      <img 
                        src={product.images?.[0]?.url 
                            ? (product.images[0].url.startsWith('http') ? product.images[0].url : `${API_BASE_URL}${product.images[0].url}`) 
                            : 'https://picsum.photos/150'} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-md" 
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">${product.price}</p>
                      </div>
                </li>
              ))}
            </ul>
          </div>
      )}
      </>
      ) : (
      <button onClick={handleSearchToggle} className='hover:text-black dark:hover:text-white transition-colors'>
        <HiMagnifyingGlass className='h-6 w-6 text-gray-700 dark:text-gray-300' />
        </button>
      )}
    </div>
  )
}

export default SearchBar