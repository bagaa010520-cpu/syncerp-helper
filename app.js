function renderMenu(menu) {

    let contentHtml = menu.key ? `
        <div class="menu-title" onclick="toggleMenu('${menu.key}', this)">
            + ${menu.title}
        </div>
    `: `<div class="menu-title">
            + ${menu.title}
        </div>`;

    if (!menu.children || menu.children.length === 0) {
        return `
            <div class="menu-item" onclick="navigate('${menu.key}')">
                ${menu.title}
            </div>
        `;
    }

    let childContentHtml = `<div class="menu" id="${menu.key}" style="display:none;">`;

    menu.children.forEach((menuChild) => {
        childContentHtml += renderMenu(menuChild);
    });

    childContentHtml += `</div>`;

    return contentHtml + childContentHtml;
}

// Sidebar гаргах функц
async function loadSidebar() {
    const sidebarDiv = document.getElementById('sidebar');
    try {

        const response = await fetch('./constants/menu.json');
        const menuList = await response.json();

        let html = ``;

        menuList.forEach((menu) => {
            html += renderMenu(menu);
        });

        sidebarDiv.innerHTML = html;

    } catch (error) {
        console.error(error);
        sidebarDiv.innerHTML = "Menu ачаалахад алдаа гарлаа";
    }
}

function toggleMenu(id, element) {
    let menu = document.getElementById(id);
    if (menu.style.display === "block") {
        menu.style.display = "none";
        element.innerHTML = element.innerHTML.replace("-", "+");
    } else {
        menu.style.display = "block";
        element.innerHTML = element.innerHTML.replace("+", "-");
    }
}

// Page ачаалах функц
async function loadPage(page) {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`./pages/${page}.html`);
        if (!response.ok) throw new Error('Хуудас олдсонгүй');

        const html = await response.text();
        content.innerHTML = html;

        // Active button тэмдэглэх
        document.querySelectorAll('.nav-links button').forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${page}'`)) {
                btn.style.backgroundColor = 'rgba(255,255,255,0.3)';
            } else {
                btn.style.backgroundColor = '';
            }
        });

    } catch (error) {
        console.error(error);
        content.innerHTML = `<div class="page"><h2>Алдаа гарлаа</h2><p>Хуудас ачаалахад алдаа гарлаа.</p></div>`;
    }
}

// Router
function navigate(page) {
    loadPage(page);
    window.location.hash = page;   // URL өөрчлөх
}

// Hash change (Back/Forward товч ажиллахад)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'Introduction';
    loadPage(hash);
});

// Эхлэх үед
window.onload = () => {
    loadSidebar();
    const initialPage = window.location.hash.substring(1) || 'Introduction';
    loadPage(initialPage);
};
