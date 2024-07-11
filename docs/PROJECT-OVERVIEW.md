1. Root Directory:

--- START OF index.html ---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Services Hub</title>
    <link rel="stylesheet" href="css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1 class="neon-text">Digital Services Hub</h1>
        
        <nav id="main-nav"></nav>
        <div class="content">
            <p class="welcome-text">Welcome to our Digital Services Hub!</p>
            <p>We offer a range of free tools to help with your digital media needs:</p>
            
            <ul class="services-list">
                <li><a href="pages/image-resizer.html">Futuristic Image Resizer</a></li>
                <li><a href="pages/color-palette.html">Color Palette Generator</a></li>
                <li><a href="pages/ascii-art.html">ASCII Art Converter</a></li>
                <li><a href="pages/qr-generator.html">QR Code Generator</a></li>
            </ul>
            <p class="cta-text">Choose a service above to get started, or visit our <a href="pages/about.html">About page</a> to learn more.</p>
        </div>
    </div>
    <script src="js/common.js"></script>
</body>
</html>
--- END OF index.html ---

--- START OF LICENSE ---
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
--- END OF LICENSE ---

Now, let's move to the CSS directory:

2. CSS Directory:

--- START OF styles.css ---
body {
    font-family: 'Roboto', sans-serif;
    background-color: #0c0c0c;
    color: #ffffff;
    line-height: 1.6;
    margin: 0;
    padding: 0;
}

.container {
    width: 80%;
    margin: auto;
    overflow: hidden;
    padding: 20px;
}

h1, h2, h3 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 20px;
}

.neon-text {
    color: #fff;
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de;
}

nav {
    background: #1a1a1a;
    padding: 10px 0;
}

nav a {
    color: #ffffff;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0 5px;
    transition: 0.3s;
}

nav a:hover {
    background: #ff00de;
    border-radius: 5px;
}

.content {
    background: #1a1a1a;
    padding: 20px;
    margin-top: 20px;
    border-radius: 5px;
}

.welcome-text {
    font-size: 1.5em;
    margin-bottom: 20px;
}

.services-list {
    list-style-type: none;
    padding: 0;
}

.services-list li {
    margin-bottom: 10px;
}

.services-list a {
    color: #00ffff;
    text-decoration: none;
    transition: 0.3s;
}

.services-list a:hover {
    color: #ff00de;
}

.cta-text {
    margin-top: 20px;
    font-style: italic;
}

/* Add more styles as needed for specific pages */
--- END OF styles.css ---

--- START OF ascii-art.css ---
/* Styles specific to the ASCII Art page */
.ascii-container {
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    padding: 20px;
    margin-top: 20px;
}

#input-text, #output-ascii {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #ffffff;
    font-family: monospace;
}

#output-ascii {
    white-space: pre;
    overflow-x: auto;
}

#convert-button {
    background: #ff00de;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;
}

#convert-button:hover {
    background: #00ffff;
    color: #0c0c0c;
}
--- END OF ascii-art.css ---

--- START OF color-palette.css ---
/* Styles specific to the Color Palette Generator page */
.palette-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;
}

.color-swatch {
    width: 100px;
    height: 100px;
    margin: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    color: #ffffff;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
}

#generate-button {
    background: #ff00de;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 20px;
}

#generate-button:hover {
    background: #00ffff;
    color: #0c0c0c;
}
--- END OF color-palette.css ---

--- START OF image-resizer.css ---
/* Styles specific to the Image Resizer page */
.resizer-container {
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    padding: 20px;
    margin-top: 20px;
}

#image-input, #width, #height {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #ffffff;
}

#resize-button {
    background: #ff00de;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;
}

#resize-button:hover {
    background: #00ffff;
    color: #0c0c0c;
}

#output-image {
    max-width: 100%;
    height: auto;
    margin-top: 20px;
    border: 1px solid #2a2a2a;
}

#download-link {
    display: inline-block;
    margin-top: 10px;
    color: #00ffff;
    text-decoration: none;
}

#download-link:hover {
    color: #ff00de;
}
--- END OF image-resizer.css ---

--- START OF qr-generator.css ---
/* Styles specific to the QR Code Generator page */
.qr-container {
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    padding: 20px;
    margin-top: 20px;
}

#qr-text {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #ffffff;
}

#generate-button {
    background: #ff00de;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;
}

#generate-button:hover {
    background: #00ffff;
    color: #0c0c0c;
}

#qr-code {
    margin-top: 20px;
    text-align: center;
}

#qr-code img {
    max-width: 100%;
    height: auto;
}
--- END OF qr-generator.css ---

That covers the CSS directory. Would you like me to continue with the JavaScript (js) directory next?