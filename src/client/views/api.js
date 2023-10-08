// API POST
async function post(endpoint, data) {
    try {
        const apiUrl = endpoint;
        const dataJson = JSON.stringify(data);

        // HTTP POST 요청 보내기
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: dataJson,
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// API GET
async function get(endpoint, params = '') {
    try {
        const apiUrl = `${endpoint}/${params}`;
        // HTTP GET 요청 보내기
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// API PATCH
async function patch(endpoint, data) {
    try {
        const apiUrl = endpoint;
        const dataJson = JSON.stringify(data);

        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: dataJson,
        });
        const result = await response.json();
        return result;
    } catch (error){
        throw error;
    }   
}

// API DELETE
// delete는 js 예약어 중 하나로 deleteRequest로 명명
async function deleteRequest(endpoint) {
    try {
        const apiUrl = endpoint;

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export { post, get, patch, deleteRequest };
