/* eslint-disable radix */
const { nanoid } = require('nanoid');
const books = require('../data');

function addBooksHandler(request, h) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = parseInt(pageCount) === parseInt(readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  if (name === '' || name === undefined || name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (parseInt(readPage) > parseInt(pageCount)) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(400);
  return response;
}

function getBooksHandler(request, h) {
  const { reading, finished, name } = request.query;
  const booksResponse = [];
  if (books.length > 0) {
    if (reading !== undefined) {
      if (parseInt(reading) === 1) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < books.length; i++) {
          if (books[i].reading === true) {
            const newBooks = {
              id: books[i].id,
              name: books[i].name,
              publisher: books[i].publisher,
            };
            booksResponse.push(newBooks);
          }
        }
      } else {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < books.length; i++) {
          if (books[i].reading === false) {
            const newBooks = {
              id: books[i].id,
              name: books[i].name,
              publisher: books[i].publisher,
            };
            booksResponse.push(newBooks);
          }
        }
      }
    } else if (finished !== undefined) {
      if (parseInt(finished) === 1) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < books.length; i++) {
          if (books[i].finished === true) {
            const newBooks = {
              id: books[i].id,
              name: books[i].name,
              publisher: books[i].publisher,
            };
            booksResponse.push(newBooks);
          }
        }
      } else {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < books.length; i++) {
          if (books[i].finished === false) {
            const newBooks = {
              id: books[i].id,
              name: books[i].name,
              publisher: books[i].publisher,
            };
            booksResponse.push(newBooks);
          }
        }
      }
    } else if (name !== undefined) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < books.length; i++) {
        if (books[i].name.toLowerCase().indexOf(name.toLowerCase(), 0, true) > -1) {
          const newBooks = {
            id: books[i].id,
            name: books[i].name,
            publisher: books[i].publisher,
          };
          booksResponse.push(newBooks);
        }
      }
    } else {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < books.length; i++) {
        const newBooks = {
          id: books[i].id,
          name: books[i].name,
          publisher: books[i].publisher,
        };
        booksResponse.push(newBooks);
      }
    }

    const response = h.response({
      status: 'success',
      data: {
        books: booksResponse,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: {
        id: booksResponse,
      },
    },
  });
  response.code(200);
  return response;
}

function getBooksByIdHandler(request, h) {
  const { bookId } = request.params;
  const book = books.filter((book_) => book_.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
}

function editBookByIdHandler(request, h) {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  if (name === '' || name === undefined || name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (parseInt(readPage) > parseInt(pageCount)) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book_) => book_.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

function deleteBookByIdHandler(request, h) {
  const { bookId } = request.params;
  const index = books.findIndex((book_) => book_.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

module.exports = {
  addBooksHandler,
  getBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
