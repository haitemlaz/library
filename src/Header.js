import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { Results } from "./Results";

export function Header({ handleAddBook }) {
  const [query, setQuery] = useState("");
  const [isSearchResults, setIsSearchResults] = useState(true);
  const SearchResultsRef = useRef(null);
  const SearchInputRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      console.log("target", event.target);
      console.log("SearchInput", SearchInputRef.current);
      if (
        SearchResultsRef.current &&
        !SearchResultsRef.current.contains(event.target) &&
        SearchInputRef.current &&
        !SearchInputRef.current.contains(event.target)
      ) {
        // setQuery("");
        setIsSearchResults(false);
      }
    }

    if (query) {
      document.addEventListener("mousedown", handleClickOutside);
      SearchInputRef.current.addEventListener("focus", () =>
        setIsSearchResults(true)
      );
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      SearchInputRef.current.removeEventListener("focus", () =>
        setIsSearchResults(true)
      );
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [query, SearchInputRef]);
  return (
    <header className="header">
      <div className="logo">
        <img src={"logo.png"} alt="Logo" />
      </div>
      <input
        ref={SearchInputRef}
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsSearchResults(true);
        }}
      />
      {query && isSearchResults ? (
        <Results
          query={query}
          handleAddBook={handleAddBook}
          SearchResultsRef={SearchResultsRef}
        />
      ) : null}
      <div className="user-profile">
        <FontAwesomeIcon icon={faUser} />
      </div>
    </header>
  );
}
