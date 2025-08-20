import React, {forwardRef, JSX} from 'react';
import './tooltip.css'

interface TooltipType
{
    text: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const Tooltip = forwardRef<HTMLSpanElement, TooltipType>(({text, style, children}, ref) => 
{
    return (
        <div className='tooltip'>
            {children}
            <span ref={ref} className="tooltiptext" style={style}>{text}</span>
        </div>
    )
})

export default Tooltip;