import { highlightParts } from "./search.js";
export function contentHighlights({query}) {
  return tree => {
    const visit = node => {
      if (!node.children || ["code","inlineCode"].includes(node.type)) return;
      node.children=node.children.flatMap(child=>{
        if(child.type!=="text"){visit(child);return [child];}
        return highlightParts(child.value,query).map(part=>part.matched
          ? {type:"strong",data:{hName:"mark"},children:[{type:"text",value:part.text}]}
          : {type:"text",value:part.text});
      });
    };
    visit(tree);
  };
}
