import { debounce } from "./util";

const firstVisibleKid = (el: HTMLElement): HTMLElement => {
    const scrollTop = el.scrollTop
    const kids = el.querySelectorAll('[data-sync]')
    for (let i = 0; i < kids.length; i++) {
        const e = kids.item(i) as HTMLElement
        if (e.offsetTop > scrollTop) return e
    }
    return kids.item(kids.length - 1) as HTMLElement
}

const lastVisibleKid = (el: HTMLElement): HTMLElement => {
    const scrollTop = el.scrollTop + el.clientHeight
    const kids = el.querySelectorAll('[data-sync]')
    for (let i = 0; i < kids.length; i++) {
        const e = kids.item(i) as HTMLElement
        if (e.offsetTop + e.scrollHeight > scrollTop)
            return kids.item(i - 1) as HTMLElement
    }
    return kids.item(kids.length - 1) as HTMLElement
}

const highlight = (...elms: HTMLElement[]) => {
    elms.forEach(e => e.className = 'highlight')
    setTimeout(() => {
        elms.forEach(e => e.className = '')
    }, 2000);
}

export function sync(e1: HTMLElement, e2: HTMLElement) {

    let e1ScrollTop = e1.scrollTop
    let e2ScrollTop = e2.scrollTop

    const e1OnScroll = debounce(() => {
        let down = e1ScrollTop < e1.scrollTop
        e1ScrollTop = e1.scrollTop
        e2.removeEventListener('scroll', e2OnScroll)
        const kid = down
            ? lastVisibleKid(e1)
            : firstVisibleKid(e1)

        const brother = e2.querySelector(
            `[data-sync="${kid.getAttribute('data-sync')}"]`
        ) as HTMLElement | null

        if (brother !== null) {
            highlight(kid, brother)
            brother.scrollIntoView({
                block: down ? 'end' : 'start'
                , inline: 'nearest'
                , behavior: 'smooth'
            })
        }
    }, 300)

    const e2OnScroll = debounce(() => {
        let down = e2ScrollTop < e2.scrollTop
        e2ScrollTop = e2.scrollTop
        e1.removeEventListener('scroll', e1OnScroll)
        const kid = down
            ? lastVisibleKid(e2)
            : firstVisibleKid(e2)

        const brother = e1.querySelector(
            `[data-sync="${kid.getAttribute('data-sync')}"]`
        ) as HTMLElement | null

        if (brother !== null) {
            highlight(kid, brother)
            brother.scrollIntoView({
                block: down ? 'end' : 'start'
                , inline: 'nearest'
                , behavior: 'smooth'
            })
        }
    }, 300)

    e1.addEventListener('scroll', debounce(() => {
        e1.addEventListener('scroll', e1OnScroll)
    }, 300))

    e2.addEventListener('scroll', debounce(() => {
        e2.addEventListener('scroll', e2OnScroll)
    }, 300))

    e1.addEventListener('scroll', e1OnScroll)
    e2.addEventListener('scroll', e2OnScroll)
}