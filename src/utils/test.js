const genSelector = (selector) => `[data-test=${selector}]`;

export const findAll = (wrapper, selector) => {
    return wrapper.findAll(genSelector(selector));
}

export const find = (wrapper, selector) => {
    return wrapper.find(genSelector(selector));
}

export const contains = (wrapper, selector) => {
    return wrapper.contains(genSelector(selector));
}
