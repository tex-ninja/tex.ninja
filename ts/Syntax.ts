import { Element, ElementType } from "texdown";
import { AbstractRenderer } from "./AbstractRenderer";
import { e } from "./util";

type TokenType =
    ElementType
    | '' | '$' | '$$' | 'tikz' | 'a' | 'img'
    | 'hr'
    | 'env-s' | 'env-e'
    | 'cmd'
    | '-'

const multiline = ['p', 'li']
const inline = ['b', 'u', 'i']

export class Syntax extends AbstractRenderer {
    private append(type: TokenType, id?: number) {
        const el = e('span', {
            'data-type': type
        })

        if (id) {
            el.setAttribute('data-sync', String(id))
        }

        this.top().appendChild(el)

        return el
    }

    private appendAndSetText(type: TokenType, val: string, id?: number) {
        const el = this.append(type, id)
        el.innerHTML = val
        return el
    }

    private appendAndPush(type: TokenType, id?: number) {
        const el = this.append(type, id)
        this.push(el)
        if (multiline.includes(type)) this.pushLine()
        return el
    }

    hr() {
        this.clear()
        this.appendAndSetText('hr', '--')
    }


    private pushLine() {
        const div = e('div')
        div.dir = 'auto'
        div.className = 'line'
        this.push(div)
    }

    private popLines() {
        while (this.top().className === 'line') this.pop()
    }

    startElement(e: Element, id: number) {
        console.log('<', e.type)
        const type = e.type

        if (!inline.includes(type)
            && !multiline.includes(type)) {
            this.pushLine()
        }

        this.appendAndPush(type, id)
        if (e.type === 'li') this.appendAndSetText('-', e.token)
    }

    endElement(e: Element) {
        console.log(e.type, '>')
        while (this.top().getAttribute('data-type') !== e.type) this.pop()
        this.pop()
    }

    startEnv(name: string): void {
        console.log('<', name)
        const env = this.appendAndSetText('env-s', `\\${name}`)
        this.top().appendChild(env)
    }

    endEnv(name: string): void {
        console.log(name, '>')
        const env = this.appendAndSetText('env-e', `\\${name}`)
        this.top().appendChild(env)
    }

    esc(val: string) {
        this.txt(val)
    }

    txt(val: string) {
        console.log('t', val, val.indexOf('\n'))
        this.top().appendChild(this.appendAndSetText('', val))
    }

    eol() {
        console.log('eol')
        this.popLines()
        this.pushLine()
    }

    blank() {
        this.clear()
        this.top().appendChild(e('br'))
    }

    a(title: string, href: string, id: number) {
        console.log('a')
        this.appendAndSetText('a', `[${title}](${href})`, id)
    }

    img(title: string, src: string, id: number) {
        this.appendAndSetText('img', `![${title}](${src})`, id)
    }

    $(tex: string, id: number) {
        this.appendAndSetText('$', tex, id)
    }

    $$(tex: string, id: number) {
        this.appendAndSetText('$$', tex, id)
    }

    tikz(val: string, id: number) {
        console.log('tikz')
        this.appendAndSetText('tikz', val, id)
    }

    cmd(name: string, arg: string): void {
        this.appendAndSetText('cmd', `\\${name}{${arg}}`)
    }
}