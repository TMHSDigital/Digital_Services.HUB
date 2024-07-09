document.addEventListener('DOMContentLoaded', (event) => {
    const nav = document.getElementById('main-nav');
    const currentPath = window.location.pathname;

    const navItems = [
        { href: "index.html", text: "Home" },
        { href: "pages/image-resizer.html", text: "Image Resizer" },
        { href: "pages/color-palette.html", text: "Color Palette" },
        { href: "pages/ascii-art.html", text: "ASCII Art" },
        { href: "pages/qr-generator.html", text: "QR Code" },
        { href: "pages/about.html", text: "About" }
    ];

    const navHTML = navItems.map(item => {
        let href = item.href;
        if (currentPath.includes('/pages/')) {
            href = href.replace('pages/', '');
            if (item.href === 'index.html') {
                href = '../' + href;
            }
        } else if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
            if (item.href !== 'index.html') {
                href = 'pages/' + href.replace('pages/', '');
            }
        }
        return `<a href="${href}">${item.text}</a>`;
    }).join('');

    nav.innerHTML = navHTML;
});
