import { model, Document, Schema } from "mongoose";
enum profile {
  admin= "admin",nonAdmin="nonAdmin"
}
export type IUserModel = Document & {
  userName: String;
  password: String;
  emailId: String;
  tenantName:string;
  role:profile;
};

export default model<IUserModel>(
  "user",
  new Schema({
    userName: {
      type: String,
      required: "User name is missing",
      maxlength: 30,
      trim: true,
      default: null,
    },
    role:{
type:profile,
required: "role is missing missing",

    },
    tenantName:{
      type: String,
      maxlength: 30,
      trim: true,
      default: null,
    },
    emailId: {
      type: String,
      unique: true,
      required: "email id is missing",
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: "password is missing",
      minlength: 8,
    },
    salt: String,
  })
);
