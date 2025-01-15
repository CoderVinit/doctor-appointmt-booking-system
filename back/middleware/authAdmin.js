import jwt from 'jsonwebtoken'


const varifytoken = async(req, res, next) => {
   try {
    const {atoken} = req.headers;
    if(!atoken){
        return res.json({success:false,message:'Not Authorized Login Again'})
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    if(decoded !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
        return res.json({success:false, message:'Not Authorized Login Again'});
    }

    next()
    
   } catch (error) {
    console.log(error)
    return res.json({success:false,message:error.message})
   }
}


export {varifytoken}