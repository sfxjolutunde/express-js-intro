

export const authorizeRoles = (...roles) => {
  return (req,res,next)=>{
    console.log("req.user", req.user);
    console.log("roles", roles);
    if(!(roles.includes(req.user.role))){
      const err = new Error(`Access Denied, you are not allowed to access this resource!`);
      err.status = 403;
      return next(err);

    }
    next();
  }
}