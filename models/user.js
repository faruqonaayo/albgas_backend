import mongoose from "mongoose";

// creating a schema
const Schema = mongoose.Schema;

// creating a user schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  addressProvince: { type: String, required: true },
  address: { type: String },
  email: { type: String, required: true },
  occupation: { type: String, required: true },
  password: { type: String, required: true },
  searchHistory: [
    { searchType: { type: String }, searchValue: { type: String } },
  ],
});


export default mongoose.model("User", userSchema);