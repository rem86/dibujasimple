/**
 * 🎨 DibujaSimple - App de dibujo simple para todos (MÓVIL CRÓNICO)
 * Versión: 2.0.1 | Stack: HTML5 Canvas + JS Nativo optimizado
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 DibujaSimple inicializando...');
    
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
    
    // 📱 Optimización móvil
    let isTouchDevice = /Android|iPhone|iPod/i.test(navigator.userAgent);
    let lastDrawPosition = { x: 0, y: 0 }; // Posición última para dibujar líneas continuas
    
    // 🎨 Inicializar canvas con fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    saveHistoryState();
    
    // 🖱️ Eventos de mouse y touch para escritorio y móvil optimizados
    function handlePointerDown(e) {
        e.cancelable && e.preventDefault();
        
        isDrawing = true;
        
        // Obtener coordenadas relativas al canvas
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        lastDrawPosition.x = clientX - rect.left;
        lastDrawPosition.y = clientY - rect.top;
        
        startDrawing();
    }
    
    function handlePointerMove(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        draw(x, y);
    }
    
    function handlePointerUp(e) {
        if (!isDrawing) return;
        
        isDrawing = false;
        saveHistoryState();
    }
    
    // Event listeners unificados - mouse + touch optimizados para móviles
    canvas.addEventListener('mousedown', (e) => {
        e.cancelable && e.preventDefault();
        handlePointerDown(e);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        draw(x, y);
    }, { passive: true });
    
    canvas.addEventListener('mouseup', () => {
        if (isDrawing) {
            isDrawing = false;
            saveHistoryState();
        }
    });
    
    canvas.addEventListener('mouseout', () => {
        if (isDrawing) {
            isDrawing = false;
            saveHistoryState();
        }
    });
    
    // ✅ Touch events CRÍTICOS PARA MÓVIL - optimizados con passive:false
    canvas.addEventListener('touchstart', (e) => {
        e.cancelable && e.preventDefault();
        
        const touch = e.touches[0];
        
        handlePointerDown({
            clientX: touch.clientX,
            clientY: touch.clientY,
            cancelable: true,
            preventDefault: () => {}
        });
    }, { passive: false }); // CRÍTICO para iOS + Android
    
    canvas.addEventListener('touchmove', (e) => {
        e.cancelable && e.preventDefault();
        
        if (!isDrawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        draw(x, y);
    }, { passive: false }); // CRÍTICO para iOS + Android
    
    canvas.addEventListener('touchend', (e) => {
        e.cancelable && e.preventDefault();
        
        handlePointerUp(e);
        
        // Guardar último estado al soltar
        saveHistoryState();
    }, { passive: false });
    
    // 🎨 Funciones principales de dibujo
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
            ctx.strokeStyle = '#ffffff'; // Color blanco para borrar
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
        }
        
        // Dibujar desde última posición hasta actual
        if (lastDrawPosition.x !== x || lastDrawPosition.y !== y) {
            ctx.moveTo(lastDrawPosition.x, lastDrawPosition.y);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Actualizar última posición
            lastDrawPosition.x = x;
            lastDrawPosition.y = y;
        }
    }
    
    function stopDrawing() {
        // Ya manejado por handlePointerUp
    }
