import bcryptjs from 'bcryptjs'
import User from './models/User'
export class Helper{
    public static shalowCopy(source:any,target:any){
        Object.keys(target).forEach((key)=>{
            if(source[key]!== undefined){
                target[key] = source[key]
            }
        })
        return target
    }
    public static slugify(text:string):string{
        return text
            .trim()
            .toLowerCase()
            .split(' ')
            .filter(ele => ele || null)
            .join('-')
            .replace(/[/\\?&%*|"<>(){}\s]/g, '-');        
    }
}