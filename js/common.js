document.addEventListener('DOMContentLoaded', (event) => {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = `
        <a href="../index.html">Home</a>
        <a href="image-resizer.html">Image Resizer</a>
        <a href="color-palette.html">Color Palette</a>
        <a href="about.html">About</a>
    `;

    // Adjust links if we're on the homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        nav.innerHTML = nav.innerHTML.replace('../index.html', 'index.html');
        nav.innerHTML = nav.innerHTML.replace('image-resizer.html', 'pages/image-resizer.html');
        nav.innerHTML = nav.innerHTML.replace('color-palette.html', 'pages/color-palette.html');
        nav.innerHTML = nav.innerHTML.replace('about.html', 'pages/about.html');
    }
});
