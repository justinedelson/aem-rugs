import { Xml } from '@atomist/rug/model/Xml'
import { File } from '@atomist/rug/model/File'
import { DOMParser } from 'xmldom'

export function addFilterEntry(filterXml : Xml, path : string) : void {
    filterXml.addChildNode("/workspaceFilter", "filter", `<filter root="${path}"/>`);
}

export function addFilterEntryToDefinition(definitionXml : File, path : string) : void {
    let doc = new DOMParser().parseFromString(definitionXml.content(), "text/xml");
    let filterElement = findFilter(doc.documentElement);
    if (filterElement) {
        let filterCount = countChildNodes(filterElement);

        let newFilterEntry = doc.createElement(`f${filterCount}`);
        newFilterEntry.setAttributeNS("http://www.jcp.org/jcr/1.0", "jcr:primaryType", "nt:unstructured");
        newFilterEntry.setAttribute("mode", "replace");
        newFilterEntry.setAttribute("root", path);
        newFilterEntry.setAttribute("rules", "[]");
        filterElement.appendChild(newFilterEntry);

        definitionXml.setContent(doc.toString());
    } else {
        console.warn("No filter element found in definition/.content.xml. Skipping adding a filter entry.")
    }
}

function findFilter(documentElement) : any {
    for (let child of documentElement.childNodes) {
        if (child.nodeName === "filter") {
            return child;
        }
    }
    return null;
}

function countChildNodes(element) : number {
    let count = 0;
    for (let child of element.childNodes) {
        if (child.nodeType === element.nodeType) {
            count++;
        }
    }
    return count;
}