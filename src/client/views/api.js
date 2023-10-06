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
        // 응답을 확인하고 JSON 파싱
        if (!response.ok) {
            const errorContent = await response.json();
            const { msg } = errorContent;
            throw new Error(msg);
        }
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
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        // 응답을 확인하고 JSON 파싱
        if (!response.ok) {
            const errorContent = await response.json();
            const { msg } = errorContent;
            throw new Error(msg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export { post, get };
// module.exports = { post, get };