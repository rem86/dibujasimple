/**
 * 🎨 DibujaSimple - App de dibujo simple para todos (CORREGIDO MÓVIL)
 * Versión: 2.0.2 | Stack: HTML5 Canvas + JS Nativo optimizado
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 [MOBILE FIX]: DibujaSimple inicializando...');
    
    // 🔧 Elementos DOM
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('color-input');
    const eraserToggle = document.getElementById('eraser-toggle');
    
    const btnPencil = document.getElementById('btn-pencil');
    const btnBrush1 = document.getElementById('btn-brush-1');
    const btnBrush2 = document.getElementById('btn-brush-2');
    const btnSizeSmall = document.getElementById('btn-size-small');
    const btnSizeMedium = document.getElementById('btn-size-medium');
    const btnSizeLarge = document.getElementById('btn-size-large');
    const btnUndo = document.getElementById('btn-undo');
    const btnClear = document.getElementById('btn-clear');
    const btnSave = document.getElementById('btn-save');
    
    // 🎯 Variables del canvas
    let isDrawing = false;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let currentSize = 5;
    let brushSize = 5;
    let eraserMode = false;
    
    // 💾 Historial para deshacer (localStorage optimizado)
    const MAX_HISTORY = 50;
    let history = [];
    let historyIndex = -1;
    
    // 📱 CORRECCIÓN MÓVIL: dimensiones reales vs CSS
    let realWidth = canvas.width;
    let realHeight = canvas.height;
    let scaleX = canvas.width / canvas.offsetWidth; // Ratio escalado
    let scaleY = canvas.height / canvas.offsetHeight;
    let lastDrawPosition = { x: 0, y: 0 }; 
    
    // 📱 Detectar si es móvil para ajustar cálculos
    function getRealCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        
        if (e.touches && e.touches.length > 0) {
            return {
                x: (e.touches[0].clientX - rect.left),
                y: (e.touches[0].clientY - rect.top)
            };
        } else if (e.clientX !== undefined) {
            return {
                x: (e.clientX - rect.left),
                y: (e.clientY - rect.top)
            };
        }
        
        return { x: 0, y: 0 };
    }
    
    // 🎨 Inicializar canvas con fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, realWidth, realHeight);
    
    saveHistoryState();
    
    // 🖱️ Eventos de mouse para escritorio
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        
        const coords = getRealCoordinates(e);
        lastDrawPosition.x = coords.x;
        lastDrawPosition.y = coords.y;
        startDrawing();
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        const coords = getRealCoordinates(e);
        draw(coords.x, coords.y);
    });
    
    canvas.addEventListener('mouseup', () => {
        if (isDrawing) {
            isDrawing = false;
            saveHistoryState();
        }
    });
    
    // ✅ Touch events optimizados para móviles - COORDENADAS CORREGIDAS
    canvas.addEventListener('touchstart', (e) => {
        e.cancelable && e.preventDefault();
        
        const coords = getRealCoordinates(e);
        
        isDrawing = true;
        lastDrawPosition.x = coords.x;
        lastDrawPosition.y = coords.y;
        
        console.log('👆 [TOUCH]: Started drawing at X:', Math.round(coords.x));
        startDrawing();
    }, { passive: false }); // CRÍTICO para iOS + Android
    
    canvas.addEventListener('touchmove', (e) => {
        e.cancelable && e.preventDefault();
        
        if (!isDrawing) return;
        
        const coords = getRealCoordinates(e);
        draw(coords.x, coords.y);
    }, { passive: false }); // CRÍTICO para iOS + Android
    
    canvas.addEventListener('touchend', (e) => {
        e.cancelable && e.preventDefault();
        
        if (isDrawing) {
            isDrawing = false;
            saveHistoryState();
        }
        
        console.log('👆 [TOUCH]: Drawing ended');
    }, { passive: false });
    
    // 🎨 Función principal de dibujo
    function startDrawing() {
        // Iniciar nuevo path si es necesario
        if (!ctx.beginPath) ctx.beginPath();
    }
    
    function draw(x, y) {
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
        
        // Dibujar desde última posición hasta actual
        ctx.beginPath();
        ctx.moveTo(lastDrawPosition.x, lastDrawPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastDrawPosition.x = x;
        lastDrawPosition.y = y;
    }
