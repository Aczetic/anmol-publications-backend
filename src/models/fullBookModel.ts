// Here will reside the model for the books with full book link in a separate collection to prevent 
// the chances of premium asset leak
// before accessing this collection a check will always be performed whether the user has access 

import mongoose from "mongoose";



const fullBookSchema = new mongoose.Schema({
    ref : {
        type: mongoose.Schema.ObjectId,
        defaultValue:'',
    }
})


const fullBookModel = mongoose.model('fullBook' , fullBookSchema);
export default fullBookModel