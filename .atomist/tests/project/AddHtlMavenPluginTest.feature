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
Feature: Add HTL Maven Plugin

  Scenario: AddHtlMavenPlugin should fail without a project
    Given an empty project
    When add HTL plugin
    Then no changes were made

  Scenario: AddHtlMavenPlugin should add the plugin to a multimodule project
    Given a simple multimodule project
    When add HTL plugin
    Then the root project should have the HTL plugin in pluginManagement
    Then the uiapps project should be configured with the HTL plugin

  Scenario: AddHtlMavenPlugin should add the plugin to a multimodule project with two content packages
    Given a multimodule project with two content packages
    When add HTL plugin
    Then the root project should have the HTL plugin in pluginManagement
    Then the uiapps project should be configured with the HTL plugin
    Then the uiconfig project should be configured with the HTL plugin

  Scenario: AddHtlMavenPlugin should add the plugin component to a standalone project
    Given a standalone content-package project
    When add HTL plugin
    Then the root project should have the HTL plugin in pluginManagement
    Then the root project should be configured with the HTL plugin

  Scenario: AddHtlMavenPlugin should add the plugin to a multimodule project with a separate parent
    Given a multimodule project with a separate parent
    When add HTL plugin
    Then the parent project should have the HTL plugin in pluginManagement
    Then the uiapps project should be configured with the HTL plugin

  Scenario: AddHtlMavenPlugin should not do anything to a bundle project
    Given a standalone bundle project
    When add HTL plugin
    Then no changes were made