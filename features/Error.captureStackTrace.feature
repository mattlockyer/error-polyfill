Feature: Capturing the stack trace
  As a user of the error polyfill
  I want to capture the stack trace
  So I will be able to store information about the present stack

  Scenario: writing the current stack trace on throwables
    When I write the stack trace onto a throwable
    Then the throwable should store information about the present stack
    And by reading this information the result should be the formatted stack

  Scenario: omitting frames by writing the current stack trace
    When I write the stack trace onto a throwable and pass a terminator function along
    Then the throwable should store the information about the part of the present stack happened before the terminator function call
    And by reading this information the result should be the formatted stack without the omitted frames
