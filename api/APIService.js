export const host = 'http://localhost:8080';

export async function getUserFromSessionToken(sessionToken) {
    const endpoint = `${host}/users/${sessionToken}`;
    console.log(`[APIService] calling ${endpoint}`);

    return fetch(endpoint)
        .then((response) => {
            if (response.ok) {
                console.log(`[APIService] found user for sessionToken`);
                return response.json();
            } else {
                console.log(`[APIService] unable to find user for sessionToken`);
                throw new Error();
            }
        })
        .catch((error) => {
            throw error;
        });     
}

