import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '7m', target: 200 },
        { duration: '10m', target: 200 },
        { duration: '7m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    const reviewsUrl = `${__ENV.APP_URL}`;

    const reviewRes = http.get(reviewsUrl);

    const success = check(reviewRes, {
        'review fetched successfully': (r) => r.status === 200,
    });

    if (!success) {
        console.error(`Failed to fetch review: ${reviewRes.status}`);
        console.log('Response Body:', reviewRes.body);
    } else {
        // console.log('Review fetched successfully:', reviewRes.body);
    }
    sleep(1);

    sleep(1);
}
