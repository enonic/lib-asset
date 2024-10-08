Feature: asset service

Background: State is reset before each test
  Given the request is reset
  Given loglevel is set to "silent"
  Given verify is mocked to true

Scenario: Responds with 200 ok when resource found
  Given enonic is running in production mode
  # Given the following resources:
  #   | path                       | exist | mimeType | etag           | content               |
  #   | /com.enonic.lib.asset.json | false |          |                |                       |
  #   | /assets/index.css          | true  | text/css | etag-index-css | body { color: green } |
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
    | etag          | "etag-index-css"                    |
    | cache-control | public, max-age=31536000, immutable |

Scenario: Should return 404 when rawPath is serviceroot
  Given enonic is running in production mode
  Given the following resources:
    | path    | exist |
    | /assets | false |
  Given the following request:
    | property    | value                                                                                    |
    | branch      | master                                                                                   |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                      |
    | host        | localhost                                                                                |
    | method      | GET                                                                                      |
    | mode        | live                                                                                     |
    | port        | 8080                                                                                     |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset                      |
    | scheme      | http                                                                                     |
    | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset |
  # Then log info the request
  # Given loglevel is set to "debug"
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value |
    | status      | 404   |

Scenario: Should return 404 when rawPath is serviceroot + /
  Given enonic is running in production mode
  Given the following resources:
    | path    | exist |
    | /assets | false |
  Given the following request:
    | property    | value                                                                                    |
    | branch      | master                                                                                   |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                      |
    | host        | localhost                                                                                |
    | method      | GET                                                                                      |
    | mode        | live                                                                                     |
    | port        | 8080                                                                                     |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/                     |
    | scheme      | http                                                                                     |
    | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset |
  # Then log info the request
  # Given loglevel is set to "debug"
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value |
    | status      | 404   |

Scenario: Should return 404 when rawPath is serviceroot + fingerprint
  Given enonic is running in production mode
  Given the following resources:
    | path    | exist |
    | /assets | false |
  Given the following request:
    | property    | value                                                                                                     |
    | branch      | master                                                                                                    |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                       |
    | host        | localhost                                                                                                 |
    | method      | GET                                                                                                       |
    | mode        | live                                                                                                      |
    | port        | 8080                                                                                                      |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456                      |
    | scheme      | http                                                                                                      |
    | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456 |
  # Then log info the request
  # Given loglevel is set to "debug"
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value |
    | status      | 404   |

Scenario: Should return 404 when rawPath is serviceroot + fingerprint + /
  Given enonic is running in production mode
  Given the following resources:
    | path    | exist |
    | /assets | false |
  Given the following request:
    | property    | value                                                                                                     |
    | branch      | master                                                                                                    |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                       |
    | host        | localhost                                                                                                 |
    | method      | GET                                                                                                       |
    | mode        | live                                                                                                      |
    | port        | 8080                                                                                                      |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/                     |
    | scheme      | http                                                                                                      |
    | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456 |
  # Then log info the request
  # Given loglevel is set to "debug"
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value |
    | status      | 404   |

Scenario: Should return 404 when excess slashes
  Given enonic is running in production mode
  Given the following resources:
    | path                | exist |
    | /assets///index.css | false |
  Given the following request:
    | property    | value                                                                                                               |
    | branch      | master                                                                                                              |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                                                 |
    | host        | localhost                                                                                                           |
    | method      | GET                                                                                                                 |
    | mode        | live                                                                                                                |
    | port        | 8080                                                                                                                |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456///index.css                    |
    | scheme      | http                                                                                                                |
    | url         | http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  # Then log info the request
  # Given loglevel is set to "debug"
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value |
    | status      | 404   |

