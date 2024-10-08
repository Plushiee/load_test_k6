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
    check(reviewRes, {
        'review fetched successfully': (r) => r.status === 200,
    });

    sleep(1);
}
