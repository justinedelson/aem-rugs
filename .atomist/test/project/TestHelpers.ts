/*
 * Copyright (C) 2017 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Pom } from "@atomist/rug/model/Pom"
import { Result } from "@atomist/rug/test/Result";
import { DOMParser } from 'xmldom'

export function countDependenciesInDependencyManagement(pom: Pom): number {
    let doc = new DOMParser().parseFromString(pom.content(), "text/xml");
    return doc.getElementsByTagName("dependencyManagement")[0].getElementsByTagName("dependency").length;
}
