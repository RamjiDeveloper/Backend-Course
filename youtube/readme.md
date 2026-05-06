1xx – Informational
100 Continue → Request continue kar sakte ho

✅ 2xx – Success

200 OK → Request successful
201 Created → Resource create ho gaya
202 Accepted → Request accept hua (processing baad me hogi)
204 No Content → Success, but response body nahi

✅ 3xx – Redirection

301 Moved Permanently → URL permanently change ho gaya
302 Found → Temporary redirect
304 Not Modified → Cache use karo (data same hai)

✅ 4xx – Client Errors

400 Bad Request → Galat request (missing/invalid data)
401 Unauthorized → Login/verification required
403 Forbidden → Access allowed nahi
404 Not Found → Resource nahi mila
405 Method Not Allowed → Wrong HTTP method
409 Conflict → Data conflict (e.g., duplicate email)
410 Gone → Resource permanently delete ho gaya
422 Unprocessable Entity → Validation error (OTP galat, etc.)
429 Too Many Requests → Rate limit exceed

✅ 5xx – Server Errors

500 Internal Server Error → Server me problem
501 Not Implemented → Feature available nahi
502 Bad Gateway → Server upstream se galat response
503 Service Unavailable → Server down/overloaded
504 Gateway Timeout → Server ko response nahi mila time pe

🔥 Most commonly used (important)
👉 200, 201, 400, 401, 403, 404, 409, 422, 500