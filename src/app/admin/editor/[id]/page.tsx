/**
 * Admin Editor Page
 * Edit templates with Puck visual editor
 * Route: /admin/editor/[id]
 */

'use client';

import React from 'react';
import { EditorPage } from '@/plugins/visual-editor/EditorPage';

export default function AdminEditorPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <EditorPage templateId={params.id} />;
}
