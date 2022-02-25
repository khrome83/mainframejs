import {$$} from "./utils/selectors";
import setTextContent from "./utils/setTextContent";
import actions, { Actions } from "./actions";


type callback = (arg0: Actions) => void

function createComponent(cb: callback = () => {}) {
    cb(actions);
}

function Mainframe(selector: string, cb: callback) {
    console.log('called Mainframe')
    console.log(`Selector - "${selector}"`)
    console.log('Callback', cb)
    createComponent(cb)
}

export default function(): void {
    const apiKeys = `{${Object.keys(actions).join(",")}}`

    window['Mainframe'] = Mainframe

    const scriptElements = $$(`script[type="mainframe"]`)
    let selector

    for (let i = 0; i < scriptElements.length; i++) {
        const id = Math.random().toString(36).slice(2)
        const parentElement = scriptElements[i].parentElement || document.body
        parentElement.dataset.mainframeId = id
        selector = `${parentElement.tagName.toLowerCase()}[data-mainframe-id="${id}"]`

        const scriptTag = document.createElement("script")

        setTextContent(
            scriptTag,
            `Mainframe(${JSON.stringify(selector)}, async (${apiKeys}) => {${scriptElements[i].textContent}})`
        )

        scriptElements[i]?.parentNode?.removeChild(scriptElements[i])
        document.body.appendChild(scriptTag)
    }
}