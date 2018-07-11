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
        const cmd = this.dataType('cmd', `\\${name}{${arg}}`)
        this.top().appendChild(cmd)
    }

    private token(val: string) {
        const tok = e('span')
        tok.className = 'token'
        tok.innerHTML = val
        return tok
    }

    private dataType(type: TokenType, val: string, id?: number) {
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
        const hr = this.dataType('hr', '--')
        this.top().appendChild(hr)
    }


    startElement(e: Element, id: number) {
        const type = e.type
        console.log(e)
        const el = this.dataType(type, e.token, id)
        this.push(el)
    }

    endElement(e: Element) {
        if (!['li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(e.type)) {
            this.top().appendChild(this.token(e.token))
        }
        this.pop()
    }

    startEnv(type: Env): void {
        const env = this.dataType('env-s', `\\${type}`)
        this.top().appendChild(env)
    }

    endEnv(type: Env): void {
        const env = this.dataType('env-e', `\\${type}`)
        this.top().appendChild(env)
    }

    esc(val: string) {
        this.txt(val)
    }

    txt(val: string) {
        const txt = this.dataType('', val)
        txt.innerText = val
        this.top().appendChild(txt)
    }

    eol() {
        if (['li', 'p'].includes(
            String(this.top().getAttribute('data-type')))) {
            this.blank()
        }
    }

    blank() {
        this.top().appendChild(e('br'))
    }

    a(title: string, href: string, id: number) {
        const a = this.dataType('a', `[${title}](${href})`, id)
        this.top().appendChild(a)
    }

    img(title: string, src: string, id: number) {
        const img = this.dataType('img', `![${title}](${src})`, id)
        this.top().appendChild(img)
    }

    $(tex: string, id: number) {
        const $ = this.dataType('$', tex, id)
        this.top().appendChild($)
    }

    $$(tex: string, id: number) {
        const $$ = this.dataType('$$', tex, id)
        this.top().appendChild($$)
    }

    tikz(val: string, id: number) {
        const tikz = this.dataType('tikz', val, id)
        this.top().appendChild(tikz)
    }
}