Scenario: Should return 404 when excess slashes (2)
  Given enonic is running in production mode
  # Given loglevel is set to "debug"
  Given the following resources:
    | path                                                   | exist |
    | /assets//icons//favicons//apple-touch-icon-120x120.png | false |
  Given the following request:
    | property      | value                                                                                                                                           |
    | branch        | draft                                                                                                                                           |
    | contextPath   | /admin/tool/_/service/com.enonic.xp.app.standardidprovider/asset                                                                                |
    | host          | localhost                                                                                                                                       |
    | method        | GET                                                                                                                                             |
    | mode          | admin                                                                                                                                           |
    | path          | /admin/tool/_/service/com.enonic.xp.app.standardidprovider/asset/1727786440404/icons/favicons/apple-touch-icon-120x120.png                      |
    | port          | 8080                                                                                                                                            |
    | rawPath       | /admin/tool/_/service/com.enonic.xp.app.standardidprovider/asset/1727786440404//icons//favicons//apple-touch-icon-120x120.png                   |
    | remoteAddress | 127.0.0.1                                                                                                                                       |
    | repositoryId  | com.enonic.cms.default                                                                                                                          |
    | scheme        | http                                                                                                                                            |
    | url           | http://localhost:8080/admin/tool/_/service/com.enonic.xp.app.standardidprovider/asset/1727786440404/icons/favicons/apple-touch-icon-120x120.png |
    | webSocket     | false                                                                                                                                           |
  Given the following request headers:
    | header                    | value                                                                                                                                   |
    | Accept                    | text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7 |
    | Accept-Encoding           | gzip, deflate, br, zstd                                                                                                                 |
    | Accept-Language           | en-GB,en-US;q=0.9,en;q=0.8,no;q=0.7                                                                                                     |
    | Cache-Control             | no-cache                                                                                                                                |
    | Connection                | keep-alive                                                                                                                              |
    | Cookie                    | app.browse.RecentItemsList=base%3Afolder%7Cportal%3Asite; JSESSIONID=1o50615fgjqlt1wsbsvcubu00m2                                        |
    | Host                      | localhost:8080                                                                                                                          |
    | Pragma                    | no-cache                                                                                                                                |
    | sec-ch-ua                 | "Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"                                                                       |
    | sec-ch-ua-mobile          | ?0                                                                                                                                      |
    | sec-ch-ua-platform        | "macOS"                                                                                                                                 |
    | Sec-Fetch-Dest            | document                                                                                                                                |
    | Sec-Fetch-Mode            | navigate                                                                                                                                |
    | Sec-Fetch-Site            | none                                                                                                                                    |
    | Sec-Fetch-User            | ?1                                                                                                                                      |
    | Upgrade-Insecure-Requests | 1                                                                                                                                       |
    | User-Agent                | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36                   |
  Given the following request cookies:
    | name                       | value                         |
    | app.browse.RecentItemsList | base%3Afolder%7Cportal%3Asite |
    | JSESSIONID                 | 1o50615fgjqlt1wsbsvcubu00m2   |
  Given the following request params:
    | param | value |
  Given the following request path params:
    | param | value                                                         |
    | path  | /1727786440404//icons//favicons//apple-touch-icon-120x120.png |
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value |
    | status      | 404   |

Scenario: prefers brotli even though it comes last and have lowest qvalue weight
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent             | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the following request headers:
    | header           | value                                                  |
    | accept-encoding  | gzip, deflate;q=0.9, identity;q=0.8, *;q=0.7, br;q=0.1 |
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value     |
    | body        | brContent |
    | status      | 200       |
    | contentType | text/css  |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | br                                  |
    | etag             | "etag-index-css-br"                 |
    | vary             | Accept-Encoding                     |

Scenario: returns gzip compressed content gzip, but no brotli in accept-encoding header
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent             | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the following request headers:
    | header           | value                                            |
    | accept-encoding  | deflate;q=1.0, identity;q=0.9, *;q=0.8, gzip=0.1 |
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value       |
    | body        | gzipContent |
    | status      | 200         |
    | contentType | text/css    |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | gzip                                |
    | etag             | "etag-index-css-gzip"               |
    | vary             | Accept-Encoding                     |

Scenario: returns gzip when br file is missing
  # Given loglevel is set to "debug"
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | false |                  |                       |                              |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the following request headers:
    | header           | value                                                        |
    | accept-encoding  | br;q=1.0, gzip;q=0.1, deflate;q=0.6, identity;q=0.4, *;q=0.2 |
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value       |
    | body        | gzipContent |
    | status      | 200         |
    | contentType | text/css    |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | gzip                                |
    | etag             | "etag-index-css-gzip"               |
    | vary             | Accept-Encoding                     |

Scenario: Does NOT set vary when staticCompress = false
  # Running in development mode to avoid cached configuration
  Given enonic is running in development mode
  # And loglevel is set to "debug"
  And the following resources:
    | path                               | exist | mimeType         | content                  | etag                         |
    | /com.enonic.lib.asset.json         | true  |                  | {"staticCompress":false} |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green }    | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent                | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent              | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the following request headers:
    | header           | value                          |
    | accept-encoding  | br, gzip, deflate, identity, * |
  # And the resources are info logged
  # And log info the request
  When the request is sent
  # Then loglevel is set to "silent"
  # Then log info the response
  Then the response should have the following properties:
    | property    | value                 |
    | body        | body { color: green } |
    | status      | 200                   |
    | contentType | text/css              |
  And the response should have the following headers:
    | header           | value             |
    | cache-control    | private, no-store |
    | content-encoding | undefined         |
    | etag             | undefined         |
    | vary             | undefined         |

