import mongoose from "mongoose";

const generateId = ()=>{
  return crypto.randomUUID();
}

const bookSchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateId
  },
  name: { type: String, required: true, unique: true },
  bookDetail: {
    type: String,
    required: true,
  },
  seriesName: {
    type: String,
    default: "", // some books may not be part of any series
  },
  salientFeatures: {
    type: [String],
    default: [],
  },
  supportingMaterial: {
    type: [String],
    default: [],
  },
  class: { type: Number, default: 0 }, // 0 means not meant for any class
  subject:{ type: String , required : true},
  language : { type: String , required : true},
  edition: { type: Number, required: true },
  publishedBy: { type: String, required: true },
  printedBy: { type: String, required: true },
  publishYear: { type: String, required: true },
  isbn: { type: String, required: true },
  nepYear: { type: String, required: true },
  people: [
    {
      designation: { type: String, required: true },
      name: { type: String, required: true },
      about: { type: String, required: true}
    },
  ],
  reviews: [
    { 
      name: {type: String},
      stars: { type: Number },
      review: { type: String },
    },
  ],
  images: [String], 
  tags: [String], // this helps in book search
  sampleBook: String, // a link to where the books is located
  // TODO: book upload
  buyLinks : [{
    platform: String,
    link: String
  }],
  createdAt:{
    type: Date,
    default: Date.now
  }
});

const bookModel = mongoose.model('book' , bookSchema);

export default bookModel;