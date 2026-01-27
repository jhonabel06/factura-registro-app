import { createClient as createClientFromLib } from './lib/supabase/client'

// Use the createClient helper in lib/supabase/client.ts to build the browser client
const supabase = createClientFromLib()

export { supabase }
export default supabase
