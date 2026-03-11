/**
 * DATABASE ROUTER - Separates Demo and Production Databases
 * 
 * This module provides intelligent routing between demo and production databases.
 * 
 * DEMO DATABASE:
 * - Used for all demo accounts (predefined test accounts)
 * - Data stored in localStorage
 * - No real Supabase connection needed
 * - Accounts: child, teen, adult, parent, admin demo accounts
 * 
 * PRODUCTION DATABASE:
 * - Used for all newly registered accounts
 * - Data stored in Supabase (real database)
 * - Requires authentication
 * - Accounts: All new Health Officers, Adults, Children, Parents
 */

import { supabase } from './client';
import { User } from '@/types/emec';
import { allDemoUsers } from '@/data/demoUsers';

/**
 * Determines if a user is a demo account
 * Demo accounts are identified by their predefined EMEC IDs
 */
export function isDemoUser(user: User | null): boolean {
  if (!user) return false;
  
  // Check if user's EMEC ID matches any demo account
  const demoEmecIds = allDemoUsers.map(u => u.emecId.toUpperCase());
  return demoEmecIds.includes(user.emecId.toUpperCase());
}

/**
 * Determines if an EMEC ID belongs to a demo account
 */
export function isDemoEmecId(emecId: string): boolean {
  const demoEmecIds = allDemoUsers.map(u => u.emecId.toUpperCase());
  return demoEmecIds.includes(emecId.toUpperCase());
}

/**
 * Gets the appropriate database client based on user type
 * 
 * @param user - Current user object
 * @returns Database client (Supabase for production, null for demo)
 */
export function getDatabaseClient(user: User | null) {
  // DEMO DATABASE ROUTING: Demo users don't use Supabase
  if (isDemoUser(user)) {
    return null; // Demo users use localStorage
  }
  
  // PRODUCTION DATABASE ROUTING: Real users use Supabase
  return supabase;
}

/**
 * Database operation wrapper that routes to correct database
 * 
 * Usage:
 * const result = await dbOperation(currentUser, async (client) => {
 *   if (!client) return demoData; // Handle demo case
 *   return await client.from('table').select();
 * });
 */
export async function dbOperation<T>(
  user: User | null,
  operation: (client: typeof supabase | null) => Promise<T>
): Promise<T> {
  const client = getDatabaseClient(user);
  return await operation(client);
}

/**
 * Storage key generator for demo data
 * Demo data is stored in localStorage with prefixed keys
 */
export function getDemoStorageKey(user: User, dataType: string): string {
  return `demo_${user.emecId}_${dataType}`;
}

/**
 * Check if current session is using production database
 */
export async function isProductionSession(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Get user type label for debugging/logging
 */
export function getUserDatabaseType(user: User | null): 'demo' | 'production' | 'none' {
  if (!user) return 'none';
  return isDemoUser(user) ? 'demo' : 'production';
}
