import axios from 'axios';
import React from 'react';
import { BACKEND_URL } from '../utils/constants';

export function backend_createUser(username: string, password: string)
{
    const body =
    {
        username: username,
        password: password
    };

    axios.post(`${BACKEND_URL}/user/`, body)
    .then(response => 
    {
        console.log('OK')
    })
    .catch(err => 
    {
        if (axios.isAxiosError(err))
        {
            console.log(err.response?.data)
        }
    })
}

export function backend_addMap()
{
    axios.post(`${BACKEND_URL}/map/`)
}

export function backend_updateUser()
{
    axios.patch(`${BACKEND_URL}/user/`)
}

export function backend_updateMap()
{
    axios.patch(`${BACKEND_URL}/map/`)
}

export function backend_getUser()
{
    axios.get(`${BACKEND_URL}/user/`)
}

export function backend_getMap()
{
    axios.get(`${BACKEND_URL}/map/`)
}   

export function backend_getAllMaps()
{
    axios.get(`${BACKEND_URL}/allMaps/`)
}

export function backend_deleteUser()
{
    axios.delete(`${BACKEND_URL}/user/`)
}

export function backend_deleteMap()
{
    axios.delete(`${BACKEND_URL}/map/`)
}

export function backend_deleteMaps()
{
    axios.delete(`${BACKEND_URL}/allMaps/`)
}