import mongoose from "mongoose";



const BooksListSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        unique: true,
    },
    books: {
        type: [{
            id: String,
            name: String,
            images: [String],
        }], default: []
    }, // the list of objects( that contains id of books and list of image links)
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const booksListModel = mongoose.model('booksList', BooksListSchema);

export { BooksListSchema };
export default booksListModel;