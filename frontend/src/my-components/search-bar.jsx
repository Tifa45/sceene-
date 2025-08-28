import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function SearchBar() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCategory = searchParams.get("category");

  const [searchTerm, setSearchTerm] = useState("");
  const disabled = searchTerm.trim().length === 0;
  const nav = useNavigate();

  return (
    <div className="relative w-[30%]">
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          nav(
            `/search?search=${searchTerm}${
              category
                ? `&category=${category}`
                : searchCategory
                ? `&category=${searchCategory}`
                : ""
            }`
          )
        }
        className={`absolute top-2.5 right-4  ${disabled && "disabled-txt"}`}
      >
        <Search size={22} />
      </button>
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        className="w-full rounded-lg border-1 px-4 py-2 "
      />
    </div>
  );
}

export default SearchBar;
