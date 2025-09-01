import React, {JSX} from 'react';
import styles from './overlay.module.css'

interface OverlayType
{
    text: string;
    textStyle?: React.CSSProperties;
    children?: React.ReactNode;
    textClassName?: string;
    overlayStyle?: React.CSSProperties;
    overlayClassName?: string;
}

const Overlay: React.FC<OverlayType> = ({text, textStyle, textClassName, overlayStyle, overlayClassName, children}): JSX.Element =>
{
    return (
        <div className={`${overlayClassName} ${styles.overlay}`} style={overlayStyle}>
            {children}
            <span className={textClassName ?? ''} style={textStyle}>{text}</span>
        </div>
    )
}

export default Overlay;