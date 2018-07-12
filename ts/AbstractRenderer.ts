import { Element, Env, Renderer, ElementType } from "texdown";
import { e } from "./util";

export abstract class AbstractRenderer implements Renderer {
    abstract startEnv(type: Env): void
    abstract endEnv(type: Env): void
    abstract hr(): void
    abstract startElement(type: Element, id: number): void
    abstract endElement(type: Element): void
    abstract txt(val: string): void
    abstract eol(): void
    abstract blank(): void
    abstract a(title: string, href: string, id: number): void
    abstract img(title: string, src: string, id: number): void
    abstract $(tex: string, id: number): void
    abstract $$(tex: string, id: number): void
    abstract tikz(tikz: string, id: number): void
    abstract cmd(name: string, arg: string): void
    abstract esc(val: string): void
    public done() { }
    root = e('div')
    stack: HTMLElement[] = [this.root]

    reset() {
        this.root.innerHTML = ''
        this.stack = [this.root]
    }

    top() {
        return this.stack[this.stack.length - 1]
    }

    push(e: HTMLElement) {
        this.top().appendChild(e)
        this.stack.push(e)
    }

    pop() {
        const e = this.stack.pop()
    }

    clear() {
        while (this.stack.length > 1) this.pop()
    }
}
