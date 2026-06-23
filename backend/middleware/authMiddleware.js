const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req,res,next)=>{

  const token =
  req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(401).json({
      message:"No token"
    });
  }

  try{

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const user = await User.findByPk(decoded.id, {
      attributes: [
        "id",
        "role",
        "assigned_bungalow_id"
      ]
    });

    if(!user){
      return res.status(401).json({
        message:"Invalid token"
      });
    }

    req.user = {
      id:user.id,
      role:user.role,
      assigned_bungalow_id:user.assigned_bungalow_id
    };

    next();

  }catch(err){

    res.status(401).json({
      message:"Invalid token"
    });

  }

};
