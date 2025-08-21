import React, {use, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './allPages.css'
import './homePage.css' 

const CHAR_ANIM_TIME_MS = 500;
const CHAR_ANIM_DELAY_MS = 100;

const TITLE_TEXT = "Civdist";

const HomePage = () => 
{
    const nav = useNavigate();

    const [characters, setCharacters] = useState<string[]>(TITLE_TEXT.split(''));
    const [colorIndices, setColorIndices] = useState<number[]>([]);
    const [randColor, setRandColor] = useState<number[]>([]);
    
    useEffect(() => 
    {
        createTextAnim();

        const totalTime = characters.length * CHAR_ANIM_DELAY_MS + CHAR_ANIM_TIME_MS; // restart anim after last char done - totalTime represents last character
        setInterval(() => 
        {
            createTextAnim();
        }, totalTime)
    }, [])

    return (
        <div>
            <div className="title">
                {characters.map((char, index) => // () instead of {} means implicit return - no need for return statement
                    (
                        <span
                            key={index}
                            style={{ transition: `color ${CHAR_ANIM_TIME_MS / 1000}s`, color: colorIndices.includes(index) ? `rgb(${randColor[0]}, ${randColor[1]}, ${randColor[2]})` : 'black' }}
                        >
                            {char}
                        </span>
                    ))
                }
            </div>
            <button onClick={() => {nav('/map')}}>NEW MAP</button>
        </div>
    );

    function createTextAnim()
    {
        setColorIndices([]);
        
        // cant modify randColor directly - have to use setRandColor as updates are asynchronous and scheduled for later renders
        const newRandColor = 
        [
            randomColorValue(),
            randomColorValue(),
            randomColorValue()
        ];
        setRandColor(newRandColor);

        characters.forEach((_, index) => 
        {
            setTimeout(() => 
            {
                // prev = existing indices array
                // ...prev = previous elements
                setColorIndices(prev => [...prev, index]);
                
                setTimeout(() => 
                {
                    setColorIndices(prev => prev.filter(i => (i !== index))); // if index is not being added, it must have already finished so remove it
                }, CHAR_ANIM_TIME_MS) // ms
            }, CHAR_ANIM_DELAY_MS * index) // ms
        })
    }

    function randomColorValue()
    {
        return Math.floor(Math.random() * 256);
    }
};

export default HomePage;