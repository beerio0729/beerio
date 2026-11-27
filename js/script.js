function initSite() {
    const siteHeader = document.getElementById('siteHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    // 1. เพิ่มเงาให้ Header เมื่อเลื่อนหน้าจอลง
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });

    // 2. เปิด-ปิดเมนูหลักบนมือถือ / แท็บเล็ต
    mobileToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        mobileToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    // 3. รองรับการกดเปิด-ปิด Multi-layer Dropdown บนหน้าจอเล็ก (<= 860px)
    const dropdownTriggers = document.querySelectorAll('.has-dropdown > .nav-link, .has-submenu > .dropdown-link');

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 860) {
                e.preventDefault();
                const parentItem = trigger.parentElement;

                // ปิดเมนูระดับเดียวกันตัวอื่นที่เปิดค้างอยู่
                const siblings = parentItem.parentElement.children;
                Array.from(siblings).forEach(sibling => {
                    if (sibling !== parentItem) {
                        sibling.classList.remove('active');
                    }
                });

                parentItem.classList.toggle('active');
            }
        });
    });

    // 4. ปิดเมนูมือถืออัตโนมัติเมื่อคลิกลิงก์ปลายทาง
    const allNavLinks = document.querySelectorAll('.main-nav a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const parent = link.parentElement;
            const isTriggerOnMobile = window.innerWidth <= 860 &&
                (parent.classList.contains('has-dropdown') || parent.classList.contains('has-submenu'));

            if (!isTriggerOnMobile && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    });

    //5. ถ้ามี has-dropdown ให้สร้างลูกศรชีขวา
    let hasDropdown = document.querySelectorAll('.nav-item.has-dropdown');
    hasDropdown.forEach(item => {

        const link = item.querySelector(':scope > .nav-link');
        if (link && !link.querySelector('.sub-arrow')) {
            const arrow = document.createElement('i');

            arrow.className = 'fa-solid fa-chevron-down arrow-icon';

            link.appendChild(arrow);
        }

    });

    //6. ถ้ามี has-submenu ให้สร้างลูกศรชีขวา
    let hasSubmenu = document.querySelectorAll('.dropdown-item.has-submenu');

    hasSubmenu.forEach(item => {
        const link = item.querySelector(':scope > .dropdown-link');

        if (link && !link.querySelector('.sub-arrow')) {
            const arrow = document.createElement('i');

            arrow.className = window.innerWidth <= 860
                ? 'fa-solid fa-chevron-down sub-arrow'
                : 'fa-solid fa-chevron-right sub-arrow';

            link.appendChild(arrow);
        }
    });

    // 7. รีเซ็ตสถานะเมนูเมื่อขยายจอกลับเป็น Desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            mainNav.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            document.querySelectorAll('.has-dropdown.active, .has-submenu.active').forEach(el => {
                el.classList.remove('active');
            });
        }
    });

    // 8. สลับเปิด-ปิด Grid แพ็กเกจ รายเดือน / รายปี
    const billingTabs = document.querySelectorAll('.billing-tab');
    const billingPanels = document.querySelectorAll('.pricing-grid[data-billing-panel]');

    billingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.billing;

            billingTabs.forEach(t => t.classList.toggle('active', t === tab));
            billingPanels.forEach(panel => {
                panel.classList.toggle('active', panel.dataset.billingPanel === mode);
            });
        });
    });
} // <-- ปิด initSite() ตรงนี้

// script.js ถูกโหลดหลัง DOMContentLoaded (โดย include.js) จึงต้องเช็กสถานะก่อน
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
} else {
    initSite();
}