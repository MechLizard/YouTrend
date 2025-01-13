const { createClient } = require('@supabase/supabase-js');
const result = require('dotenv').config({ path: './.env' });
if (result.error) {
    console.error('Failed to load .env file:', result.error);
}

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

if (supabase){
    console.log("Connected to Supabase!");
    module.exports = supabase;
} else {
    console.error("Failed to connect to database", err);
}

module.exports = { supabase };