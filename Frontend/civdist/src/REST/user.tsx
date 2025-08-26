import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/constants';
import { TileType, RESTResponse, RESTResponseConstructor } from '../types/types';

const backend = axios.create({baseURL: BACKEND_URL, withCredentials: true})

let accessToken: string | null = null;

backend.interceptors.request.use((config) => 
{
    if (accessToken)
        config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
})

backend.interceptors.response.use
(
    (res) => res,
    async (error) => 
    {
        if (error.response?.status === 401 && !error.config._retry) 
        {
            error.config._retry = true;

            try 
            {
                const res = await backend.post("/refresh");
                accessToken = res.data.access_token;
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return backend(error.config); // retry original request
            } 
            catch (refreshErr) 
            {
                const nav = useNavigate();

                console.error("Refresh failed", refreshErr);
                nav('/')
            }
        }

        return Promise.reject(error);
    }
);

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
        const response = await backend.post('/user', body);

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

export async function backend_loginUser(username: string, password: string): Promise<RESTResponse>
{
    const body =
    {
        username: username,
        password: password
    };

    try
    {
        const response = await backend.post('/login', body);
        accessToken = response.data.access_token;

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

export async function logout()
{
    accessToken = null;
    await backend.post('/logout');
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
        const response = await backend.post('/map', body);

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
        const response = await backend.patch('/user', body);

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
        const response = await backend.patch('/map', body);

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
        const response = await backend.get(`/map?id=${id}`);

        return RESTResponseConstructor(response.data.map, response.status, null);
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
        const response = await backend.get(`/allMaps?usernmae=${username}`);

        return RESTResponseConstructor(response.data.maps, response.status, null);
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
        const response = await backend.delete(`/user?username=${username}`);

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
        const response = await backend.delete(`/map?id=${id}`);

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
        const response = await backend.delete(`/allMaps?username=${username}`);

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