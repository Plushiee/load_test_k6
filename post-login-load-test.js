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
    // Step 1: Login and get the token
    // const loginUrl = __ENV.API_URL + '/auth/email/login';
    // const loginPayload = JSON.stringify({
    //     email: __ENV.EMAIL,
    //     password: __ENV.PASSWORD,
    // });

    // const loginParams = {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     timeout: '10s', // Increase timeout to 10 seconds
    // };

    // const loginRes = http.post(loginUrl, loginPayload, loginParams);
    
    // // Log the response body and status for debugging
    // console.log('Login Response Status:', loginRes.status);
    // console.log('Login Response Body:', loginRes.body);
    
    // if (loginRes.status !== 200) {
    //     console.error(`Error logging in: ${loginRes.status} - ${loginRes.body}`);
    //     return; // Stop further execution if login fails
    // }
    
    // // Ensure that the response body is JSON and contains the token
    // const jsonResponse = JSON.parse(loginRes.body);
    // const token = jsonResponse.token; // Assuming the token is returned in the 'token' field

    // Step 2: Use the token to get a review
    const baererID = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiX19lbnRpdHkiOiJSb2xlRW50aXR5In0sInNlc3Npb25JZCI6NzQ3NiwiaWF0IjoxNzI4MzQ2NjY2LCJleHAiOjE3MjgzODk4NjZ9.9BHPCNudF2m6XUwTO68kSoBTNL0dPeqjMlKTBrmeI0E'
    const randomId = '61d8435b-282d-4e04-833e-7d65441daa99'; 
    const reviewsUrl = `${__ENV.API_URL}/courses/${randomId}`;

    const reviewParams = {
        headers: {
            'Authorization': `Bearer ${baererID}`,
            'Content-Type': 'application/json',
        },
        timeout: '10s',
    };

    const reviewRes = http.get(reviewsUrl, reviewParams);

    const success = check(reviewRes, {
        'review fetched successfully': (r) => r.status === 200,
    });

    if (!success) {
        // If the response status is not 200, log the response details
        console.error(`Failed to fetch review: ${reviewRes.status}`);
        console.log('Response Body:', reviewRes.body);
    } else {
        console.log('Review fetched successfully:', reviewRes.body);
    }
    sleep(1);
}
