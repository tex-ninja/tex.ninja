import { debounce } from "./util";

const highlight = (e: HTMLElement) => {
    e.className = 'highlight'
    setTimeout(() => {
        e.className = ''
    }, 2000);
}

export class SyncCol {
    e: HTMLElement
    scrollTop: number
    onScroll: () => void;

    constructor(e: HTMLElement, onScroll: (dataSync: number, down: boolean) => void) {
        this.e = e
        this.scrollTop = e.scrollTop
        this.onScroll = debounce(() => {
            let down = this.scrollTop < this.e.scrollTop
            this.scrollTop = this.e.scrollTop

            const kid = down
                ? this.lastVisibleKid()
                : this.firstVisibleKid()

            highlight(kid)
            onScroll(parseInt(kid.getAttribute('data-sync') as string), down)
        }, 300)

        e.addEventListener('scroll', debounce(() => {
            console.log('adding....', this.e.id)
            e.addEventListener('scroll', this.onScroll)
        }, 300))
    }

    firstVisibleKid = (): HTMLElement => {
        const scrollTop = this.e.scrollTop
        const kids = this.e.querySelectorAll('[data-sync]')
        for (let i = 0; i < kids.length; i++) {
            const e = kids.item(i) as HTMLElement
            if (e.offsetTop > scrollTop) return e
        }
        return kids.item(kids.length - 1) as HTMLElement
    }

    lastVisibleKid = (): HTMLElement => {
        const scrollTop = this.e.scrollTop + this.e.clientHeight
        const kids = this.e.querySelectorAll('[data-sync]')
        for (let i = 0; i < kids.length; i++) {
            const e = kids.item(i) as HTMLElement
            if (e.offsetTop + e.scrollHeight > scrollTop)
                return kids.item(i - 1) as HTMLElement
        }
        return kids.item(kids.length - 1) as HTMLElement
    }

    public pause() {
        console.log('pause', this.e.id)
        this.e.removeEventListener('scroll', this.onScroll)
    }

    public scrollTo(dataSync: number, down: boolean) {
        const e = this.e.querySelector(
            `[data-sync="${dataSync}"]`
        ) as HTMLElement | null

        console.log('scrollTo', dataSync, e)
        if (e === null) return

        highlight(e)
        this.pause()
        e.scrollIntoView({
            behavior: 'smooth'
        })
    }
}