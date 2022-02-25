import json, { ActionJson } from './json'
import on from './on'
import assign from './assign'
import { $, $$, ActionSingleSelector, ActionMultiSelector}  from "../utils/selectors"

export type Actions = {
    on: () => void;
    json: ActionJson;
    assign: () => void;
    $: ActionSingleSelector;
    $$: ActionMultiSelector;
}

const actions: Actions = {
    on,
    json,
    assign,
    $,
    $$,
}

export default actions