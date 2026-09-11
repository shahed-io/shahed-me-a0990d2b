// Hostinger "Connect from your Web App" database check.
// Hostinger injects SUPABASE_URL and SUPABASE_ANON_KEY at build/run time.
// The app itself uses src/integrations/supabase/client.ts — this file only
// verifies the connection during deployment.
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("Supabase environment variables are not set yet.");
  module.exports = { supabase: null };
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  async function testConnection() {
    const { error } = await supabase.from("posts").select("id").limit(1);
    if (error) console.error("Supabase connection failed:", error.message);
    else console.log("Supabase connection OK");
  }

  if (require.main === module) testConnection();

  module.exports = { supabase, testConnection };
}
