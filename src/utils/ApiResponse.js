class ApiResponse extends Error{
    constructor(statusCode,message="Success",data){
        super(message);
        this.statusCode=statusCode;
        this.data=data;
        this.success=statusCode<400
    }
}

export {ApiResponse};