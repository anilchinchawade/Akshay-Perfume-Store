
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
export class ApiClientError extends Error {
  constructor(message:string,public readonly status:number){super(message);this.name="ApiClientError";}
}
type RequestOptions=Omit<RequestInit,"body">&{body?:unknown};
async function perform(path:string,options:RequestOptions):Promise<Response>{
 const headers=new Headers(options.headers);headers.set("Accept","application/json");
 let body:BodyInit|undefined;
 if(options.body!==undefined){headers.set("Content-Type","application/json");body=JSON.stringify(options.body);}
 return fetch(`${API_BASE_URL}${path}`,{...options,headers,body,credentials:"include"});
}
export async function apiRequest<T>(path:string,options:RequestOptions={}):Promise<T>{
 let response=await perform(path,options);
 const canRefresh=response.status===401&&path!=="/auth/refresh"&&path!=="/auth/login"&&path!=="/auth/register"&&path!=="/auth/logout";
 if(canRefresh){
  const refreshed=await perform("/auth/refresh",{method:"POST"});
  if(refreshed.ok) response=await perform(path,options);
 }
 const payload:unknown=await response.json().catch(()=>null);
 if(!response.ok){
  const message=typeof payload==="object"&&payload!==null&&"message" in payload&&typeof payload.message==="string"?payload.message:"The request could not be completed.";
  throw new ApiClientError(message,response.status);
 }
 return payload as T;
}
