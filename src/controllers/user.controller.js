import {asynchandler} from "../utils/asynchandler.js";

let registerUser=asynchandler( async function (req,res) {
        res.status(200).json({
            message:"Ok"
        })
})

export {registerUser}