Scenario: Does not use compression when trimmed accept-encoding endswith gzip;q=0 and includes br;q=0,
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent             | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the request header "accept-encoding" is "br;q=0, deflate;q=0.6, identity;q=0.4, *;q=0.1, gzip;q=0 "
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value                 |
    | body        | body { color: green } |
    | status      | 200                   |
    | contentType | text/css              |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | undefined                           |
    | etag             | "etag-index-css"                    |
    | vary             | Accept-Encoding                     |

Scenario: Does not use compression when trimmed accept-encoding endswith br;q=0 and includes gzip;q=0,
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent             | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the request header "accept-encoding" is "gzip;q=0, deflate;q=0.6, identity;q=0.4, *;q=0.1, br;q=0 "
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value                 |
    | body        | body { color: green } |
    | status      | 200                   |
    | contentType | text/css              |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | undefined                           |
    | etag             | "etag-index-css"                    |
    | vary             | Accept-Encoding                     |

Scenario: handles camelcase request headers
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent             | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the following request headers:
    | header           | value                   |
    | Accept-Encoding  | gzip, deflate, br, zstd |
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value      |
    | body        | brContent  |
    | status      | 200        |
    | contentType | text/css   |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | br                                  |
    | etag             | "etag-index-css-br"                 |
    | vary             | Accept-Encoding                     |

Scenario: handles camelcase accept-encoding header
  Given enonic is running in production mode
  Given the following resources:
    | path                               | exist | mimeType         | content               | etag                         |
    | /com.enonic.lib.asset.json         | false |                  |                       |                              |
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css               |
    | /assets/index.css.br               | true  | text/css         | brContent             | br-etag-should-not-be-used   |
    | /assets/index.css.gz               | true  | text/css         | gzipContent           | gzip-etag-should-not-be-used |
  And the following request:
    | property    | value                                                                                          |
    | contextPath | /webapp/com.example.myproject/_/service/com.example.myproject/asset                            |
    | rawPath     | /webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css |
  And the request header "accept-encoding" is "GzIp, DeFlAtE, bR, zStD"
  # Then the resources are info logged
  # Then log info the request
  When the request is sent
  # Then log info the response
  Then the response should have the following properties:
    | property    | value      |
    | body        | brContent  |
    | status      | 200        |
    | contentType | text/css   |
  And the response should have the following headers:
    | header           | value                               |
    | cache-control    | public, max-age=31536000, immutable |
    | content-encoding | br                                  |
    | etag             | "etag-index-css-br"                 |
    | vary             | Accept-Encoding                     |

Scenario: Responds with 304 Not modified when if-none-match matches etag
  Given enonic is running in production mode
  # Given the following resources:
  #   | path              | mimeType | etag           | content               |
  #   | /assets/index.css | text/css | etag-index-css | body { color: green } |
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
  Then the response should have the following headers:
    | header        | value                               |
    | etag          | "etag-index-css"                    |
    | cache-control | public, max-age=31536000, immutable |


Scenario: Responds with 404 Not found when resource not found
  Given enonic is running in production mode
  Given the following resources:
    | path                       | exist |
    | /com.enonic.lib.asset.json | false |
    | /assets/404.css            | false  |
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
  # Then log info the response
  Then the response should have the following properties:
    | property    | value                     |
    | status      | 400                       |
    | contentType | text/plain; charset=utf-8 |
  And the response body should start with "can't contain '..' or any of these characters:"

Scenario: Responds with cache control "private, no-store" when resource found in dev mode
  Given enonic is running in development mode
  Given the following resources:
    | path                       | exist | mimeType | etag             | content               |
    | /com.enonic.lib.asset.json | false |          |                  |                       |
    | /assets/index.css          | true  | text/css | 1234567890abcdef | body { color: green } |
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
    | /assets/index.css          | true  | body { color: green } |
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
    | path                       | exist |  content               |
    | /com.enonic.lib.asset.json | true  |  {"cacheBust":true}    |
    | /assets/index.css          | true  |  body { color: green } |
    | /assets                    | false |                        |
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
    | path                       | exist |  content               |
    | /com.enonic.lib.asset.json | true  |  {"cacheBust":false}   |
    | /assets/index.css          | true  |  body { color: green } |
    # | /assets                    | true  |                        |
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
    | /assets/index.css                  | true  | text/css         | body { color: green } | etag-index-css |
    | /assets/wrongFingerprint/index.css | false |                  |                       |                |
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
