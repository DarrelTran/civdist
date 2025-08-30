import { useState, useRef, useCallback } from 'react';

type MessageType = 'error' | 'success' | 'info';

interface Message 
{
    type: MessageType;
    text: string;
}

/**
 * 
 * @param duration In milliseconds. Default is 4000 ms.
 * @returns 
 */
export function useMessage(duration: number = 4000) 
{
    const [message, setMessage] = useState<Message | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showMessage = useCallback((type: MessageType, text: string) => 
    {
        // clear existing timeout
        if (timeoutRef.current) 
        {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setMessage({ type, text });

        timeoutRef.current = setTimeout(() => 
        {
            setMessage(null);
            timeoutRef.current = null;
        }, duration);
    }, [duration]);

    const showError = useCallback((text: string) => showMessage('error', text), [showMessage]);
    const showSuccess = useCallback((text: string) => showMessage('success', text), [showMessage]);
    const showInfo = useCallback((text: string) => showMessage('info', text), [showMessage]);

    return {
        message,
        showError,
        showSuccess,
        showInfo,
    };
}
