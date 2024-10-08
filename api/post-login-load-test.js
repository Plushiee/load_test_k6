import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    const loginUrl = __ENV.API_URL + '/auth/email/login';
    const loginPayload = JSON.stringify({
        email: __ENV.EMAIL,
        password: __ENV.PASSWORD,
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '10s', // Increase timeout to 10 seconds
    };

    const loginRes = http.post(loginUrl, loginPayload, loginParams);

    const success = check(loginRes, {
        'review fetched successfully': (r) => r.status === 200,
    });

    if (!success) {
        // If the response status is not 200, log the response details
        console.error(`Failed to fetch review: ${loginRes.status}`);
        console.log('Response Body:', loginRes.body);
    } else {
        // console.log('Review fetched successfully:', loginRes.body);
    }
    sleep(1);
}
