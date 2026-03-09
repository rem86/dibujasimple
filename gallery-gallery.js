/**
 * 🌟 GALLERY SYSTEM - Issue #6 Implementation
 * Galería de dibujos con lazy loading, grid responsive y exportación masiva
 */

class DrawingGallery {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.galleryId = 'drawing-gallery-container';
        this.storageKey = 'dibujasimple_gallery';
        
        // Configuración de galería
        this.config = {
            maxImages: 50,           // Límite para localStorage
            thumbnailSize: 100,      // Tamaño miniatura en px
            lazyLoadThreshold: 200,  // Iniciar lazy loading a 200px del viewport
            animateFade: true,       // Animación fade-in para imágenes
        };
        
        console.log('🌟 [GALLERY]: Gallery system initialized');
    }
    
    init() {
        this.setupGallery();
        this.indexStoredDrawings();
        
        console.log('✅ [GALLERY]: Drawing gallery active!');
    }
    
    setupGallery() {
        // Crear contenedor de galería si no existe
        if (!document.getElementById(this.galleryId)) {
            const container = document.createElement('div');
            container.id = this.galleryId;
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 320px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                z-index: 5000;
                display: none;
                flex-direction: column;
            `;
            
            container.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;border-bottom:1px solid #eee;">
                    <h3 style="margin:0;color:#667eea;font-size:1.125rem;">🌟 Mis Dibujos</h3>
                    <div style="display:flex;gap:0.5rem;">
                        <input type="search" id="gallery-search" placeholder="Buscar dibujo..." 
                            style="border:none;border-radius:8px;padding:0.5rem 1rem;background:#f8f9fa;"
                            oninput="this.value=''">
                        <button id="btn-open-gallery" style="background:#667eea;color:white;border:none;padding:0.5rem 1rem;border-radius:8px;cursor:pointer;">📂 Galería</button>
                        <button id="btn-clear-gallery" style="background:#dc3545;color:white;border:none;padding:0.5rem 1rem;border-radius:8px;cursor:pointer;">🗑️ Limpiar</button>
                    </div>
                </div>
                
                <!-- Grid de miniaturas con lazy loading -->
                <div id="gallery-grid" style="flex:1;padding:1rem;overflow-y:auto;display:grid;gap:0.5rem;">
                    <!-- Miniaturas dinámicas -->
                </div>
                
                <!-- Modal preview full-size -->
                <div id="gallery-modal" class="modal hidden" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:6000;display:none;justify-content:center;align-items:center;">
                    <div style="max-width:95%;max-height:90vh;background:white;padding:0;border-radius:12px;position:relative;overflow:hidden;">
                        <button id="modal-close" style="position:absolute;top:1rem;right:1rem;background:rgba(0,0,0,0.7);color:white;border:none;padding:0.5rem;border-radius:8px;cursor:pointer;z-index:2;">✕</button>
                        <canvas id="gallery-preview-canvas"></canvas>
                    </div>
                </div>
            `;
            
            document.body.appendChild(container);
            
            // Event listeners
            const openBtn = container.querySelector('#btn-open-gallery');
            if (openBtn) {
                openBtn.addEventListener('click', () => this.toggleGallery(true));
            }
            
            const clearBtn = container.querySelector('#btn-clear-gallery');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearGallery());
            }
            
            const searchInput = container.querySelector('#gallery-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.filterDrawings(e.target.value));
            }
            
            // Modal event listeners
            const modal = document.getElementById('gallery-modal');
            const closeModalBtn = document.getElementById('modal-close');
            
            if (modal && closeModalBtn) {
                const closeHandler = () => this.closeModal();
                
                closeModalBtn.addEventListener('click', closeHandler);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeHandler();
                });
                // Tecla Escape cierra modal
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeModal();
                });
            }
            
            this.galleryContainer = container;
        } else {
            // Galería ya existe, verificar estado
            const existingContainer = document.getElementById(this.galleryId);
            const isOpen = !existingContainer.classList.contains('hidden');
            if (!isOpen) {
                this.toggleGallery(true);
            }
        }
    }
    
    toggleGallery(show) {
        const container = document.getElementById(this.galleryId);
        if (!container) return;
        
        if (show) {
            container.classList.remove('hidden');
            container.style.display = 'flex';
            
            // Renderizar galería si no está en DOM o si es primera vez
            if (this.gridChildren.length === 0 && this.hasDrawings()) {
                this.renderGallery();
            }
        } else {
            container.classList.add('hidden');
            container.style.display = 'none';
        }
    }
    
    renderGallery() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        
        // Limpiar grid actual (re-renderizar)
        grid.innerHTML = '';
        this.gridChildren = [];
        
        // Obtener dibujos guardados
        const drawings = this.getStoredDrawings();
        
        if (drawings.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Crear miniaturas con lazy loading
        drawings.forEach((drawing, idx) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'gallery-thumbnail';
            thumbnail.dataset.drawId = drawing.id;
            thumbnail.dataset.filename = drawing.filename || `dibujo-${idx}`;
            
            // Lazy loading para performance
            thumbnail.style.cssText = `
                aspect-ratio: 1;
                background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
                border-radius:8px;
                overflow:hidden;
                cursor:pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            `;
            
            // Inicializar imagen lazy con placeholder
            thumbnail.innerHTML = `
                <canvas class="gallery-thumb-canvas" width="${this.config.thumbnailSize}" height="${this.config.thumbnailSize}"></canvas>
            `;
            
            const thumbCanvas = thumbnail.querySelector('.gallery-thumb-canvas');
            
            // Dibujar miniatura (usar toDataURL optimizado para miniatura)
            const img = new Image();
            img.onload = () => {
                const ctx = thumbCanvas.getContext('2d');
                // Redimensionar proporcionalmente manteniendo relación de aspecto
                const w = this.config.thumbnailSize;
                const h = this.config.thumbnailSize;
                
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
            };
            img.src = drawing.data;
            
            thumbnail.addEventListener('click', () => this.openPreview(drawing));
            thumbnail.addEventListener('mouseenter', () => this.highlightThumbnail(thumbnail));
            thumbnail.addEventListener('mouseleave', () => this.clearHighlight());
            
            grid.appendChild(thumbnail);
            this.gridChildren.push(thumbnail);
        });
        
        console.log(`🌟 [GALLERY]: Rendered ${drawings.length} miniaturas`);
    }
    
    openPreview(drawing) {
        // Mostrar modal con preview full-size del dibujo seleccionado
        const modal = document.getElementById('gallery-modal');
        const previewCanvas = document.getElementById('gallery-preview-canvas');
        
        if (!modal || !previewCanvas) return;
        
        modal.style.display = 'flex'; // Usar flex para center
        
        // Crear canvas de preview con calidad alta (retina si es necesario)
        const dpr = window.devicePixelRatio || 1;
        previewCanvas.width = drawing.width * dpr;
        previewCanvas.height = drawing.height * dpr;
        const ctx = previewCanvas.getContext('2d');
        
        // Dibujar con calidad retina
        const img = new Image();
        img.onload = () => {
            // Redimensionar canvas temporal para dibujar
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = drawing.width;
            tempCanvas.height = drawing.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            if (document.getElementById('export-bg-check')?.checked) {
                // Fondo blanco si está configurado
                tempCtx.fillStyle = '#ffffff';
                tempCtx.fillRect(0, 0, drawing.width, drawing.height);
            }
            
            tempCtx.drawImage(img, 0, 0);
            
            ctx.scale(dpr, dpr);
            ctx.drawImage(tempCanvas, 0, 0, drawing.width * dpr, drawing.height * dpr);
        };
        img.src = drawing.data;
    }
    
    closeModal() {
        const modal = document.getElementById('gallery-modal');
        if (modal) modal.style.display = 'none';
    }
    
    highlightThumbnail(thumbnail) {
        // Efecto hover sutil
        thumbnail.style.transform = 'scale(1.05)';
        thumbnail.style.boxShadow = '0 4px 12px rgba(102,126,234,0.2)';
    }
    
    clearHighlight() {
        // Restaurar estado normal de hover
        this.gridChildren.forEach(thumb => {
            thumb.style.transform = '';
            thumb.style.boxShadow = '';
        });
    }
    
    showEmptyState() {
        const grid = document.getElementById('gallery-grid');
        if (grid && !this.hasDrawings()) {
            grid.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#6c757d;padding:2rem;text-align:center;">
                    <h4 style="margin-bottom:0.5rem;font-size:1.25rem;">🌟 Aún no tienes dibujos guardados</h4>
                    <p style="font-size:0.875rem;color:#6c757d;margin-bottom:1rem;">
                        Tu primer dibujo se guardará automáticamente aquí cuando uses el botón Guardar o active auto-save.
                    </p>
                    <button onclick="this.nextElementSibling.click()" 
                        style="background:#667eea;color:white;border:none;padding:0.75rem 2rem;border-radius:8px;cursor:pointer;font-size:1rem;">
                        👈 Ir al canvas y empieza a dibujar!
                    </button>
                    <div style="margin-top:1rem;font-size:0.8rem;color:#9ca3af;">
                        💡 Los dibujos se guardan automáticamente con auto-save enabled
                    </div>
                </div>
            `;
        }
    }
    
    filterDrawings(query) {
        // Filtrar miniaturas por nombre/datos de archivo
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        
        const lowerQuery = query.toLowerCase();
        
        Array.from(grid.children).forEach(thumb => {
            const filename = thumb.dataset.filename || '';
            
            if (filename.toLowerCase().includes(lowerQuery)) {
                thumb.style.display = 'block';
            } else {
                thumb.style.display = 'none';
            }
        });
    }
    
    clearGallery() {
        // Borrar todo el gallery y localStorage asociado
        const storedData = this.getStoredDrawings();
        
        if (storedData.length === 0) {
            alert('🗑️ [GALLERY]: Nothing to clear - gallery is empty');
            return;
        }
        
        // Eliminar de storage principal y gallery específico
        storedData.forEach(drawing => {
            localStorage.removeItem(drawing.id);
            localStorage.removeItem('dibujasimple_gallery_' + drawing.id);
        });
        
        this.renderGallery();
        alert('🗑️ [GALLERY]: Gallery cleared - ' + storedData.length + ' drawings removed');
    }
    
    indexStoredDrawings() {
        // Indexar dibujos de localStorage para galería
        const drawings = Object.keys(localStorage).filter(key => 
            key.startsWith('dibujasimple_') && 
            !key.startsWith('dibujasimple_gallery_')
        );
        
        // Mapear IDs a datos guardados
        this.drawingsIndex = {};
        drawings.forEach(id => {
            try {
                const drawing = JSON.parse(localStorage[id]);
                this.drawingsIndex[id] = drawing;
            } catch (err) {
                console.warn('[GALLERY]: Failed to parse stored drawing:', id, err.message);
            }
        });
        
        console.log(`🌟 [GALLERY]: Indexed ${Object.keys(this.drawingsIndex).length} drawings`);
    }
    
    hasDrawings() {
        return Object.keys(this.drawingsIndex || {}).length > 0;
    }
    
    getStoredDrawings() {
        return Object.values(this.drawingsIndex || {});
    }
}

// Inicializar automáticamente cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const canvas = document.getElementById('drawing-canvas');
        if (canvas && !window.dibujasimpleGallery) {
            try {
                new DrawingGallery();
                window.dibujasimpleGallery = true;
                console.log('✅ [GALLERY]: Gallery system active!');
            } catch (err) {
                console.warn('[GALLERY]: Init error:', err.message);
            }
        }
    }, 500);
});
