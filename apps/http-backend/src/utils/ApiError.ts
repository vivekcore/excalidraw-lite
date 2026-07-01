

class ApiError extends Error {
    private readonly statuscode:number;
    private readonly IsOperational:boolean
    constructor(statuscode:number,message:string,IsOperational = true){
        super(message)
        this.statuscode = statuscode
        this.IsOperational = IsOperational
    }

}
export default ApiError