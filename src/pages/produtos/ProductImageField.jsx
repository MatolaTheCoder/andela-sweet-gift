import React, { useRef, useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { fileToDataUrl } from '../../lib/image';

/**
 * Escolha da foto do produto, por seleção ou arrastando o ficheiro.
 * A imagem é reduzida antes de ser entregue em `onChange` (data URL).
 */
export default function ProductImageField({ value, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch (readError) {
      setError(readError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <p className="label">Foto do produto</p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-4 rounded-lg border-2 border-dashed p-3 ${
          dragging ? 'border-purple-700 bg-purple-50' : 'border-control'
        }`}
      >
        {value ? (
          <img src={value} alt="Foto escolhida" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-3xl text-neutral-600">
            <HiOutlinePhotograph aria-hidden="true" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm text-neutral-700">
            {busy ? 'A preparar a imagem...' : value ? 'Foto adicionada.' : 'Arraste uma imagem ou escolha um ficheiro.'}
          </p>
          <div className="mt-1 flex flex-wrap items-center">
            <button type="button" className="link-action" onClick={() => inputRef.current?.click()} disabled={busy}>
              {value ? 'Trocar foto' : 'Escolher foto'}
            </button>
            {value && (
              <>
                <span className="mx-3 h-4 w-px bg-neutral-300" aria-hidden="true" />
                <button type="button" className="link-action link-action-danger" onClick={() => onChange('')}>
                  Remover
                </button>
              </>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          aria-label="Escolher foto do produto"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
      <p className="mt-1.5 text-sm text-neutral-600">JPG, PNG, WebP ou GIF até 8 MB. É reduzida automaticamente.</p>
    </div>
  );
}
