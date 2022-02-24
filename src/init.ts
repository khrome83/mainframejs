import {$$} from "./utils/selectors";
import setTextContent from "./utils/setTextContent";
type component = {
    on: () => void;
    json: () => void;
    assign: () => void;
}

type callback = (arg0: component) => void

function createComponent(cb: callback = () => {}): component {
    const on = () => {
        console.log('called on')
    }
    const json = () => {
        console.log('called json')
    }
    const assign = () => {
        console.log('called assign')
    }

    const component = {
        on,
        json,
        assign,
    };

    cb(component);

    return component
}

function Mainframe(selector: string, cb: callback) {
    console.log('called Mainframe')
    console.log(selector)
    console.log(cb)
    createComponent(cb);
}

export default function(): void {
    const PUBLIC_API = Object.keys(createComponent());

    // await new Promise<void>((resolve) => {
    //     if (document.readyState == "loading") {
    //         //@ts-ignore
    //         document.addEventListener("DOMContentLoaded", resolve)
    //     } else {
    //         resolve()
    //     }
    // })

    window['Mainframe'] = Mainframe

    const mainframeTags = $$("script[type=mainframe]")

    for (const mainframeScript of mainframeTags as HTMLScriptElement[]) {
        const selector = mainframeScript.dataset.fluorSelector
        const scriptTag = document.createElement("script")

        // External Script Src (May Bring Back)
        // if (mainframeScript.hasAttribute("src")) {
        //     try {
        //         const scriptUrl = mainframeScript.getAttribute("src")
        //         const response = await fetch(scriptUrl)
        //         if (response.status >= 400) {
        //             throw new Error(`Unable to load Fluor script at ${scriptUrl}`)
        //         }
        //         const remoteScript = await response.text()
        //         setTextContent(mainframeScript, remoteScript)
        //     } catch (error) {
        //         setTextContent(
        //             mainframeScript,
        //             `console.error(${JSON.stringify(error.message)})`
        //         )
        //     }
        // }

        setTextContent(
            scriptTag,
            `Mainframe(${JSON.stringify(selector)}, async ({${PUBLIC_API.join(
                ","
            )}}) => {${mainframeScript.textContent}})`
        )

        mainframeScript?.parentNode?.removeChild(mainframeScript)
        document.body.appendChild(scriptTag)
    }
}