import React from 'react'
import theme from '../../utils/theme'

const baseCss = `
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${theme.palette.background.main};
    color: ${theme.palette.primary.main};
    font-family: JetBrains Mono, monospace;
  }
  
  h1, h2, h3 {
    font-weight: 400;
    color: ${theme.palette.primary.main};
    text-transform: uppercase;
    font-family: Goldman, sans-serif;
    font-size: 3.25rem;
    text-shadow: ${theme.glow};
  }
  h2 {
    font-size: 2.25rem;
  }
  h3 {
    font-size: 2rem;
  }

  button {
    white-space: nowrap;
  }
`

const Template = ({
  jsBundle,
  title,
  description,
  cssString,
  htmlString = '',
}) => {
  return (
    <html>
      <head>
        <title>{title || ''}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta description={description || ''} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300&family=Major+Mono+Display&display=swap"
          rel="stylesheet"
        />
        <style>{baseCss}</style>
        <style>{cssString}</style>
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: htmlString }}></div>
        <script src={jsBundle || ''} />
      </body>
    </html>
  )
}

export default Template
