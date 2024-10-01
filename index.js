require("./db");
const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const Books = require("./models/books.models");
console.log("Connect to database");

async function createBook(newBookData) {
  try {
    const newBook = new Books(newBookData);
    const saveBook = await newBook.save();
    // console.log(saveBook);
    return saveBook;
  } catch (error) {
    console.log(error);
  }
}

app.post("/books", async (req, res) => {
  try {
    const seedBookData = await createBook(req.body);
    if (seedBookData) {
      res.status(201).json({
        message: "Book added successfully",
        seedBookData: seedBookData,
      });
    } else {
      res.status(404).json({ error: "Failed to added recipe" });
    }
  } catch (error) {
    res.status(505).json({ error: "Failed to added the book. " });
  }
});

async function getAllBooks() {
  try {
    const allBooks = await Books.find();
    // console.log(allBooks);
    return allBooks;
  } catch (error) {
    console.log(error);
  }
}
app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    if (books.length != 0) {
      res.status(201).json({ message: "Here is your all books", books: books });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    console.log(error);
  }
});

async function getBookByTitle(title) {
  try {
    const bookTitle = await Books.findOne({ title: title });
    return bookTitle;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/:title", async (req, res) => {
  const bookByTitle = await getBookByTitle(req.params.title);
  if (bookByTitle) {
    res
      .status(201)
      .json({ message: "Book by title", bookByTitle: bookByTitle });
  } else {
    res.status(404).json({ error: "Failed to fetch by Book title" });
  }
});

async function getBooksByAuthor(author) {
  try {
    const bookAuthors = await Books.find({ author: author });
    console.log(bookAuthors);
    return bookAuthors;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/author/:author", async (req, res) => {
  try {
    const bookOfAuthor = await getBooksByAuthor(req.params.author);
    if (bookOfAuthor) {
      res
        .status(201)
        .json({ message: "Book by author", bookOfAuthor: bookOfAuthor });
    } else {
      req.status(404).json({ error: "Failed to fetch book by author" });
    }
  } catch (error) {
    console.log(error);
  }
});

async function getBooksByBusiness(genre) {
  try {
    const bookBusiness = await Books.find({ genre: genre });
    console.log(bookBusiness);
    return bookBusiness;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching books by business");
  }
}
// getBooksByBusiness("Business");
app.get("/books/genre/:genrename", async (req, res) => {
  try {
    const bookOfBusiness = await getBooksByBusiness(req.params.genrename);
    if (bookOfBusiness && bookOfBusiness.length > 0) {
      res
        .status(200)
        .json({ message: "Books by business", bookOfBusiness: bookOfBusiness });
    } else {
      res
        .status(404)
        .json({ error: "No books found for the given business genre" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch books by business" });
  }
});

async function getPublishedYear(year) {
  try {
    const realeaseBook = await Books.find({ publishedYear: year });
    return realeaseBook;
  } catch (error) {
    console.log(error);
  }
}
app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const showtheBook = await getPublishedYear(req.params.year);
    if (showtheBook && showtheBook.length > 0) {
      res
        .status(201)
        .json({ message: "Book by year ", showtheBook: showtheBook });
    } else {
      res.status(404).json({ error: "Failed to fetch books by business" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book by Year." });
  }
});

async function changeRatingBook(bookId, updateData) {
  try {
    const updaterating = await Books.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });

    return updaterating;
  } catch (error) {
    console.log(error);
  }
}

app.post("/books/rating/:ratingID", async (req, res) => {
  try {
    const ratingUpdate = await changeRatingBook(req.params.ratingID, req.body);
    if (ratingUpdate) {
      res.status(201).json({
        message: "update book data by rating",
        ratingUpdate: ratingUpdate,
      });
    } else {
      res.status(404).json({ error: "Failed to fetch books by id" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book By Rating." });
  }
});

async function findByTitle(title, updateData) {
  try {
    const updatedByTitle = await Books.findOneAndUpdate(
      { title: title },
      updateData,
      { new: true }
    );
    return updatedByTitle;
    // console.log(updatedByTitle);
  } catch (error) {
    console.log(error);
  }
}
// findByTitle("Shoe Dog", { publishedYear: 2017, rating: 4.2 });
app.post("/books/title/:byTitle", async (req, res) => {
  try {
    const bookTitle = await findByTitle(req.params.byTitle, req.body);
    if (bookTitle) {
      res
        .status(201)
        .json({ message: "update book by title", bookTitle: bookTitle });
    } else {
      res.status(404).json({ error: "Failed to update the book by title" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book By title." });
  }
});

async function deleteBookById(bookId) {
  try {
    const deleteBook = await Books.findByIdAndDelete(bookId);
    return deleteBook;
  } catch (error) {
    console.log(error);
  }
}
app.delete("/books/bookId/:deleteById", async (req, res) => {
  try {
    const bookDeleteById = await deleteBookById(req.params.deleteById);
    if (bookDeleteById) {
      res.status(201).json({ message: "Book deleted by id successfully." });
    } else {
      res.status(404).json({ error: "Failed to delete by id" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book By Id." });
  }
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
