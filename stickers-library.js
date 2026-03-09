/**
 * 🎨 STICKERS LIBRARY - Issue #1 Implementation
 * Sistema de stickers temáticos con drag & drop
 */

class StickerLibrary {
    constructor() {
        this.stickers = [];
        this.visibleStickers = [];
        this.gridEl = document.querySelector('.sticker-grid');
        
        // Catálogo de stickers por categoría
        this.categories = {
            animals: this.loadCategory('animals'),      // Animales
            nature: this.loadCategory('nature'),        // Naturaleza  
            space: this.loadCategory('space')           // Espacio
        };
        
        this.init();
    }
    
    loadCategory(category) {
        // Stickers base por categoría (emojis como placeholders - luego imágenes reales)
        const categoryStickers = {
            animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐛','🐜','🐝','🐞','🦋','🐌','🐢','🐙','🦀','🦞','🦑','🦄','🦕','🦖'],
            nature: ['🌻','🌷','🌺','🌹','🌸','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','☀️','⭐','🌟','🌈','☁️','⛈️','❄️','☮️','💥','💧','💨','💫','💬','💭','🎵','🎶','📯','🔔','🔕'],
            space: ['🌍','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🙋','🙇','💁','🙅','🙆','🙈','🙉','🙊','💃','🕺','👯','👨','👩','🧔','👳','👲','👳','🧕','🤴','👸','🦸','🦹']
        };
        
        return categoryStickers[category] || [];
    }
    
    init() {
        // Cargar stickers en la grilla
        this.renderGrid();
        
        // Drag & drop handlers
        if (this.gridEl) {
            this.gridEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
            this.gridEl.addEventListener('dragover', (e) => e.preventDefault());
            this.gridEl.addEventListener('drop', (e) => this.handleDrop(e));
            
            // Toggle panel visibility
            const btnToggle = document.getElementById('btn-stickers');
            if (btnToggle) {
                btnToggle.addEventListener('click', () => this.toggleVisibility());
            }
        }
        
        console.log('✅ [STICKERS]: Library initialized!');
    }
    
    renderGrid() {
        if (!this.gridEl) return;
        
        // Organizar stickers por categoría en grid
        const container = document.createElement('div');
        container.className = 'sticker-collections';
        
        for (const [catName, catStickers] of Object.entries(this.categories)) {
            const section = document.createElement('div');
            section.className = 'sticker-collection';
            
            const title = document.createElement('h4');
            title.textContent = catName.charAt(0).toUpperCase() + catName.slice(1);
            title.style.color = '#667eea';
            section.appendChild(title);
            
            const grid = document.createElement('div');
            grid.className = 'sticker-grid-category';
            
            // Crear stickers - usar emojis o imágenes reales
            catStickers.forEach((emoji, idx) => {
                const sticker = document.createElement('div');
                sticker.className = 'sticker-item draggable';
                sticker.textContent = emoji;
                sticker.dataset.stickerId = `${catName}-${idx}`;
                sticker.draggable = true;
                sticker.title = `Sticker ${catName}: ${idx + 1}`;
                
                // Click para duplicar en canvas
                sticker.addEventListener('click', (e) => this.clickSticker(e, emoji));
                
                grid.appendChild(sticker);
            });
            
            section.appendChild(grid);
            container.appendChild(section);
        }
        
        if (this.gridEl) {
            this.gridEl.innerHTML = '';
            this.gridEl.appendChild(container);
        }
    }
    
    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.stickerId);
        e.dataTransfer.effectAllowed = 'copy';
        console.log('📌 [STICKERS]: Drag start -', e.target.textContent);
    }
    
    handleDrop(e) {
        const stickerId = e.dataTransfer.getData('text/plain');
        const stickerElement = document.querySelector(`[data-stickerid="${stickerId}"]`);
        
        if (stickerElement) {
            this.clickSticker(e, stickerElement.textContent);
        }
        return false;
    }
    
    clickSticker(e, stickerEmoji) {
        e.preventDefault();
        e.stopPropagation();
        
        // Duplicar sticker en canvas actual (sobre el último dibujo o al principio)
        const ctx = document.getElementById('drawing-canvas')?.getContext('2d');
        if (!ctx) return;
        
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Añadir sticker como texto/imagen en canvas
        ctx.font = '60px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText(stickerEmoji, x - 35, y);
        
        console.log('✨ [STICKERS]: Added', stickerEmoji, 'at', Math.round(x), ',', Math.round(y));
    }
    
    toggleVisibility() {
        const panel = document.getElementById('btn-stickers');
        if (panel) {
            const isVisible = panel.classList.contains('active');
            
            // Alternar estilo activo
            if (!isVisible) {
                panel.classList.add('active');
                const gridEl = this.gridEl;
                if (gridEl) gridEl.style.display = 'block';
            } else {
                panel.classList.remove('active');
                const gridEl = this.gridEl;
                if (gridEl) gridEl.style.display = 'none';
            }
        }
    }
    
    // Exportar librería completa como array de objetos
    exportStickers() {
        return {
            stickers: [
                ...this.categories.animals,
                ...this.categories.nature,
                ...this.categories.space
            ],
            categories: Object.keys(this.categories),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
    }
}

// Inicializar librería cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 [STICKERS]: Initializing StickerLibrary...');
    
    // Intentar instanciar si la grilla existe (es un script independiente)
    const gridEl = document.querySelector('.sticker-grid');
    if (gridEl) {
        try {
            new StickerLibrary();
        } catch (err) {
            console.log('⚠️ [STICKERS]: Already initialized or DOM not ready:', err.message);
        }
    } else {
        console.log('🔕 [STICKERS]: Grid element not found - waiting for mount');
    }
});
