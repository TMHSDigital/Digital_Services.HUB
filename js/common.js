document.addEventListener('DOMContentLoaded', () => {
    const navItems = [
        { name: 'Home', url: 'index.html' },
        { name: 'Image Resizer', url: 'pages/image-resizer.html' },
        { name: 'Color Palette', url: 'pages/color-palette.html' },
        { name: 'About', url: 'pages/about.html' }
    ];

    const nav = document.getElementById('main-nav');
    if (nav) {
        const ul = document.createElement('ul');
        ul.classList.add('flex', 'justify-center', 'space-x-4');

        navItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.classList.add('text-blue-400', 'hover:text-blue-300');
            a.textContent = item.name;
            li.appendChild(a);
            ul.appendChild(li);
        });

        nav.appendChild(ul);
    }
});
