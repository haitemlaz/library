import { useState, useRef, useEffect } from "react";

///////////////////            Book              //////////////////////
export function Book({ book, handleSetBookList, handleDeleteBook }) {
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
