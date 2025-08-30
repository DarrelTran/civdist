import React, { JSX, useState, useRef } from 'react';
import { SaveType } from '../../types/serverTypes';
import styles from './saveDropdown.module.css';
import { getTextWidth } from '../../utils/misc/misc';
import Tooltip from '../tooltip/tooltip';

interface SaveDropdownType 
{
    saveList: SaveType[];

    /** block, flex, etc */
    containerDisplayType: string;

    /** In pixels */
    maxSaveTextWidth: number;

    children?: React.ReactNode;

    dropdownButtonStyle?: React.CSSProperties;
    dropdownButtonClassName?: string;

    handleSaveInput: (inputText: string, currID: number) => void;
    handleSaveClick: (currID: number) => void;
    handleLoadClick: (currID: number) => void;

    isLoading: boolean;
    isSaving: boolean;

    containerClassName?: string;

    saveEntryClassName?: string;
    saveEntryStyle?: React.CSSProperties;

    saveTextClassName?: string;

    inputClassName?: string;

    saveButtonClassName?: string;

    loadButtonClassName?: string;

    topmostDivClassName?: string,
    topmostDivStyle?: React.CSSProperties
}

const SAVE_TEXT_FONT_SIZE: number = 16;

const SaveDropdown: React.FC<SaveDropdownType> = 
({
    saveList, 
    dropdownButtonClassName, 
    children, 
    dropdownButtonStyle,
    handleSaveInput,
    handleSaveClick,
    handleLoadClick,
    isLoading,
    isSaving,
    containerClassName,
    containerDisplayType,
    saveEntryClassName,
    saveEntryStyle,
    saveTextClassName,
    inputClassName,
    saveButtonClassName,
    loadButtonClassName,
    topmostDivClassName,
    topmostDivStyle,
    maxSaveTextWidth
}): JSX.Element =>
{
    const [savesDisplay, setSavesDisplay] = useState<string>('none');

    function getSaveText(theSave: SaveType, maxWidth: number): string
    {
        if (theSave.name)
        {
            let font = `${SAVE_TEXT_FONT_SIZE}px arial`;

            const textWidth = getTextWidth(theSave.name, font);

            let tempStr = theSave.name;

            if (textWidth && textWidth > maxWidth)
            {
                let tempStrWidth = getTextWidth(tempStr, font);

                const element = document.createElement('span');
                element.textContent = theSave.name;

                while (tempStrWidth && tempStrWidth > maxWidth)
                {
                    tempStr = tempStr.slice(0, -1);
                    tempStrWidth = getTextWidth(tempStr, font);
                }

                tempStr = tempStr + '...';
            }

            return tempStr;
        }
 
        return '';
    }

    return (
        <div className={`${topmostDivClassName ?? ''}`} style={topmostDivStyle}>
            <button onClick={() => {setSavesDisplay(savesDisplay === 'none' ? containerDisplayType : 'none')}} className={`${dropdownButtonClassName ?? ''}`} style={dropdownButtonStyle}>SAVES</button>
            
            <div className={`${containerClassName ?? ''} ${styles.dropdown}`} style={{display: savesDisplay}}>
                <span style={{display: isLoading ? 'block' : 'none', fontWeight: 'bold'}}>Loading maps... Please wait...</span>
                <span style={{display: isSaving ? 'block' : 'none', fontWeight: 'bold'}}>Saving maps... Please wait...</span>
                <div style={{display: isLoading || isSaving ? 'none' : 'block'}}>
                    {/* Parenthesis wrapped around function make it an expression to remove ambiguity and run the whole function?*/}
                    {(() => 
                        {
                            const savedMaps: JSX.Element[] = [];

                            saveList.forEach((theSave) => 
                            {
                                if (theSave.name && theSave.name.length > 0)
                                {
                                    savedMaps.push
                                    (
                                        <div className={`${saveEntryClassName ?? ''}`} key={theSave.id} style={saveEntryStyle}>
                                            <Tooltip text={theSave.name} style={{width: getTextWidth(theSave.name, `${SAVE_TEXT_FONT_SIZE}px arial`)}}>
                                                <span style={{display: theSave.textNameDisplay, marginRight: '5px', fontSize: `${SAVE_TEXT_FONT_SIZE}px`}} className={`${saveTextClassName ?? ''}`}>{getSaveText(theSave, maxSaveTextWidth)}</span>
                                            </Tooltip>
                                            <input 
                                                type='text' 
                                                style={{marginRight: '5px', display: theSave.textInputDisplay}} 
                                                placeholder='Enter a name for this save.' 
                                                className={`${inputClassName ?? ''}`} 
                                                onChange={e => handleSaveInput(e.target.value, theSave.id)}
                                            />
                                            
                                            <button style={{marginLeft: 'auto', marginRight: '5px'}} onClick={e => handleSaveClick(theSave.id)} className={`${saveButtonClassName ?? ''}`}>SAVE</button>
                                            <button className={`${loadButtonClassName ?? ''}`} onClick={e => handleLoadClick(theSave.id)}>LOAD</button>
                                            <br/>
                                        </div>
                                    );
                                }
                                else
                                {
                                    savedMaps.push
                                    (
                                        <div className={`${saveEntryClassName ?? ''}`} key={theSave.id}>
                                            <input 
                                                type='text' 
                                                style={{marginRight: '5px'}} 
                                                placeholder='Enter a name for this save.' 
                                                className={`${inputClassName ?? ''}`}
                                                onChange={e => handleSaveInput(e.target.value, theSave.id)}
                                            />
                                            <button style={{marginLeft: 'auto'}} onClick={e => handleSaveClick(theSave.id)} className={`${saveButtonClassName ?? ''}`}>SAVE</button>
                                            <br/>
                                        </div>
                                    );
                                }
                            })

                            return savedMaps;
                        }
                    )()}
                </div>
            </div>
            {children}
        </div>
    )
}

export default SaveDropdown