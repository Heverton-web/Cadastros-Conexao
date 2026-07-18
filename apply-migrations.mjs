import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://cluuqzhizeqvkgvfdisx.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag'

const supabase = createClient(supabaseUrl, serviceRoleKey)

const files = [
  'supabase/migrations/20260718180000_fix_fk_implante_chaves.sql',
  'supabase/migrations/20260718190000_seed_empresa_teste.sql',
]

for (const file of files) {
  console.log(`\n=== Applying: ${file} ===`)
  const sql = readFileSync(file, 'utf-8')

  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    if (stmt.startsWith('--')) continue
    try {
      const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' })
      if (error) {
        // Try direct query if rpc not available
        console.log(`  [${i+1}/${statements.length}] RPC failed, trying query...`)
        const { error: e2 } = await supabase.from('_exec').select().limit(0)
        // If that fails too, log the statement for manual execution
        console.log(`  [SKIP] Statement needs manual execution:`)
        console.log(`  ${stmt.substring(0, 100)}...`)
      } else {
        console.log(`  [${i+1}/${statements.length}] OK`)
      }
    } catch (e) {
      console.log(`  [${i+1}/${statements.length}] ERROR: ${e.message}`)
    }
  }
}

console.log('\n=== Done ===')
