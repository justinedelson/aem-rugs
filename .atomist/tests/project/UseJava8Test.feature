# Copyright (C) 2017 Adobe
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

Feature: Use Java 8

  Scenario: UseJava8 does nothing without a project
    Given an empty project
    When use Java 8
    Then no changes were made

  Scenario: UseJava8 does nothing to content package projects
    Given a standalone content-package project
    When use Java 8
    Then no changes were made

  Scenario: UseJava8 should update a standalone bundle project
    Given a standalone bundle project
    When use Java 8
    Then changes were made
    Then compiler plugin was updated

  Scenario: UseJava8 should update a standalone bundle project already using Java 8
    Given a standalone bundle project using Java 8
    When use Java 8
    Then no changes were made

  Scenario: UseJava8 should update plugin management in a multimodule project
    Given a simple multimodule project
    When use Java 8
    Then changes were made
    Then plugin management in the root pom was updated

  Scenario: UseJava8 should update plugin management in a multimodule project with separate parent
    Given a multimodule project with a separate parent
    When use Java 8
    Then changes were made
    Then plugin management in the parent pom was updated

  Scenario: UseJava8 should set plugin management in a project without a compiler configuration
    Given a standalone bundle project without a compiler plugin configuration
    When use Java 8
    Then changes were made
    Then plugin management in the root pom was updated