import "dotenv/config";
import User, { IUserModel } from "../module/user";
import Tenant, { ITenantModel } from "../module/tenant";
import ResponseHelper from "../helper/responseHelper";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

const { SECRET } = process.env;

export const trialOutput = async (req: any, res: any) => {
	return res.json({ text: "sucessfully gettig the json" });
};

// Create User
export const createUser = async (req: any, res: any) => {
	try{
	const UsersDoc: IUserModel | null = await User.findOne({
		emailId: req.body.emailId,
	});
	if (UsersDoc) {
		ResponseHelper(res, 400, false, "Email-Id exists");
	} else {
		let newUserData: any = {
			emailId: req.body.emailId,
			userName: req.body.userName,
		password: "",
		role:"nonadmin"
	  };
		bcrypt.hash(req.user.tenantName + "@123", 10, async (err, hash) => {
            newUserData.password = await hash;
			newUserData.tenantName = req.user.tenantName
            const newUser: IUserModel | null = await User.create(newUserData);
            if (newUser) {
               
                const users:any= {
                  name: newUser.userName,
                  emailId: newUser.emailId,
                  role: "nonadmin",
                  userId: newUser._id,
                }
            //   Tenant.create(newTenentdata).then(() =>
            //     ResponseHelper(res, 200, true, "Registeration Success"),
              
			//   );
			Tenant.findOneAndUpdate({"tenantName":req.user.tenantName},{$push: { users:users }}).then(()=> ResponseHelper(res, 200, true, "Registeration Success")
			).catch((err)=>	ResponseHelper(res, 400, false, err.message))
            }
           });
	}
}catch(err){

	ResponseHelper(res, 400, false, err.message);
}
};

export const signIn = (req: any, res: any) => {
	if (
		req.body.emailId === "" ||
		req.body.emailId === null ||
		req.body.password === "" ||
		req.body.password === null
	) {
		return res
			.status(400)
			.json({ error: "email or password not found", sucess: false });
	} else {
		User.findOne({ emailId: req.body.emailId })
			.exec()
			.then((user: any) => {
				if (user !== null) {
					bcrypt.compare(req.body.password, user.password, (err, result) => {
						if (result) {
							const token = jwt.sign(
								{ id:user._id,emailId: user.emailId, userName: user.userName,role:user.role,tenantName:user.tenantName },
								"elSpectra",
								{
									expiresIn: "12h",
								},
							);
							ResponseHelper(res, 200, true, "user signin sucess", {
                userName: user.userName,
                role:user.role,tenantName:user.tenantName,emailId:user.emailId,
								token: token,
							});
						} else {
							ResponseHelper(res, 400, false, "wrong password");
						}
					});
				} else {
					ResponseHelper(res, 400, false, "no emailid found");
				}
			})
			.catch((err) => {
				ResponseHelper(res, 400, false, "error", err);
			});
	}
};

export const signUp = async (req: any, res: any) => {
	let newUserData: any = {
		emailId: req.body.emailId,
		userName: req.body.userName,
    password: "",
    role:"admin"
  };

	try {
		const UsersDoc: IUserModel | null = await User.findOne({
			emailId: newUserData.emailId,
		});
		if (UsersDoc) {
			ResponseHelper(res, 400, false, "Email-Id exists");
		} else {
			if (
				newUserData.emailId.indexOf("@") == -1 ||
				newUserData.emailId.indexOf(".com") == -1
			) {
				ResponseHelper(res, 400, false, "Email-Id formate is wrong");
			} else {
				let tenantNameReq = newUserData.emailId.slice(
					newUserData.emailId.indexOf("@") + 1,
					newUserData.emailId.indexOf(".com"),
				);
				if(tenantNameReq !== "gmail" && tenantNameReq !== "yahoo"){
					
				const tenentDoc: ITenantModel | null = await Tenant.findOne({
					"tenantName": tenantNameReq,
				});
				if (tenentDoc) {
					ResponseHelper(res, 400, false, "Tenant is already Present");
				} else {
					 bcrypt.hash(req.body.password, 10, async (err, hash) => {
            newUserData.password = await hash;
			newUserData.tenantName = tenantNameReq
            const newUser: IUserModel | null = await User.create(newUserData);
            if (newUser) {
              const newTenentdata = {
                tenantName: tenantNameReq,
                users: [{
                  name: newUser.userName,
                  emailId: newUser.emailId,
                  role: "admin",
                  userId: newUser._id,
                }]
              };
              Tenant.create(newTenentdata).then(() =>
                ResponseHelper(res, 200, true, "Registeration Success"),
              
              );
            }
           });

				}
			    }else{
					bcrypt.hash(req.body.password, 10, async (err, hash) => {
						newUserData.password = await hash;
						newUserData.tenantName = req.body.emailId
						const newUser: IUserModel | null = await User.create(newUserData);
						if (newUser) {
						  const newTenentdata = {
							tenantName: req.body.emailId,
							users: [{
							  name: newUser.userName,
							  emailId: newUser.emailId,
							  role: "admin",
							  userId: newUser._id,
							}]
						  };
						  Tenant.create(newTenentdata).then(() =>
							ResponseHelper(res, 200, true, "Registeration Success"),
						  
						  );
						}
					   });
				}
			}
		}
	} catch (error) {
		ResponseHelper(res, 400, false, error.message);
	}
};
