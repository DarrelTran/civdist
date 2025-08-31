import { JSX } from "react";
import { OptionsGenericString, OptionsWithImage, OptionsWithSpecialText, OptionalVisualOptions } from "../../types/selectionTypes";
import { TileYields } from "../../types/civTypes";
import { getAllPossibleDistricts, getAllPossibleVictoryTypes, getAllPossibleYields } from "../../utils/constants";
import { getTextWidth } from "../../utils/misc/misc";
import { nearbyCityFontSize, optionalVisualFontSize } from "./mapPageSelectStyles";

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
    return <div>
        <img src={option.image.src} width={20} height={20} alt='' style={{paddingRight: '10px'}}/>
        <span>{option.label}</span>
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

export function getDistrictOptions() 
{
    const tempArr: OptionsGenericString[] = [];
    const allDistricts = getAllPossibleDistricts();

    for (let i = 0; i < allDistricts.length; i++)
    {
        const theDistrict = allDistricts[i];
        tempArr.push({value: theDistrict, label: theDistrict});
    }

    return tempArr;
}

export function getVictoryTypeOptions() 
{
    const tempArr: OptionsGenericString[] = [];
    const allVictoryTypes = getAllPossibleVictoryTypes();

    for (let i = 0; i < allVictoryTypes.length; i++)
    {
        const theVictoryType = allVictoryTypes[i];
        tempArr.push({value: theVictoryType, label: theVictoryType});
    }

    return tempArr;
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