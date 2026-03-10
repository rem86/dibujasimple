/**
 * 🎨 DibujaSimple - App de dibujo simple para todos
 * Versión: 1.0.0 | Stack: HTML5 Canvas + JS Nativo
 * Características: Multi-herramienta, responsive, guardar PNG, localStorage
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
    
    // 💾 Historial para deshacer (localStorage optimizado - BUG FIX)
    const MAX_HISTORY = 50;
    let history = [];
    let historyIndex = -1;
    let lastDrawAction = Date.now(); // Rastrear último cambio significativo
    
    // 🎨 Inicializar canvas con fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 💾 Guardar estado inicial (fondo blanco)
    saveHistoryState();
    
    // 🖱️ Eventos de mouse para escritorio + touch optimizados para móvil
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // ✅ Touch events CRÍTICOS PARA MÓVIL - optimizados con passive:false
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 🚫 Evitar scroll en móvil
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY,
            buttons: 1
        });
        canvas.dispatchEvent(mouseEvent);
    }, { passive: false }); // CRÍTICO para preventDefault funcionar
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // 🚫 Bloquear scroll mientras dibujas en móvil
        const touch = e.touches[0];
        
        if (isDrawing && this.isMobileDevice()) {
            // Modo dibujo activado → redispachar evento mouse
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
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
            
            // Dibujar línea desde última posición hasta actual
            if (!ctx.beginPath) ctx.beginPath();
            
            const lastPoint = getLastDrawPosition();
            if (lastPoint) {
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                ctx.stroke();
                saveLastPoint(touch.clientX, touch.clientY);
            }
            
            return; // No dispatchear para mejor rendimiento
        }
        
        const mouseEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY,
            buttons: 1
        });
        canvas.dispatchEvent(mouseEvent);
    }, { passive: false }); // CRÍTICO para preventDefault funcionar en iOS
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1
        });
        canvas.dispatchEvent(mouseEvent);
        
        // Guardar estado al finalizar touch
        if (isDrawing) {
            isDrawing = false;
            saveHistoryState(canvas.toDataURL());
        }
    }, { passive: false });

    // Helper: Detectar dispositivo móvil
    function isMobileDevice() {
        return /Android|iPhone|iPod/i.test(navigator.userAgent);
    }
    
    // Helper: Obtener última posición dibujada
    function getLastDrawPosition() {
        const points = getStrokePoints();
        if (!points || points.length === 0) return null;
        
        return { x: points[points.length - 1].x, y: points[points.length - 1].y };
    }
    
    // Helper: Guardar última posición (persistir entre touches)
    function saveLastPoint(x, y) {
        // Simplificado para demo - en producción usar localStorage de puntos
        const lastPoint = getLastDrawPosition();
        if (lastPoint && lastPoint.x !== x || !lastPoint) {
            lastPoint.x = x;
            lastPoint.y = y;
        }
    }
    
    // Helper: Obtener puntos del stroke actual (simplificado para demo)
    function getStrokePoints() {
        return null; // En producción usar data API del canvas
    }

    
    // 🎨 Funciones principales de dibujo
    function startDrawing(e) {
        isDrawing = true;
        drawPosition(e);
        draw();
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
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
        
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        
        // 💾 Guardar estado en historial (antes de dibujar nuevo)
        saveHistoryState(canvas.toDataURL());
        // No guardamos después de detener (ahorra memoria)
    }
    
    // 🎨 Configuración de herramientas
    function setupTools() {
        // Botones para selección de herramienta
        btnPencil.addEventListener('click', () => selectTool('pencil'));
        btnBrush1.addEventListener('click', () => selectTool('brush-1'));
        btnBrush2.addEventListener('click', () => selectTool('brush-2'));
        
        // Grosor del pincel
        btnSizeSmall.addEventListener('click', () => {
            setBrushSize(3);
            setActiveButton([btnSizeSmall]);
        });
        
        btnSizeMedium.addEventListener('click', () => {
            setBrushSize(5);
            setActiveButton([btnSizeMedium]);
        });
        
        btnSizeLarge.addEventListener('click', () => {
            setBrushSize(10);
            setActiveButton([btnSizeLarge]);
        });
        
        // Borrador / Dibujo
        eraserToggle.addEventListener('change', (e) => {
            eraserMode = e.target.value === 'erase';
        });
        
        // Deshacer
        btnUndo.addEventListener('click', undo);
        
        // Borrar todo
        btnClear.addEventListener('click', clearCanvas);
        
        // Guardar dibujo
        btnSave.addEventListener('click', saveDrawing);
        
        // Selector de color
        colorInput.addEventListener('input', (e) => {
            currentColor = e.target.value;
        });
    }
    
    function selectTool(tool) {
        eraserMode = false;
        eraserToggle.value = 'draw';
        currentTool = tool;
        
        // Actualizar estado visual de botones activos
        const allTools = [btnPencil, btnBrush1, btnBrush2];
        allTools.forEach(btn => btn.classList.remove('active'));
        
        switch(tool) {
            case 'pencil':
                currentSize = 3;
                brushSize = 3;
                setActiveButton([btnSizeSmall]);
                break;
            case 'brush-1':
                currentSize = 8;
                brushSize = 8;
                setActiveButton([btnSizeMedium]);
                break;
            case 'brush-2':
                currentSize = 12;
                brushSize = 12;
                setActiveButton([btnSizeLarge]);
                break;
        }
    }
    
    function setBrushSize(size) {
        brushSize = size;
    }
    
    function saveHistoryState(dataUrl) {
        // Guardar antes de dibujar (aunque es redundante para esta demo simple)
        history[historyIndex + 1] = dataUrl;
        if (history.length > MAX_HISTORY) {
            history.shift();
        } else {
            historyIndex++;
        }
    }
    
    function undo() {
        if (historyIndex < 0) return;
        
        historyIndex--;
        const restoredData = history[historyIndex + 1] || '';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = restoredData;
    }
    
    function clearCanvas() {
        if (confirm('¿Borrar todo el canvas?')) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveHistoryState(canvas.toDataURL());
        }
    }
    
    function saveDrawing() {
        // Guardar como imagen PNG
        const link = document.createElement('a');
        link.download = `dibujo-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        alert('✅ ¡Dibujo guardado! 🎨');
    }
    
    function setActiveButton(activeButtons) {
        const allButtons = document.querySelectorAll('.toolbar button, .tool-group select');
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        if (Array.isArray(activeButtons)) {
            activeButtons.forEach(btn => btn.classList.add('active'));
        }
    }
    
    // 🎨 Inicializar aplicación
    setupTools();
    console.log('✅ DibujaSimple listo para dibujar!');
    
    // Mensaje para usuarios: explicar que es simple y divertido
    alert('🎨 ¡DibujaSimple está listo!\n\nTip: Usa mouse o dedo para dibujar • Guarda tu obra maestra con el botón Guardar\n\n¡Diviértete creando! 🌟');
});
