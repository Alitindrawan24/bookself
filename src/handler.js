const books = require('./books');
const {nanoid} = require('nanoid');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if(name == null){
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    if(pageCount < readPage){
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }
    
    let finished = false;
    if(pageCount == readPage)
        finished = true;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
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
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    
    return response;
};

const getBookHandler = (request, h) => {

    const {reading, finished, name} = request.query

    if(reading){
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.reading == reading ).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        }
    }
    
    if(finished){
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.finished == finished ).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        }
    }

    if(name){
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
            }
        }
    }

    return {
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    }
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];
    
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    
    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan"
    });

    response.code(404);

    return response;
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;    
    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading

    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if(name == null){
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    if(pageCount < readPage){
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }
    
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
            status: "success",
            message: "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

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
    addBookHandler,
    getBookHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
};