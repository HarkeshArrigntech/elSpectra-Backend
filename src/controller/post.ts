import Post, { IPostModel } from "../module/post";
import ResponseHelper from "../helper/responseHelper";

export const createPost = async (req: any, res: any) => {
	try {
		let newPost: IPostModel | any = {
			title: req.body.title,
			description: req.body.description,
            tenantName: req.user.tenantName,
            userId: req.user.id,
		};

		Post.create(newPost)
			.then(() => ResponseHelper(res, 200, true, "Post created Successfully"))
			.catch((error) => ResponseHelper(res, 400, false, error.message));
	} catch (err) {
		ResponseHelper(res, 400, false, err.message);
	}
};

export const getPost =async (req:any,res:any)=>{
    try{
 Post.find({"tenantName":req.user.tenantName})
 .then((data)=>{if(data.length>0){
    ResponseHelper(res, 200, true, "Post got Successfully",data)}else{
        ResponseHelper(res, 400, false, "No Posts")
    }}

    )
    
    }catch(err){
        ResponseHelper(res, 400, false, err.message);
    }
    
}