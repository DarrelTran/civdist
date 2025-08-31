import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { backend_checkLoggedIn } from "../REST/user";

/**
 * Just call directly - already has useEffect
 * @param navLocation 
 */
export async function useCheckLoggedIn(navLocation: string)
{
    const nav = useNavigate();

    useEffect(() => 
    {
        const checkAlreadyLoggedIn = async () =>
        {
            const storedLogIn = sessionStorage.getItem('loggedIn');

            if (storedLogIn == 'true')
                nav(navLocation);

            const isLoggedIn = await backend_checkLoggedIn();

            if (isLoggedIn.status === 201 && storedLogIn !== 'true')
            {
                sessionStorage.setItem('loggedIn', 'true');
                nav(navLocation);
            }
            else if (isLoggedIn.status !== 201)
            {
                sessionStorage.setItem('loggedIn', 'false');
            }
        }

        checkAlreadyLoggedIn();
    }, [])
}