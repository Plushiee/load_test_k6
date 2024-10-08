import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '1m', target: 800 },
        { duration: '5m', target: 800 },
        { duration: '1m', target: 1000 },
        { duration: '5m', target: 1000 },
        { duration: '5m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    const reviewsUrl = `${__ENV.APP_URL}`;

    const reviewRes = http.get(reviewsUrl);

    // Check if the review was fetched successfully
    const success = check(reviewRes, {});

    if (!success) {
        // If the response status is not 200, log the response details
        console.error(`Failed to fetch review: ${reviewRes.status}`);
        console.log('Response Body:', reviewRes.body);
    } else {
        console.log('Review fetched successfully:', reviewRes.body);
    }
    sleep(1);

    sleep(1);
}
