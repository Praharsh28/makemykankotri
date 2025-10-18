/**
 * MyTemplateCard Component
 * Template card with edit/delete/duplicate actions
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import { useState } from 'react';
import { Template } from '@/core/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface MyTemplateCardProps {
  template: Template;
  onDelete?: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
}

export function MyTemplateCard({
  template,
  onDelete,
  onDuplicate,
}: MyTemplateCardProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleEdit() {
    router.push(`/editor/${template.id}`);
  }

  function handleDelete() {
    if (onDelete) {
      onDelete(template);
    }
    setShowDeleteConfirm(false);
  }

  function handleDuplicate() {
    if (onDuplicate) {
      onDuplicate(template);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-[3/4] bg-neutral-100 relative group">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-neutral-400">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">No thumbnail</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${
                template.published
                  ? 'bg-green-100 text-green-800'
                  : 'bg-neutral-200 text-neutral-700'
              }
            `}
          >
            {template.published ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="
              p-2 bg-white rounded-lg shadow-md
              hover:bg-neutral-50 transition-colors
            "
          >
            <svg
              className="w-5 h-5 text-neutral-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showActions && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 w-48 z-10">
              <button
                onClick={handleEdit}
                className="
                  w-full px-4 py-2 text-left text-sm
                  hover:bg-neutral-50 transition-colors
                  flex items-center gap-2
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDuplicate}
                className="
                  w-full px-4 py-2 text-left text-sm
                  hover:bg-neutral-50 transition-colors
                  flex items-center gap-2
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
              </button>
              <hr className="my-2" />
              <button
                onClick={() => {
                  setShowActions(false);
                  setShowDeleteConfirm(true);
                }}
                className="
                  w-full px-4 py-2 text-left text-sm
                  hover:bg-red-50 text-red-600
                  transition-colors
                  flex items-center gap-2
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-1">
          {template.name}
        </h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {template.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {template.views}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(template.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4">
            <h3 className="font-heading text-xl font-bold text-neutral-900 mb-2">
              Delete Template?
            </h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete <strong>{template.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="
                  flex-1 px-4 py-2 rounded-lg font-medium
                  border border-neutral-300 text-neutral-700
                  hover:bg-neutral-50 transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="
                  flex-1 px-4 py-2 rounded-lg font-medium
                  bg-red-600 text-white
                  hover:bg-red-700 transition-colors
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
