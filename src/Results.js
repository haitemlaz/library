import { useState, useEffect } from "react";
import { BookSuggestion } from "./App";

export function Results({ query, handleAddBook, SearchResultsRef }) {
  const [ListSize, setListSize] = useState(10);
  const [searchList, setSearchList] = useState([]);

  useEffect(
    function () {
      async function fetchBooks() {
        if (!query) return;
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}+intitle:${query}&maxResults=${ListSize}&langRestrict=en&key=AIzaSyA2gENVhW8QJhj4P2mfMbVImrf1FCvTpwQ`
        );
        const data = await res.json();

        setSearchList(data.items);
      }
      fetchBooks();
    },
    [query, ListSize]
  );
  return (
    <div className="Searchresults" ref={SearchResultsRef}>
      {searchList ? (
        <>
          {searchList.map((e, i) => (
            <BookSuggestion book={e} key={i} handleAddBook={handleAddBook} />
          ))}
          <button onClick={() => setListSize((size) => size + 10)}>
            show more
          </button>

          {ListSize > 10 && (
            <button onClick={() => setListSize(10)}>show less</button>
          )}
        </>
      ) : (
        <div> no results</div>
      )}
    </div>
  );
}
