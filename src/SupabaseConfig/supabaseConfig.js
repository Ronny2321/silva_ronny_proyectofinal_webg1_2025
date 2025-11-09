import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://mjrmchgxbclkhzpacoys.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcm1jaGd4YmNsa2h6cGFjb3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDE3ODQsImV4cCI6MjA3ODI3Nzc4NH0._XbLIpNSTFGsdC9Xq-zFpdvp6aT6HVAC8NcrUTywgUk";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const IMAGE_BUCKET = "imagenew";

export default supabase;
