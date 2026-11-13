/** Tratamento das fotos de produto: valida, reduz e converte para data URL. */
const ACCEPTED = /^image\/(jpeg|png|webp|gif)$/;
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Lê uma imagem escolhida pelo utilizador e devolve um JPEG reduzido (data URL).
 * A redução é necessária porque as fotos ficam guardadas no navegador, que tem
 * pouco espaço; 640 px chega para cartões e miniaturas.
 */
export async function fileToDataUrl(file, { maxSize = 640, quality = 0.82 } = {}) {
  if (!ACCEPTED.test(file.type)) {
    throw new Error('Escolha uma imagem JPG, PNG, WebP ou GIF.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('A imagem é demasiado grande (máximo 8 MB).');
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
      element.src = url;
    });

    const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    const context = canvas.getContext('2d');
    // Fundo branco: PNG com transparência ficaria preto ao converter para JPEG.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
