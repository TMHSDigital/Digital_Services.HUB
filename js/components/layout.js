/**
 * Layout Injection System
 * Dynamically injects the header and footer to ensure consistency across pages.
 */

export function injectLayout() {
    const isSubPage = window.location.pathname.includes('/pages/');
    const basePath = isSubPage ? '../' : './';
    const homeLink = isSubPage ? '../index.html' : './index.html'; // Ensure we go to index.html explicitly
    
    // If we are on the home page, the anchors are just #id
    // If we are on a sub page, the anchors are ../index.html#id
    const getLink = (anchor) => isSubPage ? `../index.html${anchor}` : anchor;

    const headerHTML = `
    <nav id="main-nav" class="nav-container">
        <div class="logo">
            <a href="${homeLink}">
                <h1>Digital Services Hub</h1>
            </a>
        </div>
        <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
            <i class="fas fa-bars"></i>
        </button>
        <div class="nav-links">
            <a href="${getLink('#tools')}" class="nav-link">Tools</a>
            <a href="${getLink('#features')}" class="nav-link">Features</a>
            <a href="${getLink('#about')}" class="nav-link">About</a>
            <a href="https://github.com/TMHDigital/Digital_Services.HUB" class="nav-link" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
            </a>
        </div>
        <div class="theme-toggle">
            <button id="theme-button" aria-label="Toggle theme">
                <i class="fas fa-moon"></i>
            </button>
        </div>
    </nav>
    `;

    const footerHTML = `
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Digital Services Hub</h4>
                <p>Free web-based tools for everyday digital tasks.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="${getLink('#tools')}">Tools</a></li>
                    <li><a href="${getLink('#features')}">Features</a></li>
                    <li><a href="${getLink('#about')}">About</a></li>
                    <li><a href="https://github.com/TMHDigital/Digital_Services.HUB">GitHub</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Use</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Digital Services Hub. All rights reserved.</p>
        </div>
    </footer>
    `;

    // Inject Header at the start of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Inject Footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

