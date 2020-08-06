import  { model, Document, Schema } from "mongoose";
enum profile{
    "admin",
    "nonAdmin"
}
interface IUsersObject {
    name:String;
    emailId:String;
    role: profile;
    userId:String;
}
export type ITenantModel = Document & {
  tenantName: String;
  users: Array< IUsersObject>;
};

export default model<ITenantModel>(
  "tenent",
  new Schema({
    tenantName: {
      type: String,
      required: "Tenent name is missing",
      maxlength: 30,
      trim: true,
      unique:true,
      default: null,
    },
    users: {
      type: Object,
    },
  })
);
