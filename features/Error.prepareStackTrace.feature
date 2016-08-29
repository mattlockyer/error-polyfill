Feature: formatting stack trace
  As a user of the error polyfill
  I want to format the stack trace
  So I will be able the present the stack information from different aspects

  Scenario: using the default stack trace format
    When I format a stack using the default trace format
    Then the result should contain the same format V8 uses

  Scenario: using a custom stack trace format
    When I format a stack using a custom trace format
    Then the formatter should get the throwable and the stack frames