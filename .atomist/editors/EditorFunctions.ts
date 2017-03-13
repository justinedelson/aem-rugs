/**
 * Created by jedelson on 3/13/17.
 */
import { Xml } from '@atomist/rug/model/Xml'

export function addFilterEntry(filterXml : Xml, path : string) : void {
    filterXml.addChildNode("/workspaceFilter", "filter", `<filter root="${path}"/>`);
}