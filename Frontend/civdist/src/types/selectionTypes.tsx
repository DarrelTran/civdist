import React, {JSX} from 'react'
import { TileYields } from './types';

export type OptionsWithSpecialText = 
{
  value: string;
  label: JSX.Element;
  text: string
};

export type OptionsWithImage = 
{
  value: TileYields;
  label: TileYields;
  image: HTMLImageElement;
};

export type OptionsGenericString = 
{
  value: string | null;
  label: string | null;
};