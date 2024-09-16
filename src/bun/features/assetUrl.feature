Feature: assetUrl


Scenario: Getting the URL for an asset using without any configuration
Given there is no configuration file
When I call assetUrl with the path "index.css"
Then I should get the following url "/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css"


Scenario: Getting the URL for an asset with parameters
Given there is no configuration file
When I call assetUrl with the following parameters:
  | parameter   | value                                                                       |
  | params      | {"array":["one","two","three"],"boolean":true,"number":0,"string":"string"} |
  | path        | index.css                                                                   |
  | type        | absolute                                                                    |
Then I should get the following url "http://localhost:8080/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css?array=one%2Ctwo%2Cthree&boolean=true&number=0&string=string"


Scenario: Params override configuration
Given the following configuration:
  | option    | value |
  | cacheBust | false |
When I call assetUrl with the following parameters:
  | parameter   | value     |
  | cacheBust   | true      |
  | path        | index.css |
Then I should get the following url "/webapp/com.example.myproject/_/service/com.example.myproject/asset/1234567890123456/index.css"
