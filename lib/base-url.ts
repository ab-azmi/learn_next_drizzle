//get base url of the application
export default function getBaseURL(){
    if(typeof window !== 'undefined') return ""

    //detect vercel deployment
    if(process.env.VERCEL_URL)
        //return vercel or custom domain 
        return `https://${process.env.DOMAIN_URL}`

    //return localhost
    return "http://localhost:3000"
}