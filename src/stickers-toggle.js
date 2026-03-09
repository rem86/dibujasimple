/** 🎨 Sticker Toggle Logic - DibujaSimple */

// Toggle panel stickers al clickar botón
document.addEventListener('DOMContentLoaded', function() {
    const btnStickers = document.getElementById('btn-stickers');
    const stickerPanel = document.querySelector('.sticker-panel');
    const btnExport = document.getElementById('btn-export');
    
    // Inicializar estado de panel (oculto por defecto)
    if (!stickerPanel) return;
    
    // Toggle visible/invisible
    btnStickers.addEventListener('click', function() {
        const isVisible = stickerPanel.style.display === 'block';
        stickerPanel.style.display = isVisible ? 'none' : 'block';
        
        // Actualizar estado botón activo
        if (!isVisible) {
            this.classList.add('active');
            btnExport?.style.display = 'inline-block'; // Mostrar exportación si panel visible
        } else {
            this.classList.remove('active');
        }
    });
    
    // Cargar stickers desde stickers.html si es necesario
    const stickerGrid = document.getElementById('sticker-grid');
    if (stickerGrid) {
        // Stickers ya están integrados en HTML, solo mostrar/ocultar grid
    }
    
    console.log('🎨 [STICKERS]: Toggle logic inicializado correctamente');
});
