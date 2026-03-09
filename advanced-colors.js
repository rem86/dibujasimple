/**
 * 🎨 ADVANCED PALETTE - Issue #4 Implementation  
 * Paleta extendida con colores pasteles, presets por mood y picker avanzado
 */

class AdvancedColorPalette {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.colorInput = document.getElementById('color-input');
        
        if (!this.canvas || !this.colorInput) {
            console.log('🔕 [COLORS]: Elements not found - will auto-init when ready');
            return;
        }
        
        this.pastelPalette = null;
        this.presets = {
            happy: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D'],    // Feliz/energético
            calm: ['#A8E6CF', '#DCEDC1', '#FDFFF5', '#F0B299'],     // Calmado/natural  
            dark: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],    // Oscuro/dramático
            retro: ['#FF4D4D', '#FFE86F', '#A8E6CF', '#DCEDC1'],    // Retro/vintage
            ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],   // Ocean/célio
            sunset: ['#ff5e3a', '#ff9249', '#ffc658', '#ffa14c']    #ff5e3a
        };
        
        console.log('🎨 [COLORS]: Palette system initialized');
    }
    
    init() {
        // Cargar paleta pastel inicial
        this.pastelPalette = this.generatePastelPalette();
        
        // Configurar selector de color avanzado
        this.setupColorSelector();
        
        // Añadir botón para abrir paleta completa
        this.createPalettePanel();
        
        console.log('✅ [COLORS]: Advanced palette active!');
    }
    
    generatePastelPalette() {
        // Generar 24 colores pasteles basados en HSL suave
        const pastels = [];
        for (let h = 0; h < 360; h += 15) {
            const color = this.hslToHex(h, 70, 90); // Lightness alto para pastel
            pastels.push(color);
        }
        
        // Colores específicos populares
        const additionalPastels = [
            '#FFF5F8', '#FFE4E6', '#FFEEDD', '#FFFFDD', '#F0FFF4', // Rosa, coral, beige, crema, menta
            '#E6F3FF', '#DEEAFB', '#D4E2FF', '#C1D7FF', '#A8CEDD', // Azul claro, lila, cielo
            '#FFE4BD', '#FFEE99', '#FFFFCC', '#FFF5BA', '#FFFACD'   // Amarillo suave, limón
        ];
        
        return [...pastels, ...additionalPastels].slice(0, 36);
    }
    
    hslToHex(h, s, l) {
        // Convertir HSL a Hex para paleta pastel
        let f = n => {
            const k = (n + 255) / 510;
            return l < 50 ? l * (s + k) : l + s - l * s;
        };
        
        const toHex = c => Math.round(255 * f(c)).toString(16).padStart(2, '0');
        const r = toHex(h / 360 * s); // Simplificado - usar lógica completa HSL→RGB
        const g = toHex(Math.max(0, (h + 8) % 360 * s)); 
        const b = toHex(Math.max(0, h % 360 * s));
        
        return '#' + r.slice(-2) + g.slice(-2) + b.slice(-2);
    }
    
    setupColorSelector() {
        // Botón "Más colores" para mostrar paleta avanzada
        if (!document.getElementById('btn-more-colors')) {
            const moreBtn = document.createElement('button');
            moreBtn.id = 'btn-more-colors';
            moreBtn.textContent = '🎨 Más colores';
            moreBtn.style.cssText = `
                background: #9370DB;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.875rem;
                margin-left: 0.5rem;
            `;
            moreBtn.addEventListener('click', () => this.togglePalettePanel());
            
            // Insertar antes del selector de color existente
            const colorPicker = document.querySelector('.color-picker');
            if (colorPicker) {
                colorPicker.insertBefore(moreBtn, colorPicker.firstChild);
            }
        }
    }
    
    createPalettePanel() {
        // Crear panel deslizante de paletas
        const panel = document.createElement('div');
        panel.id = 'color-palette-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 1.5rem;
            border-radius: 16px;
            box-shadow: 0 12px 48px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 320px;
            max-height: 70vh;
            display: none;
            overflow-y: auto;
        `;
        
        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <h3 style="color:#667eea;margin:0;font-size:1.125rem;">🎨 Paleta Avanzada</h3>
                <button id="close-palette" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button>
            </div>
            
            <!-- Paletas por mood -->
            ${Object.keys(this.presets).map(mood => `
                <div style="margin-bottom:1rem;">
                    <h4 style="color:#6c757d;font-size:0.875rem;margin-bottom:0.5rem;text-transform:uppercase;">${mood}</h4>
                    <div style="display:flex;gap:0.35rem;flex-wrap:wrap;" id="presets-${mood}">
                        ${this.presets[mood].map(color => `
                            <button class="color-preset" 
                                data-color="${color}" 
                                style="width:40px;height:40px;border-radius:8px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);cursor:pointer;"
                                onmousedown="document.getElementById('color-input').value=this.dataset.color"
                                onmouseup="document.getElementById('color-input').click()"
                            >
                                <span style="display:block;width:100%;height:100%;" style="background:${color};"></span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            
            <!-- Paleta pastel generada -->
            <div style="margin-bottom:1rem;">
                <h4 style="color:#6c757d;font-size:0.875rem;margin-bottom:0.5rem;">🌸 Pasteles (36 colores)</h4>
                <div id="pastel-grid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:0.25rem;">
                    <!-- Generado dinámicamente -->
                </div>
            </div>
            
            <!-- Paleta generada por usuario -->
            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #eee;">
                <h4 style="color:#6c757d;font-size:0.875rem;margin-bottom:0.5rem;">➕ Generar Paleta</h4>
                <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                    <button id="btn-random" style="background:#667eea;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;font-size:0.875rem;">🎲 Aleatoria</button>
                    <button id="btn-complementary" style="background:#9370DB;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;font-size:0.875rem;">🔄 Complementarios</button>
                </div>
            </div>
        `;
        
        // Event listeners para presets
        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.setColor(btn.dataset.color);
            });
            
            btn.addEventListener('mouseup', () => {
                btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            });
            
            btn.addEventListener('click', (e) => {
                // Click en espacio vacío → cancelar selección
                const target = e.target;
                if (!target.classList.contains('color-preset')) {
                    document.querySelectorAll('.color-preset').forEach(b => b.style.boxShadow = '');
                }
            });
        });
        
        // Event listeners para paleta pastel
        const pastelGrid = document.getElementById('pastel-grid');
        this.pastelPalette.forEach((color, idx) => {
            const btn = document.createElement('button');
            btn.className = 'color-preset';
            btn.dataset.color = color;
            btn.innerHTML = `<span style="display:block;width:100%;height:100%;" style="background:${color};border-radius:4px;"></span>`;
            btn.style.cssText = `width:35px;height:35px;border-radius:6px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:pointer;`;
            
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.setColor(color);
            });
            
            if (pastelGrid) pastelGrid.appendChild(btn);
        });
        
        // Event listeners para generadores
        document.getElementById('btn-random')?.addEventListener('click', () => this.generateRandomPalette());
        document.getElementById('btn-complementary')?.addEventListener('click', () => this.generateComplementaryPalette());
        document.getElementById('close-palette')?.addEventListener('click', () => this.closePalettePanel());
        
        // Guardar referencia para mostrar/ocultar
        this.palettePanel = panel;
        document.body.appendChild(panel);
    }
    
    setColor(color) {
        this.colorInput.value = color;
        this.closePalettePanel();
        console.log('🎨 [COLORS]: Selected', color);
    }
    
    togglePalettePanel() {
        const panel = this.palettePanel || document.getElementById('color-palette-panel');
        if (panel) {
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
            console.log(isVisible ? '📭 [COLORS]: Palette closed' : '🎨 [COLORS]: Palette opened');
        }
    }
    
    closePalettePanel() {
        const panel = document.getElementById('color-palette-panel');
        if (panel) panel.style.display = 'none';
    }
    
    generateRandomPalette() {
        // Generar 12 colores aleatorios armónicos
        const palette = [];
        for (let i = 0; i < 12; i++) {
            const hue = Math.random() * 360;
            const color = `hsl(${hue}, 75%, ${60 + Math.floor(Math.random() * 30)}%)`;
            palette.push(this.hslToHex(hue, 75, 60 + Math.floor(Math.random() * 30)));
        }
        
        // Mostrar nueva paleta (reemplazar grid existente)
        const grid = document.getElementById('pastel-grid');
        if (grid && this.pastelPalette) {
            // Guardar en lugar de crear nuevos botones
            this.pastelPalette = palette;
            
            // Recargar visualmente
            Array.from(grid.children).forEach((btn, idx) => {
                btn.style.background = palette[idx];
            });
        }
        
        console.log('🎲 [COLORS]: Random palette generated');
    }
    
    generateComplementaryPalette() {
        // Generar 8 colores armónicos + complementarios
        const palette = [];
        for (let i = 0; i < 8; i++) {
            const hue1 = (i * 45) % 360;
            const hue2 = (hue1 + 180) % 360; // Complementario
            
            palette.push(`hsl(${hue1}, 70%, ${60 + Math.floor(Math.random() * 30)}%)`);
            palette.push(`hsl(${hue2}, 65%, ${40 + Math.floor(Math.random() * 25)}%)`); // Complementario más oscuro
        }
        
        const grid = document.getElementById('pastel-grid');
        if (grid && this.pastelPalette) {
            this.pastelPalette = palette;
            
            Array.from(grid.children).forEach((btn, idx) => {
                btn.style.background = palette[idx];
            });
        }
        
        console.log('🔄 [COLORS]: Complementary palette generated');
    }
}

// Inicializar automáticamente cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const canvas = document.getElementById('drawing-canvas');
        const colorInput = document.getElementById('color-input');
        
        if (canvas && colorInput && !window.dibujasimpleAdvancedPalette) {
            new AdvancedColorPalette();
            window.dibujasimpleAdvancedPalette = true;
            console.log('✅ [COLORS]: Advanced palette ready!');
        }
    }, 300);
});
