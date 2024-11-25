import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

//   Staff to add :
// change the language

// const BooksList = [
//   {
//     id: 5214655,
//     title: "The old man and the sea",
//     img: "pic.jpg",
//     pages: 120,
//     pagesRead: 60,
//   },
//   {
//     id: 1029384,
//     title: "To Kill a Mockingbird",
//     img: "to_kill_a_mockingbird_cover-t34.jpg",
//     pages: 324,
//     pagesRead: 32,
//   },
//   {
//     id: 2938475,
//     title: "1984",
//     img: "pic2.jpeg",
//     pages: 328,
//     pagesRead: 98,
//   },
//   {
//     id: 3948576,
//     title: "The Great Gatsby",
//     img: "the-great-gatsby-9781524879761_hr.jpg",
//     pages: 180,
//     pagesRead: 90,
//   },
//   {
//     id: 4857698,
//     title: "The Catcher in the Rye",
//     img: "614LavjvoLL._AC_UF1000,1000_QL80_.jpg",
//     pages: 214,
//     pagesRead: 107,
//   },
//   {
//     id: 5769809,
//     title: "Pride and Prejudice",
//     img: "81me+udV63L._AC_UF1000,1000_QL80_.jpg",
//     pages: 279,
//     pagesRead: 240,
//   },
//   {
//     id: 6870910,
//     title: "The Hobbit",
//     img: "https://bn.bkocdn.info/covers/124e162ee0d23f3/v/600.jpeg",
//     pages: 310,
//     pagesRead: 155,
//   },
//   {
//     id: 7981021,
//     title: "Moby-Dick",
//     img: "9780143105954.jpeg",
//     pages: 635,
//     pagesRead: 317,
//   },
//   {
//     id: 8092132,
//     title: "War and Peace",
//     img: "War-and-Peace-book-cover.jpeg",
//     pages: 1225,
//     pagesRead: 612,
//   },
//   {
//     id: 9213243,
//     title: "Crime and Punishment",
//     img: "71O2XIytdqL._AC_UF1000,1000_QL80_.jpg",
//     pages: 430,
//     pagesRead: 215,
//   },
//   {
//     id: 1324354,
//     title: "The Odyssey",
//     img: "9781853260254.jpg",
//     pages: 541,
//     pagesRead: 70,
//   },
//   {
//     id: 7980910,
//     title: "Don Quixote",
//     img: "71mbJoazlCL._AC_UF1000,1000_QL80_.jpg",
//     pages: 1072,
//     pagesRead: 536,
//   },
//   {
//     id: 9212132,
//     title: "Les Misérables",
//     img: "les-miserables-305.jpg",
//     pages: 1463,
//     pagesRead: 31,
//   },
// ];
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
