import mongoose from "mongoose";

const randomStars = ()=>{
    return Math.floor(Math.random() + 4);
}

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bookDetail: {
    type: String,
    required: true,
  },
  seriesName: {
    type: String,
    defaultValue: "", // some books may not be part of any series
  },
  salientFeatures: {
    type: [String],
    defaultValue: [],
  },
  supportingMaterial: {
    type: [String],
    defaultValue: [],
  },
  class: { type: Number, defaultValue: "0" }, // 0 means not meant for any class
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
    },
  ],
  reviews: [
    {
      stars: { type: Number },
      description: { type: String },
    },
  ],
  images: [String], // TODO: book image upload
  tags: [String], // this helps in book search
  sampleBook: String, // a link to where the books is located
  // TODO: book upload
  buyLink : [String]
});

const bookModel = mongoose.model('book' , bookSchema);

export default bookModel;