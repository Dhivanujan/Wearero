import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    gender: true,
    color: true,
    size: false,
    material: false,
    brand: false,
    price: true,
  });

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChicStyle"];
  const genders = ["Men", "Women"];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync filters with URL on load
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 100,
    });

    setPriceRange([0, Number(params.maxPrice) || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = (newFilters[name] || []).filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 100,
    };
    setFilters(clearedFilters);
    setPriceRange([0, 100]);
    setSearchParams({});
    navigate('');
  };

  const activeFiltersCount = [
    filters.category,
    filters.gender,
    filters.color,
    ...filters.size,
    ...filters.material,
    ...filters.brand,
    filters.maxPrice < 100 ? 'price' : null
  ].filter(Boolean).length;

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">{title}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expandedSections[section] ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-950 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category filter */}
      <FilterSection title="Category" section="category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={handleFilterChange}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                filters.category === category 
                  ? 'border-accent bg-accent' 
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
              }`}>
                {filters.category === category && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </span>
              <span className={`text-sm transition-colors ${
                filters.category === category 
                  ? 'text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender filter */}
      <FilterSection title="Gender" section="gender">
        <div className="flex gap-2">
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => handleFilterChange({ target: { name: "gender", value: filters.gender === gender ? "" : gender, type: "radio" } })}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                filters.gender === gender
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color filter */}
      <FilterSection title="Color" section="color">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange({ target: { name: "color", value: filters.color === color ? "" : color, type: "text" } });
              }}
              className={`relative w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ${
                filters.color === color 
                  ? "ring-2 ring-offset-2 ring-accent dark:ring-offset-gray-950" 
                  : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            >
              {filters.color === color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className={`w-4 h-4 ${['White', 'Yellow', 'Beige'].includes(color) ? 'text-gray-800' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size filter */}
      <FilterSection title="Size" section="size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                const newSizes = filters.size.includes(size)
                  ? filters.size.filter(s => s !== size)
                  : [...filters.size, size];
                handleFilterChange({ target: { name: "size", value: size, checked: !filters.size.includes(size), type: "checkbox" } });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filters.size.includes(size)
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Material filter */}
      <FilterSection title="Material" section="material">
        <div className="space-y-1">
          {materials.map((material) => (
            <label key={material} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <input
                type="checkbox"
                name="material"
                value={material}
                checked={filters.material.includes(material)}
                onChange={handleFilterChange}
                className="sr-only"
              />
              <span className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${
                filters.material.includes(material) 
                  ? 'border-accent bg-accent' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {filters.material.includes(material) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{material}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brand filter */}
      <FilterSection title="Brand" section="brand">
        <div className="space-y-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                checked={filters.brand.includes(brand)}
                onChange={handleFilterChange}
                className="sr-only"
              />
              <span className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${
                filters.brand.includes(brand) 
                  ? 'border-accent bg-accent' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {filters.brand.includes(brand) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range filter */}
      <FilterSection title="Price Range" section="price">
        <div className="px-1">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600 dark:text-gray-400">${priceRange[0]}</span>
            <span className="font-semibold text-gray-900 dark:text-white">${priceRange[1]}</span>
          </div>
          <input
            type="range"
            name="maxPrice"
            min={0}
            max={100}
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-accent"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${priceRange[1]}%, #e5e7eb ${priceRange[1]}%, #e5e7eb 100%)`
            }}
          />
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
