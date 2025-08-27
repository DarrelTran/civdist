import React, {JSX} from 'react';
import styles from './tooltip.module.css'

interface TooltipType
{
    text: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    className?: string;
}

const Tooltip: React.FC<TooltipType> = ({text, style, children, className}): JSX.Element =>
{
    return (
        <div className={styles.tooltip}>
            {children}
            <span className={`${className ?? ''} ${styles.tooltiptext}`} style={style}>{text}</span>
        </div>
    )
}

export default Tooltip;