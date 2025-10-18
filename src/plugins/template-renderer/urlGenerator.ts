/**
 * URL Generator
 * Generate unique slugs and URLs for invitations
 */

import { z } from 'zod';
import type { Template } from '@/core/types';

const InvitationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export interface SaveInvitationResult {
  success: boolean;
  slug?: string;
  url?: string;
  error?: string;
  timestamp: number;
}

/**
 * Generate unique slug from template name
 */
export function generateSlug(name: string): string {
  // Convert to lowercase, remove apostrophes, and replace spaces/special chars with dashes
  let slug = name
    .toLowerCase()
    .replace(/['\u2019]/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .replace(/-+/g, '-'); // Remove consecutive dashes

  // Limit length
  if (slug.length > 50) {
    slug = slug.substring(0, 50).replace(/-+$/, '');
  }

  // Add random suffix for uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  
  return `${slug}-${randomSuffix}`;
}

/**
 * Generate full invitation URL
 */
export function generateInvitationUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  return `${baseUrl}/preview/${slug}`;
}

/**
 * Save invitation and generate URL
 * Note: Database saving will be implemented once Supabase connection is working
 */
export async function saveInvitation(
  template: Template,
  data: Record<string, unknown>
): Promise<SaveInvitationResult> {
  const timestamp = Date.now();

  try {
    // Validate inputs
    const validatedTemplate = InvitationSchema.parse(template);
    
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: 'Invalid data provided',
        timestamp,
      };
    }

    // Generate slug and URL
    const slug = generateSlug(validatedTemplate.name);
    const url = generateInvitationUrl(slug);

    // TODO: Save to database when Supabase is connected
    // const { error } = await supabase.from('invitations').insert({
    //   slug,
    //   template_id: template.id,
    //   data,
    //   created_at: new Date().toISOString()
    // });

    // For now, just return success with mock save
    console.log('[urlGenerator] Generated invitation:', { slug, url });

    return {
      success: true,
      slug,
      url,
      timestamp,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save invitation',
      timestamp,
    };
  }
}
