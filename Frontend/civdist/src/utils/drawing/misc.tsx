export function getMousePos(theCanvas: HTMLCanvasElement | null, e: MouseEvent): {x: number, y: number} | undefined
{
    const canvas = theCanvas;

    if (!canvas) 
        return undefined;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height; 

    const x = (e.clientX - rect.left) * scaleX;
    const yCanvasTopDown = (e.clientY - rect.top) * scaleY; // normal y
    const y = canvas.height - yCanvasTopDown; // account for map being flipped

    return { x, y };
}