import { useEffect, useState } from "react";

export function useIdleTimer(timeoutMS: number) 
{
    const [isIdle, setIsIdle] = useState<boolean>(false);

    useEffect(() => 
    {
        let timer: NodeJS.Timeout;

        const resetTimer = () => 
        {
            clearTimeout(timer);
            setIsIdle(false);
            timer = setTimeout(() => setIsIdle(true), timeoutMS);
        };

        const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // initial timer
        resetTimer();

        return () => 
        {
            clearTimeout(timer);
            events.forEach((event) => 
            {
            window.removeEventListener(event, resetTimer);
            });
        };
    }, [timeoutMS]);

    return isIdle;
}
