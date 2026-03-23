import bookModel from "./models/bookModel.js";
import gkbooks from "./booksgk.js";

async function insertBooks(){
    try{

     const books =   await bookModel.insertMany(gkbooks);

     console.log("following books are added");
    }catch(e){
        console.log(e);
    }
}

insertBooks();