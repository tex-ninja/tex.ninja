import { Element, Env, ElementType } from "texdown";
import { AbstractRenderer } from "./AbstractRenderer";
import { e } from "./util";

type TokenType =
    ElementType
    | '' | '$' | '$$' | 'tikz' | 'a' | 'img'
    | 'hr'
    | 'env-s' | 'env-e'
    | 'cmd'

export class Syntax extends AbstractRenderer {
    cmd(name: string, arg: string): void {
        const cmd = this.element('cmd', `\\${name}{${arg}}`)
        this.top().appendChild(cmd)
    }

    private token(val: string) {
        const tok = e('span')
        tok.className = 'token'
        tok.innerHTML = val
        return tok
    }

    private element(type: TokenType, val: string, id?: number) {
        const dt = e('span', {
            'data-type': type
        })

        dt.appendChild(this.token(val))

        if (id)
            dt.setAttribute('data-sync', String(id))

        return dt
    }

    hr() {
        this.clear()
        const hr = this.element('hr', '--')
        this.top().appendChild(hr)
    }


    private pushDirAutoBlock() {
        const div = e('div')
        div.dir = 'auto'
        div.className = 'dir-auto'
        this.push(div)
    }

    private popDirAutoBlocks() {
        while (this.top().className === 'dir-auto') this.pop()
    }

    startElement(e: Element, id: number) {
        console.log('<', e.type)
        if (!['b', 'i', 'u'].includes(e.type)) {
            this.pushDirAutoBlock()
        }
        const type = e.type
        const el = this.element(type, e.token, id)
        this.push(el)
    }

    endElement(e: Element) {
        console.log(e.type, '>')
        if (!['li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(e.type)) {
            this.top().appendChild(this.token(e.token))
        }
        this.popDirAutoBlocks()
        this.pop()
        this.popDirAutoBlocks()
    }

    startEnv(type: Env): void {
        console.log('<', type)
        const env = this.element('env-s', `\\${type}`)
        this.top().appendChild(env)
    }

    endEnv(type: Env): void {
        console.log(type, '>')
        const env = this.element('env-e', `\\${type}`)
        this.top().appendChild(env)
    }

    esc(val: string) {
        this.txt(val)
    }

    txt(val: string) {
        console.log('t', val)
        this.top().appendChild(this.element('', val))
    }

    eol() {
        console.log('eol')
        this.popDirAutoBlocks()
        const dataType = this.top().getAttribute('data-type')
        if (dataType && ['p', 'li'].includes(dataType)) {
            this.pushDirAutoBlock()
        }
    }

    blank() {
        this.top().appendChild(e('br'))
    }

    a(title: string, href: string, id: number) {
        console.log('a')
        const a = this.element('a', `[${title}](${href})`, id)
        this.top().appendChild(a)
    }

    img(title: string, src: string, id: number) {
        const img = this.element('img', `![${title}](${src})`, id)
        this.top().appendChild(img)
    }

    $(tex: string, id: number) {
        const $ = this.element('$', tex, id)
        this.top().appendChild($)
    }

    $$(tex: string, id: number) {
        this.pushDirAutoBlock()
        const $$ = this.element('$$', tex, id)
        this.top().appendChild($$)
    }

    tikz(val: string, id: number) {
        const tikz = this.element('tikz', val, id)
        this.top().appendChild(tikz)
    }
}