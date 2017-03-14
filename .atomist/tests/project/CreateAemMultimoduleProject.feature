Feature: Create AEM Multimodule


  Scenario: CreateAemMultimoduleProject should create a project
    Given nothing
    When generate with CreateAemMultimoduleProject for AEM 6.3
    Then there should be a correct root pom file for AEM 6.3
