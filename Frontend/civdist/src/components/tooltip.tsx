import React, {JSX} from 'react';
import './tooltip.css'

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
        <div className='tooltip'>
            {children}
            <span className={`${className ?? ''} tooltiptext`} style={style}>{text}</span>
        </div>
    )
}

export default Tooltip;