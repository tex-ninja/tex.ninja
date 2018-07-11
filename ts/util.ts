export const readHash = (): string =>
    decodeURIComponent(window.location.hash.substr(1))

const excludeDirAuto = ['b', 'u', 'i', 'li']

export const e = (name: any, atts: { [key: string]: string } = {}) => {
    const e = document.createElement(name) as HTMLElement
    for (let k in atts) e.setAttribute(k, atts[k])

    if (!excludeDirAuto.includes(name)) {
        e.dir = 'auto'
    }

    return e
}

export function debounce<F extends (...args: any[]) => void>(
    f: F
    , timeout: number): F {
    let to: any
    return ((...args: any[]) => {
        clearTimeout(to);
        to = setTimeout(() => {
            f(...args)
        }, timeout)
    }) as any
}