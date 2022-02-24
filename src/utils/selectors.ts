import isNode from "./isNode";


function $(selector: string | Node, root = document): Node | null {
    if (isNode(selector)) {
        return selector as Node
    }
    return root.querySelector(selector as string)
}

function $$(selector: string | Node, root: Document = document): NodeListOf<Node> | Array<Node> {
    if (isNode(selector)) {
        return [selector as Node]
    }
    return root.querySelectorAll(selector as string)
}

export {$, $$}