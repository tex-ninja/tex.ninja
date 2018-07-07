import { texDown } from 'texdown';
import { Html } from '../Html';
import { Syntax } from '../Syntax';
import { readHash, debounce } from '../util';
import { welcome } from '../welcome';
import { SyncCol } from '../SyncCol';

document.addEventListener('DOMContentLoaded', () => {
    const get = (id: string) => document.getElementById(id) as HTMLElement
    const input = get('input') as HTMLTextAreaElement
    const editor = get('editor') as HTMLDivElement
    const output = get('output') as HTMLDivElement

    const editorCol = new SyncCol(
        get('lcol'), (dataSync, down) => {
            viewCol.scrollTo(dataSync, down)
            console.log(dataSync, down)
        })

    const viewCol = new SyncCol(
        get('rcol'), (dataSync, down) => {
            editorCol.scrollTo(dataSync, down)
            console.log(dataSync, down)
        })

    const html = new Html()
    const syntax = new Syntax()
    const update = () => {
        viewCol.pause()
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


    input.value = readHash()
    editor.focus()

    window.onhashchange = update
    update()
})

