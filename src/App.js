import { useLocalStorage } from "./useLocalStorage";
import { Header } from "./Header";
import { Book } from "./Book";

//   Staff to add :
// change the language
export default function App() {
  const [BookList, setBookList] = useLocalStorage([], "BooksList");
  console.log(BookList);

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
    <div>
      <Header handleAddBook={handleAddBook} />
      <div className="wrapper">
        <ul className="books">
          {BookList.map((book) => (
            <Book
              key={book.id}
              book={book}
              handleSetBookList={setBookList}
              handleDeleteBook={handleDeleteBook}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BookSuggestion({ book, handleAddBook }) {
  return (
    <div className="result" onClick={() => handleAddBook(book)}>
      {book.volumeInfo.title}
    </div>
  );
}
