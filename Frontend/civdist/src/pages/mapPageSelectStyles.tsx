import {JSX} from 'react'
import { CSSObjectWithLabel, StylesConfig } from "react-select";
import { TileYields } from "../utils/types";

type YieldOption = 
{
  value: TileYields;
  label: TileYields;
  image: HTMLImageElement;
};

export const mapPageSelectStyle: StylesConfig<YieldOption, true> = 
{
    control: (baseStyles: CSSObjectWithLabel, state) => 
    ({
        ...baseStyles,
        backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
        ':hover': 
        {
            backgroundColor: '#d0d0d7'
        }
    }),
    menu: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        marginTop: 0,
        backgroundColor: '#edf1f2'
    }),
    dropdownIndicator: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        color: '#020202',
        ':hover': 
        {
            color: '#020202'
        }
    }),
    clearIndicator: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        color: 'firebrick',
        ':hover': 
        {
            color: 'red'
        }
    }),
    multiValueLabel: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        backgroundColor: 'darkgrey',
        color: 'black'
    }),
    option: (baseStyles: CSSObjectWithLabel, state) => 
    ({
        ...baseStyles,
        backgroundColor: state.isSelected ? '#edf1f2': '#edf1f2',
        ':hover': 
        {
            backgroundColor: '#cfd4d6'
        }
    }),
    multiValueRemove: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        backgroundColor: 'grey'
    }),
}

type NearbyCityOption = 
{
  value: string;
  label: JSX.Element;
};

export const nearbyCityFontSize = 16;

export const nearbyCityStyles = (theWidth: number): StylesConfig<NearbyCityOption, true> => 
{
    return {
        control: (baseStyles: CSSObjectWithLabel, state) => 
        ({
            ...baseStyles,
            backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
            ':hover': 
            {
                backgroundColor: '#d0d0d7'
            },
            width: `${theWidth}px`,
            fontSize: `${nearbyCityFontSize}px`
        }),
        menu: (baseStyles: CSSObjectWithLabel) => 
        ({
            ...baseStyles,
            marginTop: 0,
            backgroundColor: '#edf1f2'    
        }),
        dropdownIndicator: (baseStyles: CSSObjectWithLabel) => 
        ({
            ...baseStyles,
            color: '#020202',
            ':hover': 
            {
                color: '#020202'
            }
        }),
        clearIndicator: (baseStyles: CSSObjectWithLabel) => 
        ({
            ...baseStyles,
            color: 'firebrick',
            ':hover': 
            {
                color: 'red'
            }
        }),
        option: (baseStyles: CSSObjectWithLabel, state) => 
        ({
            ...baseStyles,
            backgroundColor: state.isSelected ? '#edf1f2': '#edf1f2',
            ':hover': 
            {
                backgroundColor: '#cfd4d6'
            },
            color: 'black',
            fontSize: `${nearbyCityFontSize}px`,
            width: `${theWidth}px`
        })
    }
}