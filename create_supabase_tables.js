import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ziobviyhmzwktasxplsd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2J2aXlobXp3a3Rhc3hwbHNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1OTM2MSwiZXhwIjoyMDY1MTM1MzYxfQ._--Mtq3rwUtJaYHqB4LvDp-qrFPW1PxZ44iQVZ_mOII';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('Creating players table...');
    
    // Create players table
    const { data: playersResult, error: playersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS players (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          company TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `
    });

    if (playersError) {
      console.log('Players table error:', playersError);
    } else {
      console.log('Players table created successfully');
    }

    console.log('Creating game_sessions table...');
    
    // Create game_sessions table
    const { data: sessionsResult, error: sessionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS game_sessions (
          id SERIAL PRIMARY KEY,
          player_id INTEGER REFERENCES players(id) NOT NULL,
          score INTEGER NOT NULL,
          rounds_completed INTEGER NOT NULL,
          completed_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `
    });

    if (sessionsError) {
      console.log('Game sessions table error:', sessionsError);
    } else {
      console.log('Game sessions table created successfully');
    }

    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase.rpc('exec_sql', {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    });

    if (tablesError) {
      console.log('Error checking tables:', tablesError);
    } else {
      console.log('Tables in database:', tables);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();