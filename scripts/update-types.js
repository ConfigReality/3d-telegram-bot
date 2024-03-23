const {exec : _exec} = require('child_process');
const {promisify } = require('util');
const exec = promisify(_exec);
const dotenv = require('dotenv');

dotenv.config();
// use this solution to obscure the connection string in the code
const connection_string = process.env.CONNECTION_STRING;

(async()=>{
    const { stdout, stderr } = await exec(`npx supabase gen types typescript --db-url ${connection_string} --schema public > src/types/supabase.ts`)
    console.log(stdout);
    console.error(stderr);
})();