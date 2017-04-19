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
Feature: Add Sling Models Package

  Scenario: AddSlingModelsPackage is a no-op for a content package project
    Given a standalone content-package project
    When AddSlingModelsPackage is run
    Then no changes were made

  Scenario: AddSlingModelsPackage on a multimodule project
    Given a simple multimodule project
    When AddSlingModelsPackage is run
    Then changes were made
    Then javax.inject was added to the root pom's dependencyManagement
    Then javax.inject was added to the core bundle's dependencies
    Then the package was added to the core bundle's maven-bundle-plugin configuration
    Then the package info file was created in the core bundle
    Then the package info file in the package folder in the core bundle has the BND Version annotation

  Scenario: AddSlingModelsPackage on a multimodule project fails with a bad bundle path
    Given a simple multimodule project
    When AddSlingModelsPackage is run with a bundle path of garbage
    Then it should fail

  Scenario: AddSlingModelsPackage on a multimodule project with separate parent
    Given a multimodule project with a separate parent
    When AddSlingModelsPackage is run
    Then changes were made
    Then javax.inject was added to the parent pom's dependencyManagement
    Then javax.inject was added to the core bundle's dependencies
    Then the package was added to the core bundle's maven-bundle-plugin configuration

  Scenario: AddSlingModelsPackage on a multimodule project with two bundles without specifying a path
    Given a multimodule project with two bundles
    When AddSlingModelsPackage is run
    Then it should fail

  Scenario: AddSlingModelsPackage on a multimodule project with two bundles
    Given a multimodule project with two bundles
    When AddSlingModelsPackage is run with a bundle path of core
    Then changes were made
    Then javax.inject was added to the root pom's dependencyManagement
    Then javax.inject was added to the core bundle's dependencies
    Then the package was added to the core bundle's maven-bundle-plugin configuration
    Then the package info file was created in the core bundle
    Then the package info file in the package folder in the core bundle has the BND Version annotation

  Scenario: AddSlingModelsPackage on a multimodule project with OSGi annotation
    Given a simple multimodule project using OSGi annotations
    When AddSlingModelsPackage is run
    Then changes were made
    Then javax.inject was added to the root pom's dependencyManagement
    Then javax.inject was added to the core bundle's dependencies
    Then the package was added to the core bundle's maven-bundle-plugin configuration
    Then the package info file was created in the core bundle
    Then the package info file in the package folder in the core bundle has the OSGi Version annotation

  Scenario: AddSlingModelsPackage adds to existing package header
    Given a bundle with the Sling-Model-Packages header defined
    When AddSlingModelsPackage is run
    Then changes were made
    Then javax.inject was added to the root pom's dependencyManagement
    Then javax.inject was added to the root bundle's dependencies
    Then the package was added to the existing package
    Then the package info file was created in the root bundle


  Scenario: AddSlingModelsPackage doesn't add if already present
    Given a bundle with the Sling-Model-Packages header defined
    When AddSlingModelsPackage is run with the existing package
    Then no changes were made
