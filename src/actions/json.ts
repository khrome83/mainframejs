type ActionJson = (url: string) => any;

const json: ActionJson = (url) => {
    return fetch(url)
        .then(response => response.json());
};

export { json as default, ActionJson };