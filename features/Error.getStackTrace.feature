Feature: Reading the stack trace
  As a user of the error polyfill
  I want to read the stack trace
  So I will be able to get information about a past stack

  Scenario: reading the stack trace of native errors
    When I read the stack trace of a caught native error
    Then the result should be the formatted stack