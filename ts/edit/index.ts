import { texDown } from 'texdown';
import { Html } from '../Html';
import { Syntax } from '../Syntax';
import { sync } from '../sync';
import { readHash } from '../util';
import { welcome } from '../welcome';

document.addEventListener('DOMContentLoaded', () => {
    const get = (id: string) => document.getElementById(id)
    const input = get('input') as HTMLTextAreaElement
    const editor = get('editor') as HTMLDivElement
    const output = get('output') as HTMLDivElement

    const html = new Html()
    const syntax = new Syntax()
    const update = () => {
        syntax.reset()
        html.reset()
        const tex = readHash() + '\n'
        texDown(tex, html, syntax)
        requestAnimationFrame(() => {
            window.parent.postMessage(tex, '*')
            editor.innerHTML = ''
            editor.appendChild(syntax.root)
            output.innerHTML = ''
            output.appendChild(html.root)
            input.style.height = (editor.scrollHeight + 40) + 'px'
        })
    }

    input.addEventListener('keydown', (e) => {
        if (e.keyCode !== 9) return
        var start = input.selectionStart;
        var end = input.selectionEnd;

        var value = input.value

        const space = '  '
        input.value = value.substring(0, start)
            + space
            + value.substring(end)

        input.selectionStart = input.selectionEnd = start + space.length;
        e.preventDefault();
        window.location.hash = encodeURIComponent(input.value)
    })

    input.addEventListener('input', () => {
        window.location.hash = encodeURIComponent(input.value)
    })

    if (window.location.hash.length <= 1)
        window.location.hash = welcome


    sync(
        get('lcol') as HTMLElement
        , get('rcol') as HTMLElement
    )

    input.value = readHash()
    editor.focus()

    window.onhashchange = update
    update()
})

