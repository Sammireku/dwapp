/**
 * Generates an AI childlike animated avatar portrait from an uploaded photo or avatar canvas
 */
export async function generateChildlikeAIAvatar(
  sourceImageSrc: string,
  childName: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 300;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(sourceImageSrc);
        return;
      }

      // Draw rounded background with bedtime cosmic gradient
      const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
      grad.addColorStop(0, '#2e1065');
      grad.addColorStop(0.7, '#1e1b4b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Clip image to circular portrait frame
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 - 10, size / 2 - 40, 0, Math.PI * 2);
      ctx.clip();

      // Draw source image with watercolor/dreamy brightness & saturation boost
      ctx.filter = 'saturate(1.3) contrast(1.1) brightness(1.05)';
      ctx.drawImage(img, 30, 20, size - 60, size - 60);
      ctx.restore();

      // Draw magical golden halo / glowing bedtime aura
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 - 10, size / 2 - 38, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Draw starry sparkles around the portrait
      const drawSparkle = (cx: number, cy: number, r: number) => {
        ctx.save();
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      };

      drawSparkle(45, 45, 5);
      drawSparkle(250, 50, 6);
      drawSparkle(260, 240, 4);
      drawSparkle(40, 230, 5);

      // Add a cute magical crown or starlight badge
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨👑✨', size / 2, 45);

      // Add child name banner at the bottom
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(40, size - 50, size - 80, 34, 12);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillText(`Hero ${childName}`, size / 2, size - 28);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      resolve(sourceImageSrc);
    };
    img.src = sourceImageSrc;
  });
}
