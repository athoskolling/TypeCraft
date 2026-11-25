import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, X, Check } from 'lucide-react';
import {
  normalizeProgress,
  type UserProgressState,
} from '../state/progressStore';

interface ProgressModalProps {
  open: boolean;
  onClose: () => void;
  progress: UserProgressState;
  onImportProgress: (next: UserProgressState) => void;
  onResetAllProgress: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  open,
  onClose,
  progress,
  onImportProgress,
  onResetAllProgress,
}) => {
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleExportDownload = () => {
    const json = JSON.stringify(progress, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typecraft-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Progress exported as JSON file.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const raw = JSON.parse(text) as Partial<UserProgressState>;
      const normalized = normalizeProgress(raw);
      onImportProgress(normalized);
      setStatusMsg(
        `Imported ${normalized.completedChallengeIds.length} solved challenges, ${normalized.completedMiniProjectIds.length} mini-projects, and ${normalized.passedExamIds.length} exams.`
      );
    } catch {
      setStatusMsg('Invalid JSON file. Please select a valid TypeCraft export.');
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="progress-modal"
        id="progress-data-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Progress & Local Data</h3>
          <button
            type="button"
            id="close-progress-modal-btn"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="modal-desc">
          TypeCraft Academy runs 100% in your browser with zero backend or telemetry. Your progress and
          saved solutions are persisted in <code>localStorage</code>.
        </p>

        <div className="progress-actions-grid">
          <button
            type="button"
            id="export-progress-json-btn"
            className="zed-btn zed-btn-primary"
            onClick={handleExportDownload}
          >
            <Download size={15} />
            <span>Export Backup JSON</span>
          </button>

          <button
            type="button"
            id="import-progress-json-btn"
            className="zed-btn zed-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} />
            <span>Import Backup JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>

        {statusMsg && (
          <div className="status-banner">
            <Check size={14} />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="danger-zone">
          <div>
            <strong>Reset All Progress</strong>
            <p>Clears solved badges, Tested-Out flags, and saved editor code.</p>
          </div>
          {!confirmReset ? (
            <button
              type="button"
              id="reset-progress-trigger-btn"
              className="zed-btn zed-btn-danger"
              onClick={() => setConfirmReset(true)}
            >
              <Trash2 size={14} />
              <span>Reset</span>
            </button>
          ) : (
            <div className="confirm-row">
              <button
                type="button"
                id="confirm-reset-progress-btn"
                className="zed-btn zed-btn-danger"
                onClick={() => {
                  onResetAllProgress();
                  setConfirmReset(false);
                  setStatusMsg('All progress has been reset.');
                }}
              >
                Confirm Wipe
              </button>
              <button
                type="button"
                className="zed-btn zed-btn-secondary"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
