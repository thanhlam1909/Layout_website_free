function loadAuthPageFromHash() {
    const hash = location.hash.replace("#", "") || "login";
    const page = `${hash}.html`;

    fetch(page)
        .then(response => {
            if (!response.ok) throw new Error("Page not found");
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update head
            document.head.querySelectorAll("title, meta, link[rel='canonical']").forEach(e => e.remove());
            doc.head.querySelectorAll("title, meta, link").forEach(e => document.head.appendChild(e.cloneNode(true)));

            // Update body
            const container = document.getElementById("auth-container");
            container.innerHTML = doc.body.innerHTML;

            // Kích hoạt script
            const scripts = container.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
            });
        })
        .catch(err => {
            console.error("Không tìm thấy trang:", err);
            // Optionally: load fallback
            if (hash !== "login") loadAuthPageFromHash("#login");
        });
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", () => {
    loadAuthPageFromHash();
});

// Gọi lại khi hash thay đổi
window.addEventListener("hashchange", () => {
    loadAuthPageFromHash();
});