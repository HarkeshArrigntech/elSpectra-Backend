import  { model, Document, Schema } from "mongoose";


export type IPostModel = Document & {
    title:String;
    description:String;
  tenantName: String;
  userId:string;
};

export default model<IPostModel>(
  "posts",
  new Schema({
    title: {
        type: String,
        required: "Title name is missing",
        maxlength: 30,
        default: null,
      },
      description: {
        type: String,
        required: "description name is missing",
        default: null,
      },
    tenantName: {
      type: String,
      required: "Tenent name is missing",
      maxlength: 30,
      trim: true,
      default: null,
    },
    userId:{
        type:String,
        required: "userId is missing",  
    },
  })
);
