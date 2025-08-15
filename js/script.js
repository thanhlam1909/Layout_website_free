let currentModal = null;

function setupModal(modalId, buttonId) {
    // Check if modal already exists
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    // Clean up previous modal if exists
    if (currentModal) {
        currentModal.dispose(); // Dispose previous modal instance properly
    }

    // Initialize new modal instance
    currentModal = new bootstrap.Modal(modalElement);

    const openModalButton = document.getElementById(buttonId);
    if (openModalButton) {
        // Attach a single event listener to open the modal
        openModalButton.removeEventListener('click', handleModalOpen);
        openModalButton.addEventListener('click', handleModalOpen);
    }

    // Handle keyboard shortcut (V key)
    function handleKeyPress(e) {
        if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
            e.preventDefault();
            currentModal.show();
        }
    }

    // Add listener for the V key press
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);

    function handleModalOpen(e) {
        e.preventDefault();
        e.stopPropagation();
        currentModal.show();
    }
}

async function loadAuthPageFromHash() {
    const container = document.getElementById("auth-container");
    if (!container) return;

    try {
        // Show loading spinner
        container.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        const hash = location.hash.replace("#", "") || "product_detail";
        const page = `${hash}.html`;

        const response = await fetch(page);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Update head elements (title, meta, canonical link)
        document.head.querySelectorAll("title, meta, link[rel='canonical']").forEach(e => e.remove());
        doc.head.querySelectorAll("title, meta, link").forEach(e => {
            document.head.appendChild(e.cloneNode(true));
        });

        // Update body content
        container.innerHTML = doc.body.innerHTML;

        // Reinitialize scripts dynamically
        const scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.async = false;
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
        });

        // Reinitialize modal (this can be abstracted into a reusable function)
        setupModal('productDetailsModal', 'openModalButton');

    } catch (error) {
        console.error("Failed to load page:", error);

        // Fallback to the default page (product_detail) if loading fails
        if (location.hash !== "#product_detail") {
            location.hash = "product_detail";
            return;
        }

        // Show error message if even fallback fails
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error loading page</h4>
                <p>${error.message}</p>
                <a href="#product_detail" class="btn btn-primary">Go to default page</a>
            </div>
        `;
    }
}

function initApp() {
    // Set default hash if none exists
    if (!location.hash) {
        history.replaceState(null, null, "#product_detail");
    }

    // Initial load
    loadAuthPageFromHash();

    // Handle hash changes (URL changes)
    window.addEventListener("hashchange", loadAuthPageFromHash);

    // Initial modal setup
    setupModal('productDetailsModal', 'openModalButton');
}

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);