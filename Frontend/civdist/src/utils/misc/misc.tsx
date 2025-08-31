import { Dispatch, RefObject, SetStateAction } from "react";

export function getTextWidth(text: string, font: string): number | undefined
{
    let canvas = document.createElement('canvas');

    const context = canvas?.getContext('2d');
    if (canvas && context)
    {
        context.font = font;
        const size = context.measureText(text);

        canvas.remove();

        return size.width;
    }

    canvas.remove();

    return undefined;
}

export function easySetTimeout<T>(setter: Dispatch<SetStateAction<T>>, timeoutRef: RefObject<NodeJS.Timeout | null>, setterValue: T, setterDefaultValue: T, timeoutMS: number)
{
    setter(setterValue);
                    
    if (timeoutRef.current)
        clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => 
    { 
        setter(setterDefaultValue);
        timeoutRef.current = null;
    }, timeoutMS)
}