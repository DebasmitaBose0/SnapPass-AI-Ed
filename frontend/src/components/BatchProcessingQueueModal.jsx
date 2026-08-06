import React from 'react';
import './ConfirmModal.css';

export default function BatchProcessingQueueModal({
  isOpen,
  onClose,
  queue = [],
  onClearCompleted,
  onRetry,
  onRemove,
}) {
  if (!isOpen) return null;

  const total = queue.length;
  const completed = queue.filter((i) => i.status === 'completed').length;
  const pending = queue.filter((i) => i.status === 'pending' || i.status === 'processing').length;

  return (
    <div className="confirm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="batch-modal-title">
      <div className="confirm-modal-content max-w-lg w-full">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 id="batch-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            Batch Export Queue ({completed}/{total})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close batch export queue"
          >
            ✕
          </button>
        </div>

        <div className="my-4 max-h-60 overflow-y-auto space-y-3">
          {queue.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No items currently queued for batch export.</p>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : item.status === 'error'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.status === 'processing' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-red-500">{item.error || 'Export failed'}</span>
                    <button
                      onClick={() => onRetry && onRetry(item.id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClearCompleted}
            disabled={completed === 0}
            className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
          >
            Clear Completed
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
