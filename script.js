import dotenv from 'dotenv'
dotenv.config();

const supaBaseAPI = process.env.SB_API_KEY;
const supaBaseURL = process.env.SB_URL;
console.log(supaBaseAPI);