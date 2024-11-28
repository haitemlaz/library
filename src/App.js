import { useEffect, useState } from "react";
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
    <>
      <Header />
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
    </>
  );
}
///////////////////            Books              //////////////////////
function Books({ books, handleSetBookList, setAddbook, children }) {
  return <ul className="books">{children}</ul>;
}

///////////////////            Book              //////////////////////

function Book({ book, handleSetBookList, handleDeleteBook }) {
  // add pagesRead to the book object

  function onSetPage(page) {
    handleSetBookList((books) =>
      books.map((item) =>
        book.id === item.id ? { ...item, pagesRead: page } : item
      )
    );
  }
  const { id, title, nbrOfPages, thumbnail } = {};

  return (
    <li className="book">
      <div className="cover">
        <img alt="pic" src={book.volumeInfo.imageLinks.thumbnail} />
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
        <select
          className="pages"
          value={book.pagesRead}
          onChange={(e) => onSetPage(e.target.value)}
        >
          {Array.from(
            { length: book.volumeInfo.pageCount },
            (_, i) => i + 1
          ).map((page) => (
            <option value={page} key={page}>
              {page + " / " + book.volumeInfo.pageCount} Pages
            </option>
          ))}
        </select>
        <button className="details">Details</button>
      </div>
    </li>
  );
}
///////////////////            Add              //////////////////////
function AddBtn({ setIsAddBook }) {
  return (
    <li className="book">
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
    <div className="addBook">
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
function BookSuggestion({ book, handleAddBook }) {
  return (
    <div className="result" onClick={() => handleAddBook(book)}>
      {book.volumeInfo.title}
    </div>
  );
}
function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={"logo.png"} alt="Logo" />
      </div>
      <input type="text" className="search-bar" placeholder="Search..." />
      <div className="user-profile">
        <FontAwesomeIcon icon={faUser} />
      </div>
    </header>
  );
}
