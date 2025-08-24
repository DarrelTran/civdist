import axios from 'axios';
import React from 'react';
import { BACKEND_URL } from '../utils/constants';
import { TileType, RESTResponse, RESTResponseConstructor } from '../types/types';

/**
 * 
 * @param username 
 * @param password 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 201 - Success
 * - 400 - Bad username/password
 * - 409 - Duplicate user
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_createUser(username: string, password: string): Promise<RESTResponse>
{
    const body =
    {
        username: username,
        password: password
    };

    try
    {
        const response = await axios.post(`${BACKEND_URL}/user`, body);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param json 
 * @param username 
 * @returns  
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 201 - Success
 * - 400 - Bad username or json
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_addMap(json: TileType[], username: string): Promise<RESTResponse>
{
    const body =
    {
        map: json,
        username: username
    };

    try
    {
        const response = await axios.post(`${BACKEND_URL}/map`, body);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param username 
 * @param password 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 204 - Success
 * - 400 - Bad username
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_updateUser(username: string, password: string): Promise<RESTResponse>
{
    const body =
    {
        username: username,
        password: password // new pass
    };

    try
    {
        const response = await axios.patch(`${BACKEND_URL}/user`, body);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param id 
 * @param json
 * @returns
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 204 - Success
 * - 400 - Bad username or json
 * - 422 - Other type validation error
 * - 500 - Backend error 
 */
export async function backend_updateMap(id: number, json: TileType[]): Promise<RESTResponse>
{
    const body =
    {
        id: id,
        map: json
    };

    try
    {
        const response = await axios.patch(`${BACKEND_URL}/map`, body);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param username 
 * @param password 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 200 - Success
 * - 400 - Bad username or password
 * - 422 - Other type validation error
 * - 500 - Backend error 
 */
export async function backend_getUser(username: string, password: string): Promise<RESTResponse>
{
    try
    {
        const response = await axios.get(`${BACKEND_URL}/user?username=${username}&password=${password}`);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param id 
 * @returns 
 * An appropriate RESTResponse with the single json map or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 200 - Success
 * - 422 - Other type validation error
 * - 500 - Backend error 
 */
export async function backend_getMap(id: number): Promise<RESTResponse>
{
    try
    {
        const response = await axios.get(`${BACKEND_URL}/map?id=${id}`);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}   

/**
 * 
 * @param username 
 * @returns 
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 200 - Success
 * - 400 - Bad username
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_getAllMaps(username: string): Promise<RESTResponse>
{
    try
    {
        const response = await axios.get(`${BACKEND_URL}/allMaps?username=${username}`);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param username 
 * @returns 
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 204 - Success
 * - 400 - Bad username
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_deleteUser(username: string): Promise<RESTResponse>
{
    try
    {
        const response = await axios.delete(`${BACKEND_URL}/user?username=${username}`);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param id 
 * @returns 
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 204 - Success
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_deleteMap(id: number): Promise<RESTResponse>
{
    try
    {
        const response = await axios.delete(`${BACKEND_URL}/map?id=${id}`);

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param username 
 * @returns 
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid. Status codes:
 * - 204 - Success
 * - 400 - Bad username
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_deleteMaps(username: number): Promise<RESTResponse>
{
    try
    {
        const response = await axios.delete(`${BACKEND_URL}/allMaps?username=${username}`)

        return RESTResponseConstructor(null, response.status, null);
    }
    catch(err)
    {
        if (axios.isAxiosError(err))
        {
            return RESTResponseConstructor(null, err.status ? err.status : null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}