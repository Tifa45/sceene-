import { Settings2 } from "lucide-react";
import { genres, years } from "../lib/constans";
import { formatUserFirstName } from "../lib/utliles";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
function Filter({ filters, setFilters, setFilterPages }) {
  const [expand, setExpand] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());
  function handleFilter(e) {
    if (paramsObj[e.target.name]?.includes(e.target.value)) {
      const filterArray = paramsObj[e.target.name].split(",");
      const updatedFilter = filterArray.filter((f) => f !== e.target.value);
      setFilters((prev) => ({
        ...prev,
        [e.target.name]: updatedFilter,
      }));
      if (updatedFilter.length > 0) {
        searchParams.set(e.target.name, updatedFilter.join(","));
      } else {
        searchParams.delete(e.target.name);
      }
      setSearchParams(searchParams);
    } else {
      setFilters({
        ...filters,
        [e.target.name]: [...(filters[e.target.name] ?? []), e.target.value],
      });
    }
    setFilterPages(0);
  }

  return (
    <div className="mt-4 max-w-7xl mx-auto ">
      <div className="flex gap-4 items-center">
        <button type="button" onClick={() => setExpand(!expand)}>
          <Settings2 size={35} />
        </button>
        Filters
      </div>
      {expand && (
        <div className="w-full bg-gray-300/15 p-4 flex flex-col gap-6 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setFilters({});
              setSearchParams({});
            }}
          >
            clear
          </button>
          <div>
            <h2 className="text-lg font-extrabold">Genre:</h2>
            <div className="flex flex-wrap gap-4 ">
              {genres.map((genre) => (
                <div key={genre} className="px-2 py-1.5 hover:text-amber-400">
                  <label className="flex items-center gap-2" >
                    <input
                      className=" bg-none accent-primary"
                      type="checkbox"
                      name="genre"
                      value={genre}
                      checked={
                        filters.genre?.includes(genre) ||
                        paramsObj.genre?.includes(genre)
                      }
                      onChange={handleFilter}
                    />
                    {formatUserFirstName(genre)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Year:</h2>
            <div className="flex flex-wrap gap-4 ">
              {years.map((year) => (
                <div
                  key={year}
                  className=" flex gap-2 rounded-lg hover:text-amber-400"
                >
                  <label className="flex items-center gap-2 px-2 py-1.5  ">
                    <input
                      className=" bg-none accent-primary"
                      type="checkbox"
                      name="year"
                      value={year}
                      checked={
                        filters.year?.includes(year) ||
                        paramsObj.year?.includes(year)
                      }
                      onChange={handleFilter}
                    />
                    {year}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
