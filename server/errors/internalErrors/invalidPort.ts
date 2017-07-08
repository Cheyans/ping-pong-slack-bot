export class InvalidPortError extends Error {
    constructor(port: any){
      super(`Invalid port: ${JSON.stringify(port)}`)
    }
}
