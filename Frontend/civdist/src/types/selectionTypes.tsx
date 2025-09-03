import React, {JSX} from 'react'
import { TileYields } from './civTypes';

export type OptionsWithSpecialText = 
{
  value: string;
  label: JSX.Element;
  text: string
};

export type OptionsWithImage = 
{
  value: string;
  label: string;
  image: HTMLImageElement;
};

export type OptionsGenericString = 
{
  value: string | null;
  label: string | null;
};

export enum OptionalVisualOptions
{
  SHOW_YIELDS = 'Show Yields',
  SHOW_RESOURCES = 'Show Resources'
}