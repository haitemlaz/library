import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRegular, faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocalStorage } from "./useLocalStorage";

//   Staff to add :
// change the language
export default function App() {
  const [BookList, setBookList] = useLocalStorage([], "BooksList");
  console.log(BookList);
  // const [BookList, setBookList] = useState([]);
  const [isAddBook, setIsAddBook] = useState(false);
  function handleAddBook(book) {
    book = { ...book, pagesRead: 0 };
    setBookList((bookList) =>
      bookList.some((oldBook) => oldBook.id === book.id)
        ? bookList
        : [...bookList, book]
    );
  }
  function handleDeleteBook(book) {
    setBookList((booklist) => booklist.filter((e) => e.id !== book.id));
  }

  return (
    <div onClick={() => setIsAddBook(false)}>
      <Header handleAddBook={handleAddBook} />
      <div className="wrapper">
        {isAddBook && (
          <AddBook setAddbook={setIsAddBook} handleAddBook={handleAddBook} />
        )}
        {/* <Books
      books={BookList}
      handleSetBookList={setBookList}
      setAddbook={setIsAddBook}
    /> */}
        <Books>
          {BookList.map((book) => (
            <Book
              key={book.id}
              book={book}
              handleSetBookList={setBookList}
              handleDeleteBook={handleDeleteBook}
            />
          ))}
          <AddBtn setIsAddBook={setIsAddBook} />
        </Books>
      </div>
    </div>
  );
}
///////////////////            Books              //////////////////////
function Books({ books, handleSetBookList, setAddbook, children }) {
  return <ul className="books">{children}</ul>;
}

///////////////////            Book              //////////////////////

function Book({ book, handleSetBookList, handleDeleteBook }) {
  const [isPagesInput, setIsPagesInput] = useState(false);

  const pagesInputRef = useRef(null);

  // function handleIsPagesInput(number) {
  //   setIsPagesInput((pagesRead) =>
  //     number < book.volumeInfo.pageCount ? number : pagesRead
  //   );
  // }
  // add pagesRead to the book object
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pagesInputRef.current &&
        !pagesInputRef.current.contains(event.target)
      ) {
        setIsPagesInput(false);
      }
    }
    if (isPagesInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPagesInput]);

  function onSetPage(page) {
    if (page <= book.volumeInfo.pageCount) {
      handleSetBookList((books) =>
        books.map((item) =>
          book.id === item.id ? { ...item, pagesRead: page } : item
        )
      );
    }
  }
  const { id, title, nbrOfPages, thumbnail } = {};

  return (
    <li className="book">
      <div className="cover">
        <img alt="pic" src={book.volumeInfo.imageLinks?.thumbnail} />
        <button className="delete" onClick={() => handleDeleteBook(book)}>
          X
        </button>
        <div className="bar">
          <div
            className="progress"
            style={{
              width: (book.pagesRead / book.volumeInfo.pageCount) * 100 + "%",
            }}
          ></div>
        </div>
      </div>
      <div className="info">
        <h3 style={{ textAlign: "center" }}>{book.volumeInfo.title}</h3>
        {isPagesInput ? (
          <div className="pages">
            <input
              ref={pagesInputRef}
              type="range"
              min="0"
              max={book.volumeInfo.pageCount}
              value={book.pagesRead}
              onChange={(e) => onSetPage(Number(e.target.value))}
            />
            <div>{`${book.pagesRead} / ${book.volumeInfo.pageCount}`}</div>
          </div>
        ) : (
          <div className="pages" onClick={() => setIsPagesInput(true)}>
            {`${book.pagesRead} / ${book.volumeInfo.pageCount}`}
          </div>
        )}

        <button className="details">Details</button>
      </div>
    </li>
  );
}
///////////////////            Add              //////////////////////
function AddBtn({ setIsAddBook }) {
  return (
    <li className="book" onClick={(e) => e.stopPropagation()}>
      <div className="circle" onClick={() => setIsAddBook(true)}>
        <div className="hor"></div>
        <div className="ver"></div>
      </div>
    </li>
  );
}
///////////////////            AddBook              //////////////////////
function AddBook({ setAddbook, handleAddBook }) {
  const [query, setQuery] = useState(null);
  const [searchList, setSearchList] = useState([]);
  useEffect(
    function () {
      async function fetchBooks() {
        if (!query) return;
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=en&key=AIzaSyA2gENVhW8QJhj4P2mfMbVImrf1FCvTpwQ`
        );
        const data = await res.json();

        setSearchList(data.items);
      }
      fetchBooks();
    },
    [query]
  );
  return (
    <div className="addBook" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        className="searchBar"
        onChange={(e) => setQuery(e.target.value)}
      ></input>
      <div className="results">
        {searchList.map((e, i) => (
          <BookSuggestion book={e} key={i} handleAddBook={handleAddBook} />
        ))}
      </div>
      <div className="btns">
        <button onClick={() => setAddbook(false)}>cancel</button>
        <button>save</button>
      </div>
    </div>
  );
}
function Results() {
  return <div className="results"></div>;
}

function BookSuggestion({ book, handleAddBook }) {
  return (
    <div className="result" onClick={() => handleAddBook(book)}>
      {book.volumeInfo.title}
    </div>
  );
}
function Header({ setAddbook, handleAddBook }) {
  const [query, setQuery] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isSearchResults, setIsSearchResults] = useState(true);
  const [ListSize, setListSize] = useState(10);
  const SearchResultsRef = useRef(null);
  const SearchInputRef = useRef(null);
  useEffect(() => {
    // if (SearchInputRef.current === document.activeElement) {
    //   console.log("focus");
    //   setIsSearchResults(true);
    // }
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
        <div className="Searchresults" ref={SearchResultsRef}>
          {searchList ? (
            <>
              {searchList.map((e, i) => (
                <BookSuggestion
                  book={e}
                  key={i}
                  handleAddBook={handleAddBook}
                />
              ))}
              <button onClick={() => setListSize((size) => size + 10)}>
                show more
              </button>

              {ListSize > 10 && (
                <button onClick={() => setListSize(10)}>show less</button>
              )}
            </>
          ) : (
            <div>no results</div>
          )}
        </div>
      ) : null}
      <div className="user-profile">
        <FontAwesomeIcon icon={faUser} />
      </div>
    </header>
  );
}
