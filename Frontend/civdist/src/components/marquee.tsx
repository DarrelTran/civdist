import React, {JSX, useEffect, useRef, useState} from 'react';

/** A CSS color */
type StaticColor = string & { __brand: "StaticColor" }; // quick way to make hover not collapse to just string
/** [0] = R, [1] = G, [2] = B. */
type RGBColor = readonly [string, string, string];
/** RGB range. [0] = min. [1] = max. */
type RandomNumber = readonly [number, number];

function isStaticColor(value: unknown): value is StaticColor 
{
    return typeof value === "string";
}

// to enforce StaticColor type or will be changed to string if passing string notation like 'myString'
function makeStaticColor(c: string): StaticColor 
{
    return c as StaticColor;
}

function isRGBColor(value: unknown): value is RGBColor 
{
    return (
        Array.isArray(value) &&
        value.length === 3 &&
        value.every(v => typeof v === "string")
    );
}

function isRandomNumber(value: unknown): value is RandomNumber 
{
    return (
        Array.isArray(value) &&
        value.length === 2 &&
        value.every(v => typeof v === "number")
    );
}

function randomColorValue(min: number, max: number)
{
    let newMax = max > 256 ? 256 : max;

    return Math.floor(Math.random() * (newMax - min) + min);
}

interface MarqueeType
{
    text: string;
    animTimeMS: number;
    animTimeDelayMS: number;
    /** A CSS color */
    textDefaultColor: string;
    /** 'css color' | [r, g, b] | [min, max] */
    textMovingColor: StaticColor | RGBColor | RandomNumber
    children?: React.ReactNode;
    topDivClassName?: string;
    topDivStyle?: React.CSSProperties;
    textClassName?: string;
}

const Marquee: React.FC<MarqueeType> = ({text, animTimeMS, animTimeDelayMS, textDefaultColor, textMovingColor, children, topDivClassName, topDivStyle, textClassName}): JSX.Element =>
{
    const characters = useRef<string[]>(text.split(''));
    const [colorIndices, setColorIndices] = useState<number[]>([]);
    const [textColor, setTextColor] = useState<string>(textDefaultColor);

    useEffect(() => 
    {
        createTextAnim();

        const totalTime = characters.current.length * animTimeDelayMS + animTimeMS; // restart anim after last char done - totalTime represents last character
        setInterval(() => 
        {
            createTextAnim();
        }, totalTime)
    }, [])

    function getTextColor(): string
    {
        if (isStaticColor(textMovingColor))
            return makeStaticColor(textMovingColor);
        else if (isRGBColor(textMovingColor))
            return `rgb(${textMovingColor[0]}, ${textMovingColor[1]}, ${textMovingColor[2]})` 
        else if (isRandomNumber(textMovingColor))
        {
            const min = textMovingColor[0];
            const max = textMovingColor[1];

            return `rgb(${randomColorValue(min, max)}, ${randomColorValue(min, max)}, ${randomColorValue(min, max)})`
        }

        return textDefaultColor;
    }

    return (
        <div className={topDivClassName} style={topDivStyle}>
            {characters.current.map((char, index) => 
                (
                    <span
                        key={index}
                        style=
                        {
                            { 
                                transition: `color ${animTimeMS / 1000}s`, 

                                color: colorIndices.includes(index) ? 
                                textColor : 
                                textDefaultColor 
                            }
                        }
                        className={textClassName}
                    >
                        {char}
                    </span>
                ))
            }
            {children}
        </div>
    )

    function createTextAnim()
    {
        setColorIndices([]);

        setTextColor(getTextColor());

        characters.current.forEach((_, index) => 
        {
            setTimeout(() => 
            {
                setColorIndices(prev => [...prev, index]);
                
                setTimeout(() => 
                {
                    setColorIndices(prev => prev.filter(i => (i !== index))); // if index is not being added, it must have already finished so remove it
                }, animTimeMS) // ms
            }, animTimeDelayMS * index) // ms
        })
    }
}

export default Marquee;