Feature: asset service


Scenario: Responds with 200 ok when resource found
Given enonic is running in production mode
# Given the following resources:
#   | path                       | exist | mimeType | etag           | content               |
#   | /com.enonic.lib.asset.json | false |          |                |                       |
#   | /static/index.css          | true  | text/css | etag-index-css | body { color: green } |
Given the following request:
  | property    | value                                                                                                               |
  | branch      | master                                                                                                              |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | host        | localhost                                                                                                           |
  | method      | GET                                                                                                                 |
  | mode        | live                                                                                                                |
  | port        | 8080                                                                                                                |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css                      |
  | scheme      | http                                                                                                                |
  | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value                 |
  # | body        | body { color: green } | # TODO Stream
  | status      | 200                   |
  | contentType | text/css              |
And the response should have the following headers:
  | header        | value                               |
  | etag          | "etag-index-css"                  |
  | cache-control | public, max-age=31536000, immutable |


Scenario: Responds with 304 Not modified when if-none-match matches etag
Given enonic is running in production mode
# Given the following resources:
#   | path              | mimeType | etag           | content               |
#   | /static/index.css | text/css | etag-index-css | body { color: green } |
Given the following request:
| property    | value                                                                                                               |
| contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
| rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css                      |
# | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
And the following request headers:
| header        | value            |
| if-none-match | "etag-index-css" |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value |
  | status      | 304   |


Scenario: Responds with 404 Not found when resource not found
Given enonic is running in production mode
Given the following request:
| property    | value                                                                                                             |
| contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                               |
| rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/404.css                      |
# | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/404.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value |
  | status      | 404   |


Scenario: Responds with 400 bad request when path is illegal in prod mode
Given enonic is running in production mode
Given the following request:
| property    | value                                                                                                       |
| contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                         |
| rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/<                      |
| url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/< |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value |
  | status      | 400   |

Scenario: Responds with 400 bad request when path is illegal in dev mode
Given enonic is running in development mode
Given the following request:
| property    | value                                                                                                       |
| contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                         |
| rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/<                      |
| url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/< |
# Then log info the request
When the request is sent
Then log info the response
Then the response should have the following properties:
  | property    | value                     |
  | status      | 400                       |
  | contentType | text/plain; charset=utf-8 |
And the response body should start with "can't contain '..' or any of these characters:"

Scenario: Responds with 400 bad request when rawPath is missing in prod mode
Given enonic is running in production mode
Given the following resources:
  | path              | mimeType | etag             | content               |
  | /static/index.css | text/css | 1234567890abcdef | body { color: green } |
Given the following request:
| property    | value                                                                                                               |
| url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value |
  | status      | 400   |


Scenario: Responds with 400 bad request with body when rawPath is missing in dev mode
Given enonic is running in development mode
Given the following resources:
  | path                       | exist | mimeType | etag             | content               |
  | /com.enonic.lib.asset.json | false |          |                  |                       |
  | /static/index.css          | true  | text/css | 1234567890abcdef | body { color: green } |
And the following request:
| property    | value                                                                                                               |
| url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value                       |
  # | body        | request.rawPath is missing! request: {\n    "url": "http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css"\n}|
  | status      | 400                         |
And the response body should start with "request.rawPath is missing!"


Scenario: Responds with cache control "private, no-store" when resource found in dev mode
Given enonic is running in development mode
Given the following resources:
  | path                       | exist | mimeType | etag             | content               |
  | /com.enonic.lib.asset.json | false |          |                  |                       |
  | /static/index.css          | true  | text/css | 1234567890abcdef | body { color: green } |
Given the following request:
  | property    | value                                                                                                               |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css                      |
  | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value                 |
  # | body        | body { color: green } | # TODO Stream
  | status      | 200                   |
  | contentType | text/css              |
And the response should have the following headers:
  | header        | value             |
  | etag          | undefined         |
  | cache-control | private, no-store |


Scenario: Responds with 500 internal server error when an error is thrown

# Given enonic is running in production mode # Doesn't affect the test
Given the following resources:
  | path                       | content |
  | /com.enonic.lib.asset.json | notJson |
And the following request:
  | property    | value                                                                                                               |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css                      |
  | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value                 |
  | status      | 500                   |
  | contentType | text/plain; charset=utf-8 |
And the response body should start with "Server error (logged with error ID: "


Scenario: Responds with 500 internal server error when the configured root is empty

# Testing in development mode to avoid cached configuration
Given enonic is running in development mode
Given the following resources:
  | path                       | exist | content               |
  | /com.enonic.lib.asset.json | true  | {"root":""}           |
  | /static/index.css          | true  | body { color: green } |
And the following request:
  | property    | value                                                                                                               |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css                      |
  | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value                 |
  | status      | 500                   |
  | contentType | text/plain; charset=utf-8 |
And the response body should start with "Server error (logged with error ID: "


Scenario: Responds with 404 not found when cacheBust is true and the request doesn't contain fingerprint
# Testing in development mode to avoid cached configuration
Given enonic is running in development mode
Given the following resources:
  | path                       | exist | isDir | content               |
  | /com.enonic.lib.asset.json | true  | false | {"cacheBust":true}    |
  | /static/index.css          | true  | false | body { color: green } |
  | /static                    | false | true  |                       |
And the following request:
  | property    | value                                                                                                               |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/index.css                      |
  # | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value |
  | status      | 404   |

Scenario: Responds with 404 not found when cacheBust is false and the request contains fingerprint
# Testing in development mode to avoid cached configuration
Given enonic is running in development mode
Given the following resources:
  | path                       | exist | isDir | content               |
  | /com.enonic.lib.asset.json | true  | false | {"cacheBust":false}   |
  | /static/index.css          | true  | false | body { color: green } |
  # | /static                    | true  | true  |                       |
And the following request:
  | property    | value                                                                                                               |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css                      |
  # | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value |
  | status      | 404   |


Scenario: Responds with cache control "private, no-store" when cacheBust is true and the request contains wrong fingerprint
# Testing in development mode to avoid cached configuration
Given enonic is running in development mode
Given the following resources:
  | path                               | exist | mimeType         | content               | etag           |
  | /com.enonic.lib.asset.json         | true  | application/json | {"cacheBust":true}    |                |
  | /static/index.css                  | true  | text/css         | body { color: green } | etag-index-css |
  | /static/wrongFingerprint/index.css | false |                  |                       |                |
And the following request:
  | property    | value                                                                                                               |
  | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
  | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/wrongFingerprint/index.css                      |
  # | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/wrongFingerprint/index.css |
# Then log info the request
When the request is sent
# Then log info the response
Then the response should have the following properties:
  | property    | value    |
  | status      | 200      |
  | contentType | text/css |
And the response should have the following headers:
  | header        | value             |
  # etag is undefined in dev mode
  | etag          | undefined         |
  | cache-control | private, no-store |
