import { CSSObjectWithLabel, StylesConfig } from "react-select";
import { OptionsWithSpecialText, OptionsGenericString, OptionsWithImage } from "../../types/selectionTypes";

export const genericMultiSelectStyle: StylesConfig<OptionsGenericString, true> = 
{
    control: (baseStyles: CSSObjectWithLabel, state) => 
    ({
        ...baseStyles,
        backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
        ':hover': 
        {
            backgroundColor: '#d0d0d7',
            border: '2px solid black'
        },
        border: '2px solid black'
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

export const genericSingleSelectStyle: StylesConfig<OptionsGenericString, false> =
{
    singleValue: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        color: 'black'
    }),
    control: (baseStyles: CSSObjectWithLabel, state) => 
    ({
        ...baseStyles,
        backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
        ':hover': 
        {
            backgroundColor: '#d0d0d7',
            border: '2px solid black'
        },
        border: '2px solid black'
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
        color: 'black'
    })
}

export const yieldSelectStyle: StylesConfig<OptionsWithImage, true> = 
{
    control: (baseStyles: CSSObjectWithLabel, state) => 
    ({
        ...baseStyles,
        backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
        ':hover': 
        {
            backgroundColor: '#d0d0d7',
            border: '2px solid black'
        },
        border: '2px solid black'
    }),
    menu: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        marginTop: 0,
        backgroundColor: '#edf1f2',
        width: '120%'
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

export const nearbyCityFontSize = 16;

export const nearbyCityStyles = (theWidth: number): StylesConfig<OptionsWithSpecialText, false> => 
{
    return {
        singleValue: (baseStyles: CSSObjectWithLabel) => 
        ({
            ...baseStyles,
            color: 'black'
        }),
        control: (baseStyles: CSSObjectWithLabel, state) => 
        ({
            ...baseStyles,
            backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
            ':hover': 
            {
                backgroundColor: '#d0d0d7',
            border: '2px solid black'
            },
            width: `${theWidth}px`,
            fontSize: `${nearbyCityFontSize}px`,
            border: '2px solid black'
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

export const optionalVisualFontSize = 16;

export const optionalVisualStyle = (theWidth: number): StylesConfig<OptionsGenericString, false> => 
{
    return {
        singleValue: (baseStyles: CSSObjectWithLabel) => 
        ({
            ...baseStyles,
            color: 'black'
        }),
        control: (baseStyles: CSSObjectWithLabel, state) => 
        ({
            ...baseStyles,
            backgroundColor: state.isFocused ? '#d0d0d7' : '#e8e8ec',
            ':hover': 
            {
                backgroundColor: '#d0d0d7',
            border: '2px solid black'
            },
            width: `${theWidth}px`,
            fontSize: `${optionalVisualFontSize}px`,
            border: '2px solid black'
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
            fontSize: `${optionalVisualFontSize}px`,
            width: `${theWidth}px`
        })
    }
}