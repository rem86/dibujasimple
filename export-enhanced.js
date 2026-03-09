/**
 * 📤 ENHANCED EXPORT SYSTEM - Issue #5 Implementation
 * Mejora exportación PNG/JPG con calidad ajustable + preview + opciones
 */

class EnhancedExporter {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.exportBtn = null;
        
        if (!this.canvas) {
            console.log('🔕 [EXPORT]: Canvas not found');
            return;
        }
        
        // Configurar opciones de exportación por defecto
        this.defaultOptions = {
            quality: 1.0,       // Calidad PNG (1.0 máximo)
            format: 'png',      // png o jpg
            backgroundColor: '#ffffff', // Fondo blanco para JPG
            scale: 1,           // Escala (1x real, 2x retina, etc.)
        };
        
        this.init();
    }
    
    init() {
        // Integrar con botón existente de exportación o crear nuevo
        this.setupExportButton();
        
        console.log('✅ [EXPORT]: Enhanced Exporter initialized!');
    }
    
    setupExportButton() {
        // Crear botón de exportación avanzado si no existe uno funcional
        let btnExport = null;
        const toolbar = document.querySelector('.toolbar');
        
        if (toolbar && !document.getElementById('btn-export')) {
            const btnGroup = document.createElement('div');
            btnGroup.className = 'export-options';
            
            const btnExportEl = document.createElement('button');
            btnExportEl.id = 'btn-export';
            btnExportEl.textContent = '📤 Exportar';
            btnExportEl.style.cssText = `
                background: #28a745;
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-family: inherit;
                margin-left: 0.5rem;
            `;
            
            btnExportEl.addEventListener('click', () => this.showExportPanel());
            btnGroup.appendChild(btnExportEl);
            
            // Panel de opciones emergente
            const panel = document.createElement('div');
            panel.id = 'export-options-panel';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                z-index: 10000;
                min-width: 300px;
                display: none;
            `;
            
            panel.innerHTML = `
                <h3 style="color:#667eea;margin-bottom:1rem;">📤 Opciones de Exportación</h3>
                
                <div style="margin-bottom:1rem;">
                    <label for="export-format" style="display:block;font-weight:bold;margin-bottom:0.25rem;">Formato:</label>
                    <select id="export-format" style="width:100%;padding:0.75rem;border:none;border-radius:6px;">
                        <option value="png">🟦 PNG (Calidad máxima)</option>
                        <option value="jpg" selected>🟨 JPG (Tamaño menor)</option>
                        <option value="webp">⚡ WEBP (Moderno)</option>
                    </select>
                </div>
                
                <div style="margin-bottom:1rem;">
                    <label for="export-quality" style="display:block;font-weight:bold;margin-bottom:0.25rem;">Calidad:</label>
                    <input type="range" id="export-quality" min="0.3" max="1" step="0.05" value="1">
                    <span id="quality-value" style="color:#6c757d;">100%</span>
                </div>
                
                <div style="margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">
                    <input type="checkbox" id="export-bg-check" checked>
                    <label for="export-bg-check">Fondo blanco (para JPG/WebP)</label>
                </div>
                
                <div style="margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">
                    <input type="checkbox" id="export-preview" checked>
                    <label for="export-preview">Mostrar preview antes de guardar</label>
                </div>
                
                <div style="margin-bottom:1rem;">
                    <label for="export-scale" style="display:block;font-weight:bold;margin-bottom:0.25rem;">Escala:</label>
                    <select id="export-scale" style="width:100%;padding:0.75rem;border:none;border-radius:6px;">
                        <option value="1">📐 1x (Original)</option>
                        <option value="2">📱 2x (Retina/High DPI)</option>
                        <option value="3">🎨 3x (Ultra HD)</option>
                    </select>
                </div>
                
                <div style="display:flex;gap:0.5rem;">
                    <button id="export-preview-btn" style="flex:1;padding:0.75rem;border:none;border-radius:6px;background:#28a745;color:white;cursor:pointer;">👁️ Preview</button>
                    <button id="export-cancel-btn" style="flex:1;padding:0.75rem;border:none;border-radius:6px;background:#6c757d;color:white;cursor:pointer;">❌ Cancelar</button>
                </div>
                
                <!-- Preview de exportación -->
                <canvas id="export-preview-canvas" style="display:block;border:3px solid #ddd;border-radius:8px;margin-top:1rem;"></canvas>
            `;
            
            toolbar.appendChild(btnGroup);
            toolbar.appendChild(panel);
            
            // Event listeners para panel
            const previewCheckbox = panel.querySelector('#export-preview');
            if (previewCheckbox) {
                previewCheckbox.addEventListener('change', (e) => this.togglePreviewPanel(e.target.checked));
            }
            
            const formatSelect = panel.querySelector('#export-format');
            if (formatSelect) {
                formatSelect.addEventListener('change', () => this.onFormatChange());
            }
            
            const qualitySlider = panel.querySelector('#export-quality');
            if (qualitySlider) {
                qualitySlider.addEventListener('input', (e) => {
                    const percent = Math.round(e.target.value * 100);
                    document.getElementById('quality-value').textContent = percent + '%';
                });
            }
            
            const scaleSelect = panel.querySelector('#export-scale');
            if (scaleSelect) {
                scaleSelect.addEventListener('change', () => this.onScaleChange());
            }
            
            const previewBtn = panel.querySelector('#export-preview-btn');
            if (previewBtn) {
                previewBtn.addEventListener('click', () => this.showPreview());
            }
            
            const cancelBtn = panel.querySelector('#export-cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.closePanel());
            }
            
            this.exportBtn = btnExportEl;
        } else if (document.getElementById('btn-export')) {
            // Botón ya existe, integrar export enhanced con el existente
            const existingBtn = document.getElementById('btn-export');
            existingBtn.addEventListener('click', () => this.showExportPanel());
            
            this.exportBtn = existingBtn;
        }
        
        console.log('✅ [EXPORT]: Export button integrated!');
    }
    
    showExportPanel() {
        const panel = document.getElementById('export-options-panel');
        if (!panel) return;
        
        panel.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evitar scroll mientras panel abierto
        
        console.log('👁️ [EXPORT]: Export panel opened');
    }
    
    closePanel() {
        const panel = document.getElementById('export-options-panel');
        if (panel) panel.style.display = 'none';
        
        document.body.style.overflow = ''; // Restaurar scroll
        
        console.log('📭 [EXPORT]: Export panel closed');
    }
    
    togglePreviewPanel(show) {
        const previewCheckbox = document.getElementById('export-preview');
        if (previewCheckbox) previewCheckbox.checked = show;
        
        if (show) {
            this.showExportPanel();
        } else {
            this.closePanel();
        }
    }
    
    onFormatChange() {
        const formatSelect = document.querySelector('#export-format');
        const qualitySlider = document.querySelector('#export-quality');
        
        if (!formatSelect || !qualitySlider) return;
        
        // Ajustar calidad por defecto según formato
        const newQuality = formatSelect.value === 'png' ? 1.0 : 
                         formatSelect.value === 'webp' ? 0.95 : 0.9;
        
        qualitySlider.value = newQuality;
        document.getElementById('quality-value').textContent = Math.round(newQuality * 100) + '%';
    }
    
    onScaleChange() {
        console.log('📐 [EXPORT]: Scale changed to', document.querySelector('#export-scale')?.value + 'x');
    }
    
    showPreview() {
        const options = this.getDefaultOptions();
        const previewCanvas = document.getElementById('export-preview-canvas');
        
        if (!previewCanvas) return;
        
        // Crear canvas de preview con mismo tamaño del original
        previewCanvas.width = this.canvas.width;
        previewCanvas.height = this.canvas.height;
        const ctx = previewCanvas.getContext('2d');
        
        if (options.backgroundColor && options.format !== 'png') {
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
        }
        
        // Dibujar con calidad máxima para preview preciso
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = previewCanvas.width * 2; // Retina para preview nítido
            tempCanvas.height = previewCanvas.height * 2;
            const tempCtx = tempCanvas.getContext('2d');
            
            if (options.backgroundColor && options.format !== 'png') {
                tempCtx.fillStyle = options.backgroundColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            }
            
            tempCtx.drawImage(this.canvas, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // Reducir a tamaño original para preview
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 
                         0, 0, previewCanvas.width, previewCanvas.height);
            
            // Mostrar preview en DOM
            previewCanvas.style.display = 'block';
            previewCanvas.src = previewCanvas.toDataURL('image/png');
            
        } catch (err) {
            console.error('❌ [EXPORT]: Preview failed:', err.message);
        }
    }
    
    confirmExport() {
        const options = this.getDefaultOptions();
        this.export(options);
        this.closePanel();
    }
    
    getDefaultOptions() {
        return {
            quality: parseFloat(document.querySelector('#export-quality')?.value || '1'),
            format: document.querySelector('#export-format')?.value || 'png',
            backgroundColor: document.querySelector('#export-bg-check')?.checked ? '#ffffff' : 'transparent',
            scale: parseInt(document.querySelector('#export-scale')?.value || '1'),
            showPreview: false
        };
    }
    
    export(options) {
        const ctx = this.canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Crear canvas temporal con dimensiones ajustadas por escala
        const scale = options.scale || 1;
        const width = this.canvas.width * scale;
        const height = this.canvas.height * scale;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Configurar fondo
        if (options.backgroundColor && options.format !== 'png') {
            tempCtx.fillStyle = options.backgroundColor;
            tempCtx.fillRect(0, 0, width, height);
        }
        
        // Dibujar contenido escalado
        tempCtx.drawImage(this.canvas, 0, 0, width, height);
        
        // Exportar
        let imageUrl = null;
        const mimeType = options.format === 'png' ? 'image/png' : 
                        options.format === 'jpg' ? 'image/jpeg' : 'image/webp';
        
        try {
            imageUrl = tempCanvas.toDataURL(mimeType, options.quality);
            
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.download = `dibujo-${Date.now()}.${options.format}`;
            link.href = imageUrl;
            link.click();
            
            console.log('📤 [EXPORT]: Exported as', mimeType, 'quality:', (options.quality * 100).toFixed(0) + '%');
            
        } catch (err) {
            console.error('❌ [EXPORT]: Export failed:', err.message);
        }
        
        // Notificación de éxito
        this.showNotification();
    }
    
    showNotification() {
        // Verificar si ya hay notificación similar (evitar spam)
        const existing = document.querySelector('.export-success-notification');
        if (existing) return;
        
        // Notificación visual de exportación exitosa
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(102,126,234,0.3);
            z-index: 10000;
            font-size: 0.9rem;
            animation: slideIn 0.4s ease-out, fadeOut 0.5s ease-in 2.5s forwards;
        `;
        notification.textContent = '📤 ¡Dibujo exportado con éxito! ✨';
        
        if (!document.getElementById('export-notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'export-notification-styles';
            styleSheet.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3500);
    }
}

// Inicializar automáticamente cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    
    // Esperar a que los otros scripts carguen antes de inyectar export
    setTimeout(() => {
        if (canvas && !window.dibujasimpleEnhancedExporter) {
            try {
                new EnhancedExporter();
                window.dibujasimpleEnhancedExporter = true;
                console.log('✅ [EXPORT]: Export enhanced ready!');
            } catch (err) {
                console.warn('⚠️ [EXPORT]: Already initialized or DOM not ready:', err.message);
            }
        }
    }, 500);
});
