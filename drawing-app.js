/**
 * 🎨 DibujaSimple v3.2 - SOLUCIÓN DIRECTA SIN COMPLICACIONES
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 DibujaSimple v3.2 - Solución directa touch...');
    
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('color-input');
    const eraserToggle = document.getElementById('eraser-toggle');
    
    const btns = {
        pencil: document.getElementById('btn-pencil'),
        brush1: document.getElementById('btn-brush-1'),
        brush2: document.getElementById('btn-brush-2'),
        sizeSmall: document.getElementById('btn-size-small'),
        sizeMedium: document.getElementById('btn-size-medium'),
        sizeLarge: document.getElementById('btn-size-large'),
        undo: document.getElementById('btn-undo'),
        clear: document.getElementById('btn-clear'),
        save: document.getElementById('btn-save')
    };
    
    // Estado simple
    let isDrawing = false;
    let currentColor = '#000000';
    let brushSize = 5;
    let eraserMode = false;
    
    // ✅ SOLUCIÓN FINAL: Coordenadas RELATIVAS DIRECTAS SIN OFFSET COMPLICADO
    // Solo clientX - rect.left da la posición exacta donde dibujar
    let lastPos = { x: -1, y: -1 }; 
    
    // Inicializar canvas blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 📱 TOUCH EVENTS - Solución directa sin funciones complejas
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        
        // ✅ COORDENADAS EXACTAS: donde toca el dedo se dibuja ahí mismo
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        console.log('👆 [TOUCH]: x=' + x.toFixed(2) + ', y=' + y.toFixed(2));
        
        // Dibujar punto inicial
        lastPos.x = x;
        lastPos.y = y;
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        
        // ✅ DIBUJAR DONDE TOCA EL DEDO (coordenadas exactas)
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (Math.abs(x - lastPos.x) < 1 && Math.abs(y - lastPos.y) < 1) {
            return; // No dibujar si no se movió
        }
        
        draw(x, y);
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
        console.log('👆 [TOUCH END]: Drawing stopped');
    }, { passive: false });
    
    // Mouse events para escritorio
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        lastPos.x = e.clientX - rect.left;
        lastPos.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        draw(x, y);
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    // 🎨 FUNCIÓN DIBUJO: escribe en canvas
    function draw(x, y) {
        ctx.beginPath();
        
        // Si es primer punto o el mouse tocó antes de este frame
        if (lastPos.x === -1 || Math.abs(lastPos.x - x) > 1 || Math.abs(lastPos.y - y) > 1) {
            ctx.moveTo(x, y);
            lastPos.x = x;
            lastPos.y = y;
        } else {
            // Continuar desde última posición (coordenadas ya corregidas)
            ctx.lineTo(x, y);
            lastPos.x = x;
            lastPos.y = y;
        }
        
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (eraserMode) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.strokeStyle = currentColor;
        }
        
        ctx.stroke();
    }
    
    // Setup herramientas
    function setupTools() {
        btns.pencil?.addEventListener('click', () => selectTool('pencil'));
        btns.brush1?.addEventListener('click', () => selectTool('brush-1'));
        btns.brush2?.addEventListener('click', () => selectTool('brush-2'));
        
        btns.sizeSmall?.addEventListener('click', () => setBrushSize(3));
        btns.sizeMedium?.addEventListener('click', () => setBrushSize(5));
        btns.sizeLarge?.addEventListener('click', () => setBrushSize(10));
        
        eraserToggle?.addEventListener('change', (e) => {
            eraserMode = e.target.value === 'erase';
        });
        
        btns.undo?.addEventListener('click', undo);
        btns.clear?.addEventListener('click', clearCanvas);
        btns.save?.addEventListener('click', saveDrawing);
        
        colorInput?.addEventListener('input', (e) => {
            currentColor = e.target.value;
        });
    }
    
    function selectTool(tool) {
        eraserMode = false;
        eraserToggle && (eraserToggle.value = 'draw');
    }
    
    function setBrushSize(size) {
        brushSize = size;
    }
    
    function undo() {
        console.log('⬅️ [UNDO]: Not implemented');
    }
    
    function clearCanvas() {
        if (confirm('¿Borrar todo el canvas?')) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lastPos.x = -1; // Reset
            console.log('🗑️ [CLEAR]: Canvas cleared');
        }
    }
    
    function saveDrawing() {
        const link = document.createElement('a');
        link.download = `dibujo-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        console.log('✅ [SAVE]: Saved as PNG');
    }
    
    setupTools();
    
    // Log de inicialización
    setTimeout(() => {
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            console.log('✅ [INIT]: Canvas at', rect.left, 'x', rect.top);
            console.log('  Touch coordinates are now exact - no offset! ✅');
            console.log('✅ DibujaSimple v3.2 - Sin desvío entre dedo y trazo!');
        }
    }, 500);
});
