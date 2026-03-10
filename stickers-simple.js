/**
 * 🎨 STICKERS SIMPLE - Issue #1 Simplificado
 * Sistema de stickers intuitivo: Clic para pegar (sin drag & drop complejo)
 */

class SimpleStickerSystem {
    constructor() {
        this.stickers = {
            animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵'],
            nature: ['🌻','🌷','🌺','🌹','🌸','⭐','🌟','🌈','☁️','⛈️','❄️','💧','🎵','🎶'],
            space: ['🌍','🌞','🌝','🌑','🌓','🌕','🌘','🙋','💃','🕺','👯']
        };
        
        this.panel = document.getElementById('sticker-panel-toggle');
        this.gridEl = document.querySelector('.sticker-grid') || null;
        
        if (this.panel && this.gridEl) {
            this.init();
        } else {
            console.log('🔕 [STICKERS]: Elements not found - will init when ready');
        }
    }
    
    init() {
        // Renderizar grid de stickers simple (solo emojis, sin drag & drop complejo)
        this.renderGrid();
        
        console.log('✅ [STICKERS SIMPLIFIED]: Grid rendered with click-to-place!');
    }
    
    renderGrid() {
        const container = document.createElement('div');
        container.className = 'sticker-collections';
        
        for (const [catName, catStickers] of Object.entries(this.stickers)) {
            const section = document.createElement('div');
            section.className = 'sticker-collection';
            
            const title = document.createElement('h4');
            title.textContent = catName.charAt(0).toUpperCase() + catName.slice(1) + ' 📦';
            title.style.cssText = 'color:#667eea;margin-bottom:0.5rem;font-size:1rem;';
            section.appendChild(title);
            
            const grid = document.createElement('div');
            grid.className = 'sticker-grid-category';
            
            catStickers.forEach((emoji, idx) => {
                const sticker = document.createElement('div');
                sticker.textContent = emoji;
                sticker.style.cssText = `
                    font-size: 32px;
                    text-align: center;
                    cursor: pointer;
                    background: #f8f9fa;
                    padding: 0.5rem;
                    border-radius: 8px;
                    margin-bottom: 0.25rem;
                `;
                
                // Click simple para pegar en canvas (sin drag & drop)
                sticker.addEventListener('click', (e) => this.placeSticker(e, emoji));
                
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
    
    placeSticker(e, emoji) {
        // Pegar sticker en canvas actual donde se hizo click
        const canvas = document.getElementById('drawing-canvas');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Dibujar sticker en canvas
        const ctx = canvas.getContext('2d');
        ctx.font = '60px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText(emoji, clickX - 35, clickY);
        
        console.log('✨ [STICKERS]: Placed', emoji, 'at X:', Math.round(clickX));
    }
}

// Inicializar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const canvas = document.getElementById('drawing-canvas');
        
        if (canvas && !window.simpleStickerSystem) {
            try {
                window.simpleStickerSystem = new SimpleStickerSystem();
                console.log('✅ [STICKERS SIMPLIFIED]: Simple sticker system active!');
                
                // Actualizar texto del botón de stickers para indicar simplicidad
                const btnStickers = document.getElementById('btn-stickers');
                if (btnStickers) {
                    btnStickers.title = '✨ Stickers simples - Clic para pegar en cualquier lugar!';
                }
            } catch (err) {
                console.warn('[STICKERS]: Init error:', err.message);
            }
        } else if (!canvas) {
            console.log('🔕 [STICKERS]: Canvas not found');
        }
    }, 300);
});
