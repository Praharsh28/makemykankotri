/**
 * Admin Editor Page
 * Edit templates with Puck visual editor
 * Route: /admin/editor/[id]
 */

'use client';

import React, { use } from 'react';
import { EditorPage } from '@/plugins/visual-editor/EditorPage';

export default function AdminEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Unwrap params Promise (Next.js 15 requirement)
  const { id } = use(params);
  
  return <EditorPage templateId={id} />;
}
