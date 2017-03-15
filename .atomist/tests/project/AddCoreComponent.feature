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
Feature: Add Core Components

  Scenario: AddCoreComponents should fail without a project
    Given an empty project
    When add core text component
    Then it should fail

  Scenario: AddCoreComponents should add a text component to a multimodule project
    Given a simple multimodule project
    When add core text component
    Then the text component should be created in the uiapps project

  Scenario: AddCoreComponents should add a text component to a multimodule project with two content packages
    Given a multimodule project with two content packages
    When add core text component
    Then the text component should be created in the uiapps project
    Then the text component should not be created in the uiconfig project

  Scenario: AddCoreComponents should add a text component to a standalone project
    Given a standalone content-package project
    When add core text component
    Then the text component should be created in the root project

  Scenario: AddCoreComponents should add an image component with the correct editConfig
    Given a standalone content-package project
    When add core image component
    Then the image component should be created in the root project
    Then the image component in the root project should have the correct editConfig

  Scenario: AddCoreComponents should not do anything to a bundle project
    Given a standalone bundle project
    When add core text component
    Then no changes were made