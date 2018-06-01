import * as katex from "katex";
import { Element, Env } from "texdown";
import { AbstractRenderer } from "./AbstractRenderer";
import { debounce, e } from "./util";

export class Html extends AbstractRenderer {

    cmd(name: string, arg: string): void {
        this.top().appendChild(e('div', {
            'data-cmd': name
            , 'data-arg': arg
        }))
    }

    startEnv(type: Env): void {
        this.push(e('div', { align: 'center' }))
    }

    endEnv(type: Env): void {
        while (this.top().tagName === 'p')
            this.pop()
        this.pop()
    }

    hr(): void {
        this.clear()
        this.top().appendChild(e('hr'))
    }

    sync(el: HTMLElement, id: number) {
        el.setAttribute('data-sync', String(id))
    }

    startElement(type: Element, id: number) {
        const el = e(type)
        this.dirAuto(type, el)
        this.sync(el, id)
        this.push(el)
    }

    endElement(type: Element) {
        this.pop()
    }

    esc(val: string) {
        this.txt(val[0])
    }

    txt(val: string) {
        const span = e('span')
        span.innerText = val
        this.top().appendChild(span)
    }

    eol() { }

    blank() { }

    a(title: string, href: string, id: number) {
        const a = e('a', {
            href: href
            , target: '_blank'
        })
        this.sync(a, id)
        a.innerText = title || href
        this.top().appendChild(a)
    }

    img(title: string, src: string, id: number) {
        const img = e('img', {
            src: src
        })
        this.sync(img, id)
        this.top().appendChild(img)
    }


    $(tex: string, id: number) {
        const span = e('span')
        katex.render(tex, span, {
            throwOnError: false
        })
        this.sync(span, id)
        this.top().appendChild(span)
    }

    $$(tex: string, id: number) {
        const span = e('span')
        katex.render(tex, span, {
            throwOnError: false
            , displayMode: true
        })
        this.sync(span, id)
        this.top().appendChild(span)
    }

    tikzCache = new Set()
    private tikzImg = debounce((src: string, img: HTMLImageElement) => {
        img.src = src
        this.tikzCache.add(src)
    }, 2000)

    tikz(tikz: string, id: number) {
        const img = e('img', { 'class': 'tikz' }) as HTMLImageElement
        img.alt = 'Generating tikz...'
        this.top().appendChild(img)
        this.sync(img, id)
        const src = `https://tikz.men/${encodeURIComponent(tikz)}`
        if (this.tikzCache.has(src)) img.src = src
        else this.tikzImg(src, img)
    }
}