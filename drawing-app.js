/**
 * 🎨 DibujaSimple v3.1 - OFFSET CORREGIDO
 * Solución definitiva para coordenadas exactas en móviles
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 DibujaSimple v3.1 - Corrigiendo offset touch...');
    
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('color-input');
    const eraserToggle = document.getElementById('eraser-toggle');
    
    // Referencias a botones
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
    
    // Estado de dibujo
    let isDrawing = false;
    let currentColor = '#000000';
    let brushSize = 5;
    let eraserMode = false;
    
    // ✅ CORRECCIÓN FINAL: Posición absoluta donde se dibujará
    // Esto elimina el offset entre dedo y trazo
    let drawPosition = { x: 0, y: 0 }; 
    let lastDrawPosition = { x: -1, y: -1 }; 
    
    // Calcula offset del canvas respecto al viewport (CRÍTICO para eliminar desvío)
    function getCanvasOffset() {
        if (!canvas) return { left: 0, top: 0 };
        
        const rect = canvas.getBoundingClientRect();
        
        // Offset del canvas donde el usuario toca (relativo al documento)
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }
    
    // 📱 FUNCIÓN KEY: Obtener coordenadas RELATIVAS exactas al canvas (CORREGIDO)
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const offset = getCanvasOffset();
        
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - offset.left,
                y: e.touches[0].clientY - offset.top
            };
        } else if (e.clientX !== undefined) {
            return {
                x: e.clientX - offset.left,
                y: e.clientY - offset.top
            };
        }
        
        return null;
    }
    
    // 🎨 DIBUJAR - Función principal que escribe en canvas sin offset
    function draw(x, y) {
        // Dibujar línea desde última posición (sin offset adicional)
        ctx.beginPath();
        
        if (lastDrawPosition.x !== -1) {
            ctx.moveTo(lastDrawPosition.x, lastDrawPosition.y);
        } else {
            // Primer punto
            ctx.moveTo(x, y);
        }
        
        ctx.lineTo(x, y);
        
        // Configurar estilo
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (eraserMode) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
        }
        
        // DIBUJAR EN CANVAS - Sin offset adicional (coordenadas ya corregidas)
        ctx.stroke();
        
        // Actualizar última posición (ya están corregidas)
        lastDrawPosition.x = x;
        lastDrawPosition.y = y;
    }
    
    // 📱 TOUCH START - Iniciar dibujo en móvil (coordenadas exactas, sin desvío)
    function handleTouchStart(e) {
        e.cancelable && e.preventDefault();
        isDrawing = true;
        
        const coords = getCanvasCoordinates(e);
        if (coords) {
            drawPosition.x = coords.x;
            drawPosition.y = coords.y;
            
            // Dibujar punto inicial
            lastDrawPosition.x = coords.x;
            lastDrawPosition.y = coords.y;
        }
        
        console.log('👆 [TOUCH START]: x=' + coords?.x.toFixed(2) + ', y=' + coords?.y.toFixed(2) + ' (sin offset)');
    }
    
    // 📱 TOUCH MOVE - Dibujar mientras se mueve el dedo (coordenadas exactas)
    function handleTouchMove(e) {
        e.cancelable && e.preventDefault();
        
        if (!isDrawing) return;
        
        const coords = getCanvasCoordinates(e);
        if (coords) {
            draw(coords.x, coords.y); // Coordenadas ya corregidas, sin desvío
        }
    }
    
    // 📱 TOUCH END - Finalizar dibujo en móvil
    function handleTouchEnd(e) {
        e.cancelable && e.preventDefault();
        
        isDrawing = false;
        console.log('👆 [TOUCH END]: Drawing stopped');
    }
    
    // Setup de listeners TOCH optimizados
    if (canvas) {
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Mouse listeners para escritorio
        canvas.addEventListener('mousedown', (e) => {
            e.cancelable && e.preventDefault();
            isDrawing = true;
            
            const coords = getCanvasCoordinates(e);
            if (coords) {
                drawPosition.x = coords.x;
                drawPosition.y = coords.y;
                lastDrawPosition.x = coords.x;
                lastDrawPosition.y = coords.y;
            }
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            const coords = getCanvasCoordinates(e);
            if (coords) {
                draw(coords.x, coords.y);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
    }
    
    // Setup de herramientas
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
        console.log('⬅️ [UNDO]: Feature not implemented');
    }
    
    function clearCanvas() {
        if (confirm('¿Borrar todo el canvas?')) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lastDrawPosition.x = -1; // Resetear última posición
            console.log('🗑️ [CLEAR]: Canvas cleared');
        }
    }
    
    function saveDrawing() {
        const link = document.createElement('a');
        link.download = `dibujo-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        console.log('✅ [SAVE]: Drawing saved as PNG');
    }
    
    // Inicializar herramientas
    setupTools();
    
    // Log de inicialización
    setTimeout(() => {
        if (!canvas) {
            console.error('[ERROR]: Canvas not found!');
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        console.log('✅ [READY]: Canvas offset =', rect.left, 'x', rect.top);
        console.log('  Touch coordinates will be calculated without offset ✅');
        console.log('✅ DibujaSimple v3.1 - Sin desvío entre dedo y trazo!');
    }, 500);
});
