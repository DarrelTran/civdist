import { TileType } from "./civTypes";

export type SaveType =
{
  name: string | null, 
  json: TileType[] | null, 
  id: number,
  textInputDisplay: string,
  textNameDisplay: string,
  inputText: string
}

export type RESTResponse =
{
  output: any | null,
  status: number | null,
  errorMessage: string | null
}

export function RESTResponseConstructor(output: any | null, status: number | null, errorMessage: string | null): RESTResponse
{
  return {output: output, status: status, errorMessage: errorMessage};
}

export type DatabaseMapType =
{
  id: number,
  map: TileType[],
  username: string,
  mapName: string
}