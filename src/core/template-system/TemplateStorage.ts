/**
 * Template Storage - Supabase CRUD operations
 * Save, load, update, delete templates
 */

import { supabase } from './supabase';
import { Template } from '../types';
import { eventBus, EVENT_NAMES } from '../event-bus';

export class TemplateStorage {
  /**
   * Save template (insert or update)
   */
  async save(template: Template): Promise<Template> {
    // Attempt to set ownership when session is available
    const { data: sessionData } = await supabase.auth.getSession();
    const ownerId = sessionData?.session?.user?.id ?? null;

    const { data, error } = await supabase
      .from('templates')
      .upsert({
        id: template.id,
        name: template.name,
        slug: template.slug,
        elements: template.elements,
        editable_fields: template.editableFields,
        layout: template.layout,
        global_animations: template.globalAnimations,
        thumbnail: template.thumbnail,
        category: template.category,
        tags: template.tags,
        description: template.description,
        published: template.published,
        version: template.version,
        created_by: ownerId, // null in dev (anon) or session.user.id when available
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to save template: ${error.message}`);
    }

    eventBus.emit(EVENT_NAMES.EDITOR_TEMPLATE_SAVED, {
      templateId: template.id,
      template: data,
    });

    return this.mapToTemplate(data);
  }

  /**
   * Load template by ID
   */
  async load(id: string): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading template:', error);
      throw new Error(`Failed to load template: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Template not found: ${id}`);
    }

    const template = this.mapToTemplate(data);

    eventBus.emit(EVENT_NAMES.EDITOR_TEMPLATE_LOADED, {
      template,
    });

    return template;
  }

  /**
   * Load template by slug
   */
  async loadBySlug(slug: string): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error loading template by slug:', error);
      throw new Error(`Failed to load template: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Template not found: ${slug}`);
    }

    return this.mapToTemplate(data);
  }

  /**
   * List all templates
   */
  async list(options?: {
    published?: boolean;
    category?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<Template[]> {
    let query = supabase.from('templates').select('*');

    // Apply filters
    if (options?.published !== undefined) {
      query = query.eq('published', options.published);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.createdBy) {
      query = query.eq('created_by', options.createdBy);
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by updated_at desc
    query = query.order('updated_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error listing templates:', error);
      throw new Error(`Failed to list templates: ${error.message}`);
    }

    return data.map((item) => this.mapToTemplate(item));
  }

  /**
   * Get user's templates
   */
  async getUserTemplates(userId: string): Promise<Template[]> {
    return this.list({ createdBy: userId });
  }

  /**
   * Delete template
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('templates').delete().eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      throw new Error(`Failed to delete template: ${error.message}`);
    }

    eventBus.emit('template:deleted', { templateId: id });
  }

  /**
   * Publish template
   */
  async publish(id: string): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update({
        published: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error publishing template:', error);
      throw new Error(`Failed to publish template: ${error.message}`);
    }

    eventBus.emit(EVENT_NAMES.TEMPLATE_PUBLISHED, {
      templateId: id,
    });

    return this.mapToTemplate(data);
  }

  /**
   * Unpublish template
   */
  async unpublish(id: string): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update({
        published: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error unpublishing template:', error);
      throw new Error(`Failed to unpublish template: ${error.message}`);
    }

    return this.mapToTemplate(data);
  }

  /**
   * Increment template views
   */
  async incrementViews(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_template_views', {
      template_id: id,
    });

    if (error) {
      console.error('Error incrementing views:', error);
    }
  }

  /**
   * Increment template uses
   */
  async incrementUses(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_template_uses', {
      template_id: id,
    });

    if (error) {
      console.error('Error incrementing uses:', error);
    }
  }

  /**
   * Map database row to Template type
   */
  private mapToTemplate(data: unknown): Template {
    const row = data as Record<string, unknown>;

    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      elements: row.elements as Template['elements'],
      editableFields: row.editable_fields as string[],
      layout: row.layout as Template['layout'],
      globalAnimations: (row.global_animations as Template['globalAnimations']) || [],
      thumbnail: (row.thumbnail as string) || '',
      category: (row.category as string) || '',
      tags: (row.tags as string[]) || [],
      description: (row.description as string) || '',
      createdBy: row.created_by as string,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
      version: (row.version as number) || 1,
      published: (row.published as boolean) || false,
      views: (row.views as number) || 0,
      uses: (row.uses as number) || 0,
    };
  }
}

// Singleton instance
export const templateStorage = new TemplateStorage();
