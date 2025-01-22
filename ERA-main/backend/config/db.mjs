import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://chandankiri88:GxQektp5vCJMao8p@cluster0.d2jba.mongodb.net/");
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    
  }
};
export default connectDB