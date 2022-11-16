import { loginParams,registerParams } from "./interface"

export type loginRequest = Request&{body:loginParams}

export type registerRequest = Request&{body:registerParams}