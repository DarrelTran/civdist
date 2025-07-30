import { CSSObjectWithLabel, OptionProps, StylesConfig } from "react-select";

type YieldOption = 
{
  value: string;
  label: string;
  image: HTMLImageElement;
};

export const mapPageSelectStyle: StylesConfig<YieldOption, true>  = 
{
    control: (baseStyles: CSSObjectWithLabel) => 
    ({
        ...baseStyles,
        backgroundColor: '#e8e8ec'
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
        backgroundColor: 'lightgrey'
    }),
    option: (baseStyles: CSSObjectWithLabel, state: OptionProps<YieldOption, true>) => 
    ({
        ...baseStyles,
        backgroundColor: state.isSelected ? '#edf1f2': '#edf1f2',
        ':hover': 
        {
            backgroundColor: '#cfd4d6'
        }
    }),
}