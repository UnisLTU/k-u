import { useEffect, useRef, useState, type DragEvent } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../src/firebase.js";
import { v4 } from "uuid";
import "../components/GalleryUploader.css";

type PendingItem = {
  id: string;
  key: string;
  file: File;
  preview: string;
  kind: "image" | "video";
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

export default function GalleryUploader() {
  // Files selected but not yet uploaded
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs when items are removed or component unmounts
  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, [pending]);

  const addFiles = (filesLike: FileList) => {
    const files = Array.from(filesLike || []);
    if (!files.length) return;

    const makeKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
    const isSupported = (f: File) =>
      f.type.startsWith("image/") || f.type.startsWith("video/");

    setPending((prev: PendingItem[]) => {
      const existing = new Set(prev.map((p) => p.key));
      const additions = files
        .filter((f) => isSupported(f) && !existing.has(makeKey(f)))
        .map((file) => ({
          id: v4(),
          key: makeKey(file),
          file,
          preview: URL.createObjectURL(file),
          kind: file.type.startsWith("video/")
            ? "video"
            : ("image" as "video" | "image"),
          progress: 0,
          status: "queued" as const,
        }));
      return [...prev, ...additions];
    });
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearPending = () => {
    pending.forEach((p) => URL.revokeObjectURL(p.preview));
    setPending([]);
  };

  const uploadFiles = async () => {
    if (!pending.length) return;
    setIsUploading(true);

    let successCount = 0;

    const tasks = pending
      .filter((p) => p.status === "queued" || p.status === "error")
      .map(
        (item) =>
          new Promise((resolve) => {
            // Choose folder based on file type
            const folder = item.kind === "video" ? "videos" : "images";
            const objectRef = ref(
              storage,
              `${folder}/${v4()}-${item.file.name}`
            );
            const task = uploadBytesResumable(objectRef, item.file);

            setPending((prev) =>
              prev.map((p) =>
                p.id === item.id
                  ? { ...p, status: "uploading", progress: 0 }
                  : p
              )
            );

            task.on(
              "state_changed",
              (snap) => {
                const pct = Math.round(
                  (snap.bytesTransferred / snap.totalBytes) * 100
                );
                setPending((prev) =>
                  prev.map((p) =>
                    p.id === item.id ? { ...p, progress: pct } : p
                  )
                );
              },
              (err) => {
                setPending((prev) =>
                  prev.map((p) =>
                    p.id === item.id
                      ? { ...p, status: "error", error: err.message }
                      : p
                  )
                );
                resolve(false);
              },
              () => {
                successCount += 1;
                setPending((prev) =>
                  prev.map((p) =>
                    p.id === item.id
                      ? { ...p, status: "done", progress: 100 }
                      : p
                  )
                );
                // Short delay to show the completed bar, then remove from list
                setTimeout(() => removePending(item.id), 400);
                resolve(true);
              }
            );
          })
      );

    await Promise.all(tasks);

    if (successCount > 0) {
      setToast(
        `Uploaded ${successCount} file${successCount === 1 ? "" : "s"}.`
      );
      setTimeout(() => setToast(""), 2500);
    }

    setIsUploading(false);
  };

  // Drag & drop handlers
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer) {
      addFiles(e.dataTransfer.files);
    }
  };
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="gu-container">
      <div
        className={`gu-dropzone ${isDragging ? "dragging" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        aria-label="Upload files"
      >
        <div className="gu-dropzone-inner">
          <p className="gu-drop-title">
            Įkelti nuotraukas ar vaizdo įrašus galite čia
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Įkelti
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="gu-file-input"
            onChange={(e) => {
              if (e.target.files) {
                addFiles(e.target.files);
              }
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="gu-actions">
        {!!pending.length && (
          <button
            onClick={uploadFiles}
            disabled={!pending.length || isUploading}
            className="btn btn-primary"
          >
            {isUploading ? (
              <>
                <span className="spinner" aria-hidden /> Įkeliama…
              </>
            ) : pending.length ? (
              <>
                Įkelti {pending.length} fail{pending.length === 1 ? "ą" : "us"}
              </>
            ) : (
              <>Pasirinkite failus</>
            )}
          </button>
        )}

        {!!pending.length && (
          <button
            onClick={clearPending}
            disabled={isUploading}
            className="btn btn-outline"
          >
            Išvalyti
          </button>
        )}
      </div>

      {/* Pending previews */}
      {pending.length > 0 && (
        <div className="gu-grid">
          {pending.map((p) => (
            <div
              className={`gu-card ${p.status === "error" ? "error" : ""}`}
              key={p.id}
            >
              {p.kind === "image" ? (
                <img src={p.preview} alt={p.file.name} className="gu-img" />
              ) : (
                <video
                  src={p.preview}
                  className="gu-img"
                  controls
                  muted
                  playsInline
                  preload="metadata"
                />
              )}

              {/* Remove */}
              <button
                type="button"
                title="Remove"
                onClick={() => removePending(p.id)}
                className="gu-remove"
                aria-label={`Remove ${p.file.name}`}
              >
                ×
              </button>

              {/* Filename + kind */}
              <div className="gu-filename" title={p.file.name}>
                {p.file.name} {p.kind === "video" ? "• Video" : "• Image"}
              </div>

              {/* Progress bar */}
              {p.status !== "queued" && (
                <div className="gu-progress">
                  <div
                    className={`gu-progress-bar ${p.status}`}
                    style={{ width: `${p.progress || 0}%` }}
                  />
                </div>
              )}

              {/* Status corner */}
              <div className="gu-status" aria-live="polite">
                {p.status === "uploading" && (
                  <span className="spinner small" aria-label="Uploading" />
                )}
                {p.status === "done" && (
                  <span className="ok" aria-label="Uploaded">
                    ✓
                  </span>
                )}
                {p.status === "error" && (
                  <span className="err" aria-label="Error">
                    !
                  </span>
                )}
              </div>

              {p.status === "error" && p.error && (
                <div className="gu-error">{p.error}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="gu-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
