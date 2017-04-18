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


Feature: Use OSGi DS Annotations

  Scenario: Use OSGi DS Annotations on a multimodule project edits the project
    Given a simple multimodule project
    When Use OSGi DS Annotations
    Then changes were made

  Scenario: Use OSGi DS Annotations on a simple content package project doesn't do anything
    Given a standalone content-package project
    When Use OSGi DS Annotations
    Then no changes were made
