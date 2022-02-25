type ActionSingleSelector = (selector: string, root?: HTMLElement) => Element | null;

const $: ActionSingleSelector = (selector, root = document.body) => {
    return root.querySelector(selector)
}

type ActionMultiSelector = (selector: string, root?: HTMLElement) => NodeListOf<Element>;

const $$: ActionMultiSelector = (selector, root = document.body) => {
    return root.querySelectorAll(selector as string)
}

export {$, $$, ActionSingleSelector, ActionMultiSelector}