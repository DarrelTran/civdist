import React, { JSX, useRef } from 'react';
import styles from './holdDownButton.module.css';

interface HoldDownType 
{
    text: string;
    finishHoldDown: () => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    className?: string;
}

const HoldDownButton: React.FC<HoldDownType> = 
({
    text,
    finishHoldDown,
    style,
    children,
    className
}): JSX.Element => 
{
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cancelledRef = useRef(false);

    const startHold = () => 
    {
        const btn = buttonRef.current;
        if (!btn) return;

        btn.classList.remove(styles.noTransition);
        btn.classList.add(styles.holding); // starts animation to move bar to the right side, activates .holdButton.holding

        cancelledRef.current = false;

        const listener = (e: TransitionEvent) => 
        {
            if (e.propertyName === 'transform' && !cancelledRef.current) 
            {
                btn.classList.add(styles.noTransition); // stops animation
                btn.classList.remove(styles.holding); // stops bar, which moves back to the left
                finishHoldDown();
            }

            btn.removeEventListener('transitionend', listener);
        };

        // only activate finishHoldDown when the transition/animation ends
        btn.addEventListener('transitionend', listener);
    };

    const cancelHold = () => 
    {
        const btn = buttonRef.current;
        if (!btn) return;

        cancelledRef.current = true;
        btn.classList.remove(styles.holding);
    };

    return (
        <div>
            <button
                ref={buttonRef}
                className={`${className ?? ''} ${styles.holdButton}`}
                style={style}
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
            >
                <span>{text}</span>
            </button>
            {children}
        </div>
    );
};

export default HoldDownButton;
