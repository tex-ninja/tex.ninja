export const welcome = encodeURIComponent(
  `

# $\\TeX$.ninja

## Text

- plain
- *bold*
- /italic/
- _underline_

## math

Inline $a \\leq b$ or block:

$$
\\int \\frac{1}{x}\\;dx = \\ln|x| + C
$$

## Image

\\center
![](https://goo.gl/Lm4Qfc)

\\begin{tikzpicture}

\\foreach[count=\\i] \\s in {60,120,...,360}{
  \\node[draw, circle](\\i) at (\\s:3) {$\\i$};
}
\\foreach \\i in {1,...,6}{
  \\foreach \\j in {1,...,6}{
    \\draw (\\i) to[bend right] (\\j);
  }
}

\\end{tikzpicture}
\\center


--

\\center
[TeX.ninja](https://tex.ninja) - write $\\LaTeX$ like a Ninja.
\\center


`
)