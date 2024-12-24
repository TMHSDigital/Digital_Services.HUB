document.addEventListener('DOMContentLoaded', (event) => {
    const nav = document.getElementById('main-nav');
    const currentPath = window.location.pathname;

    const navItems = [
        { href: "index.html", text: "Home" },
        { href: "pages/image-resizer.html", text: "Image Resizer" },
        { href: "pages/color-palette.html", text: "Color Palette" },
        { href: "pages/ascii-art.html", text: "ASCII Art" },
        { href: "pages/qr-generator.html", text: "QR Code" },
        { href: "pages/text-to-speech.html", text: "Text-to-Speech" },
        { href: "pages/about.html", text: "About" }
    ];

    // Helper function to normalize paths
    const normalizePath = (path) => path.replace(/\\/g, '/').toLowerCase();

    // Get the current page name for active state
    const currentPage = normalizePath(currentPath).split('/').pop();

    const navHTML = navItems.map(item => {
        let href = item.href;
        const isCurrentPage = normalizePath(href).endsWith(currentPage);
        
        // Adjust paths based on current location
        if (currentPath.includes('/pages/')) {
            href = href.replace('pages/', '');
            if (item.href === 'index.html') {
                href = '../' + href;
            }
        }

        // Add active class if current page
        const activeClass = isCurrentPage ? ' class="active"' : '';
        
        return `<a href="${href}"${activeClass}>${item.text}</a>`;
    }).join('');

    nav.innerHTML = navHTML;
});
