export function initializeTheme() {
    const themeButton = document.getElementById('theme-button');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeButton.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Theme toggle functionality
    themeButton.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        const icon = themeButton.querySelector('i');
        
        if (isDark) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Handle system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                themeButton.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            } else {
                document.body.classList.remove('dark-theme');
                themeButton.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            }
        }
    });
} 