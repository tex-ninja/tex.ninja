import { Element, Env } from "texdown";
import { AbstractRenderer } from "./AbstractRenderer";
import { e } from "./util";

type token =
    Element
    | '' | '$' | '$$' | 'tikz' | 'a' | 'img'
    | 'hr'
    | 'env'
    | 'cmd'

export class Syntax extends AbstractRenderer {
    cmd(name: string, arg: string): void {
        const cmd = this.token('cmd')
        cmd.innerText = `\\${name}{${arg}}`
        this.top().appendChild(cmd)
    }

    private token(
        type: token, id?: number) {
        const el = e('span', {
            'data-type': type
        })
        if (id)
            el.setAttribute('data-sync', String(id))
        return el
    }

    private newLine() {
        const div = e('div')
        div.dir = 'auto'
        div.className = 'line'
        return div
    }


    hr() {
        this.clear()
        const hr = this.token('hr')
        hr.innerText = '--'
        this.top().appendChild(hr)
    }


    startElement(type: Element, id: number) {
        const el = this.token(type, id)
        this.dirAuto(type, el)
        this.push(el)

        if (type === 'p' || type === 'li')
            this.push(this.newLine())
    }

    endElement(type: Element) {
        this.pop()

        if (type === 'p' || type === 'li') {
            const p = this.top()
            p.removeChild(p.lastChild as Node)
            this.pop()
        }
    }

    startEnv(type: Env): void {
        const env = this.token('env')
        env.innerText = `\\${type}`
        this.top().appendChild(env)
    }

    endEnv(type: Env): void {
        const env = this.token('env')
        env.innerText = `\\${type}`
        env.className = 'end'
        this.top().appendChild(env)
    }

    esc(val: string) {
        this.txt(val)
    }

    txt(val: string) {
        const txt = this.token('')
        txt.innerText = val
        this.top().appendChild(txt)
    }

    eol() {
        if (this.top().className === 'line') {
            this.pop()
            this.push(this.newLine())
        }
    }

    blank() {
        this.top().appendChild(e('br'))
    }

    a(title: string, href: string, id: number) {
        const a = this.token('a', id)
        a.innerText = `[${title}](${href})`
        this.top().appendChild(a)
    }

    img(title: string, src: string, id: number) {
        const img = this.token('img', id)
        img.innerText = `![${title}](${src})`
        this.top().appendChild(img)
    }

    $(tex: string, id: number) {
        const $ = this.token('$', id)
        $.innerText = tex
        this.top().appendChild($)
    }

    $$(tex: string, id: number) {
        const $$ = this.token('$$', id)
        $$.innerHTML = tex
        this.top().appendChild($$)
    }

    tikz(val: string, id: number) {
        const tikz = this.token('tikz', id)
        tikz.innerText = val
        this.top().appendChild(tikz)
    }
}