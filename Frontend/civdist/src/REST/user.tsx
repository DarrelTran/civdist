import axios, { AxiosRequestConfig, isAxiosError } from 'axios';
import { BACKEND_URL } from '../utils/constants';
import { TileType } from '../types/civTypes';
import {RESTResponse, RESTResponseConstructor} from '../types/serverTypes'

interface CustomAxiosConfig extends AxiosRequestConfig
{
    retry?: boolean;
    numRetries?: number;
}

const backend = axios.create({baseURL: BACKEND_URL, withCredentials: true});
const refreshClient = axios.create({ baseURL: BACKEND_URL, withCredentials: true }); // to prevent interceptor below from infinite loop

backend.interceptors.response.use
(
    (res) => res,
    async (error) => 
    {
        const axiosConfig: CustomAxiosConfig = error.config as CustomAxiosConfig;

        if (isAxiosError(error) && error.config && axiosConfig.headers) 
        {
            axiosConfig.numRetries = axiosConfig.numRetries ?? 0;

            if 
            (
                error.response?.status === 401 &&
                !axiosConfig.retry &&
                !error.config.url?.includes('/refresh') &&
                axiosConfig.numRetries < 3
            ) 
            {
                axiosConfig.retry = true;
                axiosConfig.numRetries++;

                try 
                {
                    const res = await refreshClient.post('/refresh');

                    return backend(axiosConfig);
                } 
                catch (refreshErr) 
                {
                    //console.error('Refresh failed', refreshErr);
                }
            }
        }

        return Promise.reject(error);
    }
);


/**
 * 
 * @returns 
 * An appropriate RESTResponse containing the logged in user's username (string) or null in all RESTResponse fields if the url is invalid.  
 * Status codes:
 * - 201 - Success
 * - 400 - Bad refresh token
 */
export async function backend_checkLoggedIn(): Promise<RESTResponse> 
{
    try 
    {
        const response = await backend.post('/verify');

        return RESTResponseConstructor(response.data.username, response.status, null);
    } 
    catch (err) 
    {
        if (axios.isAxiosError(err)) 
        {
            return RESTResponseConstructor(null, err.status ?? null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid. Will only work if the user is still logged in.   
 * Status codes:
 * - 201 - Success
 * - 401 - Bad refresh token
 */
export async function backend_refreshToken(): Promise<RESTResponse> 
{
    try 
    {
        const response = await backend.post('/refresh');

        return RESTResponseConstructor(null, response.status, null);
    } 
    catch (err) 
    {
        if (axios.isAxiosError(err)) 
        {
            return RESTResponseConstructor(null, err.status ?? null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid.  
 * Status codes:
 * - 204 - Success
 * - 500 - Backend error
 */
export async function backend_logout(): Promise<RESTResponse> 
{
    try 
    {
        const response = await backend.post('/logout');

        return RESTResponseConstructor(null, response.status, null);
    } 
    catch (err) 
    {
        if (axios.isAxiosError(err)) 
        {
            return RESTResponseConstructor(null, err.status ?? null, err.message);
        }

        return RESTResponseConstructor(null, null, "Unknown error");
    }
}

/**
 * 
 * @param username 
 * @param password 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid.    
 * Status codes:
 * - 201 - Success
 * - 400 - Invalid username/password
 * - 404 - User not found
 * - 409 - Duplicate user
 * - 411 - Empty username/password
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
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
    sessionStorage.setItem('bearer', '');
    await backend.post('/logout');
}

/**
 * 
 * @param username 
 * @param password 
 * @returns 
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid.    
 * Status codes:
 * - 201 - Success
 * - 409 - Duplicate user
 * - 411 - Empty username/password
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

/**
 * 
 * @param json 
 * @param username 
 * @returns  
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid.    
 * Status codes:
 * - 201 - Success
 * - 404 - User does not exist/cannot be found
 * - 409 - Duplicate map name
 * - 411 - Empty username/map
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_addMap(json: TileType[], username: string, mapName: string, visualIndex: number): Promise<RESTResponse>
{
    const body =
    {
        map: json,
        username: username,
        mapName: mapName,
        visualIndex: visualIndex
    };

    const header: AxiosRequestConfig = 
    {
        withCredentials: true
    }

    try
    {
        const response = await backend.post('/map', body, header);

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
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid.    
 * Status codes:
 * - 204 - Success
 * - 404 - User doesn't exist/cannot be found
 * - 409 - Duplicate map name
 * - 411 - Empty username/password
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

    const header: AxiosRequestConfig = 
    {
        withCredentials: true
    }

    try
    {
        const response = await backend.patch('/user', body, header);

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
 * An appropriate RESTResponse or null in all RESTResponse fields if the url is invalid.    
 * Status codes:
 * - 204 - Success
 * - 404 - Map doesnt exist 
 * - 411 - Empty map
 * - 422 - Other type validation error
 * - 500 - Backend error 
 */
export async function backend_updateMap(id: number, json: TileType[], mapName: string, visualIndex: number): Promise<RESTResponse>
{
    const body =
    {
        id: id,
        map: json,
        mapName: mapName,
        visualIndex: visualIndex
    };

    const header: AxiosRequestConfig = 
    {
        withCredentials: true
    }

    try
    {
        const response = await backend.patch('/map', body, header);

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
 * An appropriate RESTResponse with a {DatabaseMapType} or null in all RESTResponse fields if the url is invalid.    
 * Status codes:
 * - 200 - Success
 * - 404 - Map doesnt exist
 * - 422 - Other type validation error
 * - 500 - Backend error 
 */
export async function backend_getMap(id: number): Promise<RESTResponse>
{
    try
    {
        const header: AxiosRequestConfig = 
        {
            withCredentials: true
        }

        const response = await backend.get(`/map?id=${id}`, header);

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
 * An appropriate RESTResponse with the a list of {DatabaseMapType}s or null in all RESTResponse fields if the url is invalid.   
 * Status codes:
 * - 200 - Success
 * - 404 - User doesn't exist/cannot be found
 * - 411 - Empty username
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_getAllMaps(username: string): Promise<RESTResponse>
{
    try
    {
        const header: AxiosRequestConfig = 
        {
            withCredentials: true
        }

        const response = await backend.get(`/allMaps?username=${username}`, header);

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
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid.   
 * Status codes:
 * - 204 - Success
 * - 404 - User doesn't exist
 * - 411 - Empty username
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
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid.   
 * Status codes:
 * - 204 - Success
 * - 404 - Map doesnt exist
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_deleteMap(id: number): Promise<RESTResponse>
{
    try
    {
        const header: AxiosRequestConfig = 
        {
            withCredentials: true
        }

        const response = await backend.delete(`/map?id=${id}`, header);

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
 * An appropriate RESTResponse with the a json list of all maps or null in all RESTResponse fields if the url is invalid.   
 * Status codes:
 * - 204 - Success
 * - 404 - Username doesnt exist/cannot be found
 * - 411 - Empty username
 * - 422 - Other type validation error
 * - 500 - Backend error
 */
export async function backend_deleteMaps(username: number): Promise<RESTResponse>
{
    try
    {
        const header: AxiosRequestConfig = 
        {
            withCredentials: true
        }

        const response = await backend.delete(`/allMaps?username=${username}`, header);

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