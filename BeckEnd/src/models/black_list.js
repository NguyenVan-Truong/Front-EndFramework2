
import mongoose from "mongoose";

const BlackListedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});
export default mongoose.model("BlackListedToken", BlackListedTokenSchema);
