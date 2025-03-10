const asynchandler=(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=> next(err));
    }
}

export {asynchandler};



//we can write the below code also

// const asynchandler = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             next(error);
//         }
//     };
// };
