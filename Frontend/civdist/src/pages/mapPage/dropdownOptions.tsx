import { JSX } from "react";
import { OptionsGenericString, OptionsWithImage, OptionsWithSpecialText, OptionalVisualOptions } from "../../types/selectionTypes";
import { TileDistricts, TileUniqueDistricts, TileYields, VictoryType } from "../../types/civTypes";
import { getAllPossibleDistricts, getAllPossibleVictoryTypes, getAllPossibleYields } from "../../utils/constants";
import { getTextWidth } from "../../utils/misc/misc";
import { nearbyCityFontSize, optionalVisualFontSize } from "./mapPageSelectStyles";
import { Civilization } from "../../civilization/civilizations";

export function getSelectionYields(areImagesLoaded: boolean, dropdownYieldImagesCache: Map<TileYields, HTMLImageElement>)
{
    const allYields = getAllPossibleYields();
    const tempArr: OptionsWithImage[] = [];

    if (areImagesLoaded)
    {
        for (let i = 0; i < allYields.length; i++)
        {
            const currYield = allYields[i];
            const currImage = dropdownYieldImagesCache.get(currYield);
            if (currImage)
                tempArr.push({value: currYield, label: currYield, image: currImage});
        }
    }

    return tempArr;
}

export function formatSelectionYields(option: OptionsWithImage): JSX.Element
{
    return <div style={{display: 'flex'}}>
        <img src={option.image.src} width={20} height={20} alt='' style={{paddingRight: '10px'}}/>
        <span style={{color: 'black'}}>{option.label}</span>
    </div>
}

export function getNearbyCityOptions(uniqueCities: Map<string, string[]>, dropdownCity: string | null)
{
    const tempArr: OptionsWithSpecialText[] = [];

    uniqueCities.forEach((cities, civ) => 
    {
        cities.forEach((city) => 
        {
            if (!dropdownCity || (dropdownCity && city !== dropdownCity))
                tempArr.push({value: `${civ},${city}`, label: <div> <span>{city}</span> <br/> <span>({civ})</span> </div>, text: `${city} (${civ})`});
        })
    })

    return tempArr;
}

export function getCivilizationOptions(uniqueCivilizations: Set<string>, includeCityStates: boolean)
{
    const tempArr: OptionsGenericString[] = [];

    uniqueCivilizations.forEach((civ) => 
    {
        if (includeCityStates || (!includeCityStates && !civ.includes("city-state")))
        {
            tempArr.push({value: civ, label: civ});
        }
    })

    return tempArr;
}

export function getCityOptions(uniqueCities: Map<string, string[]>, dropdownCiv: string | null)
{
    const tempArr: OptionsGenericString[] = [];
    if (dropdownCiv)
    {
        const cityList = uniqueCities.get(dropdownCiv);

        if (cityList)
        {
            for (let i = 0; i < cityList.length; i++)
            {
                const theCity = cityList[i];
                tempArr.push({value: theCity, label: theCity});
            }
        }
    }

    return tempArr;
}

export function getDistrictOptions(areImagesLoaded: boolean, civObj: Civilization | null, dropdownDistrictCache: Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>)
{
    const allDistricts = getAllPossibleDistricts(civObj);
    const tempArr: OptionsWithImage[] = [];

    if (areImagesLoaded)
    {
        for (let i = 0; i < allDistricts.length; i++)
        {
            const currDistrict = allDistricts[i];
            const currImage = dropdownDistrictCache.get(currDistrict);
            if (currImage)
                tempArr.push({value: currDistrict, label: currDistrict, image: currImage});
        }
    }

    return tempArr;
}

export function formatDistrictOptions(option: OptionsWithImage): JSX.Element
{
    return <div style={{display: 'flex'}}>
        <img src={option.image.src} width={30} height={30} alt='' style={{paddingRight: '10px'}}/>
        <span style={{color: 'black'}}>{option.label}</span>
    </div>
}

export function getVictoryTypeOptions(areImagesLoaded: boolean, dropdownVictoryCache: Map<VictoryType, HTMLImageElement>)
{
    const allVictory = getAllPossibleVictoryTypes();
    const tempArr: OptionsWithImage[] = [];

    if (areImagesLoaded)
    {
        for (let i = 0; i < allVictory.length; i++)
        {
            const currVict = allVictory[i];
            const currImage = dropdownVictoryCache.get(currVict);
            if (currImage)
                tempArr.push({value: currVict, label: currVict, image: currImage});
        }
    }

    return tempArr;
}

export function formatVictoryOptions(option: OptionsWithImage): JSX.Element
{
    return <div style={{display: 'flex'}}>
        <img src={option.image.src} width={40} height={40} alt='' style={{paddingRight: '10px'}}/>
        <span style={{color: 'black'}}>{option.label}</span>
    </div>
}

export function getNearbyCityTextMaxWidth(nearbyCityOptions: OptionsWithSpecialText[])
{
    let max = 0;
    if (nearbyCityOptions.length > 0)
    {
        nearbyCityOptions.forEach((vals) => 
        {
            const width = getTextWidth(vals.text, `${nearbyCityFontSize}px arial`);
            if (width)
                max = Math.max(width);
        })
    }
    else
    {
        const theString = 'Select a nearby city';
        const width = getTextWidth(theString, `${nearbyCityFontSize}px arial`);
        if (width)
            max = Math.max(width);
    }

    return max;
}

export function getOptionalVisualMaxWidth()
{
    let max = 0;
    const opts = getOptionalVisualOptions();
    
    if (opts.length > 0)
    {
        opts.forEach((vals) => 
        {
            if (vals.value)
            {
                const width = getTextWidth(vals.value, `${optionalVisualFontSize}px arial`);
                if (width)
                    max = Math.max(width);
            }
        })
    }
    else
    {
        const theString = 'Select an optional visual';
        const width = getTextWidth(theString, `${optionalVisualFontSize}px arial`);
        if (width)
            max = Math.max(width);
    }

    return max;
}

export function getOptionalVisualOptions() 
{
    const tempArr: OptionsGenericString[] = [];

    for (const visuals of Object.values(OptionalVisualOptions))
    {
        tempArr.push({label: visuals, value: visuals});
    }

    return tempArr;
}