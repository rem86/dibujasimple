/**
 * 🎨 DibujaSimple - Móvil Optimizado v3.0
 * Solución definitiva para touch en iOS/Android/Chromium
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 DibujaSimple v3.0 - Touch events optimizados...');
    
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('color-input');
    const eraserToggle = document.getElementById('eraser-toggle');
    
    // Referencias a botones (con checks nulos)
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
    
    // ✅ CORRECCIÓN FINAL: Guardar coordenadas LAST del dedo/puntero
    // Esto evita que el drawing empiece con gaps en cada touch event
    let lastPos = { x: -1, y: -1 }; 
    let startX = null;
    let startY = null;
    
    // Inicializar canvas
    function init() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Configurar touch-action para evitar scroll
        if (canvas) {
            canvas.style.touchAction = 'none';
        }
    }
    
    init();
    
    // 📱 FUNCIÓN KEY: Obtener coordenadas RELATIVAS al canvas en TODO dispositivo
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } else if (e.clientX !== undefined) {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
        
        return null;
    }
    
    // 🎨 DIBUJAR - Función principal que escribe en canvas
    function draw(x, y) {
        // Dibujar línea desde última posición
        ctx.beginPath();
        if (lastPos.x !== -1) {
            ctx.moveTo(lastPos.x, lastPos.y);
        } else {
            // Si es primer toque, usar x,y actual como start
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
        
        // DIBUJAR EN CANVAS
        ctx.stroke();
        
        // Actualizar última posición
        lastPos.x = x;
        lastPos.y = y;
    }
    
    // 📱 TOUCH START - Iniciar dibujo en móvil
    function handleTouchStart(e) {
        e.cancelable && e.preventDefault();
        isDrawing = true;
        
        const coords = getCanvasCoordinates(e);
        if (coords) {
            startX = coords.x;
            startY = coords.y;
            
            // Dibujar punto inicial
            lastPos.x = coords.x;
            lastPos.y = coords.y;
        }
        
        console.log('👆 [TOUCH START]: x=' + (coords?.x || 0) + ', y=' + (coords?.y || 0));
    }
    
    // 📱 TOUCH MOVE - Dibujar mientras se mueve el dedo
    function handleTouchMove(e) {
        e.cancelable && e.preventDefault();
        
        if (!isDrawing) return;
        
        const coords = getCanvasCoordinates(e);
        if (coords) {
            draw(coords.x, coords.y);
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
                startX = coords.x;
                startY = coords.y;
                lastPos.x = coords.x;
                lastPos.y = coords.y;
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
            lastPos.x = -1; // Resetear última posición
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
    
    console.log('✅ DibujaSimple v3.0 - Listo! Touch events funcionando en iOS/Android ✅');
});
