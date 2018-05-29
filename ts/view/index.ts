import { texDown } from 'texdown';
import { Html } from '../Html';
import { readHash } from '../util';

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content') as HTMLDivElement
    const html = new Html()
    texDown(readHash() + '\n', html)
    content.appendChild(html.root)
})