/**
 * 🎨 DibujaSimple - Versión ULTRA SIMPLE que SÍ FUNCIONA
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 INICIALIZANDO...');
    
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Variables simples
    let drawing = false;
    let lastX = null;
    let lastY = null;
    
    // 📱 TOUCH: DIBUJAR EXACTAMENTE DONDE TOCAS
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        // ✅ COORDENADAS EXACTAS - SIN NINGUNA COMPENSACIÓN
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
        
        drawing = true;
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (!drawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        // ✅ DIBUJAR EN LA POSICIÓN EXACTA DEL TOQUE
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        draw(x, y);
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => {
        drawing = false;
    }, { passive: false });
    
    // 🖱️ MOUSE para PC
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        drawing = true;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        
        const rect = canvas.getBoundingClientRect();
        draw(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    canvas.addEventListener('mouseup', () => {
        drawing = false;
    });
    
    // DIBUJAR
    function draw(x, y) {
        ctx.beginPath();
        
        if (lastX === null) {
            lastX = x;
            lastY = y;
        } else {
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        lastX = x;
        lastY = y;
    }
    
    // Herramientas básicas
    const colorInput = document.getElementById('color-input');
    const eraserToggle = document.getElementById('eraser-toggle');
    const btnClear = document.getElementById('btn-clear');
    const btnSave = document.getElementById('btn-save');
    
    if (colorInput) {
        colorInput.addEventListener('input', () => {
            ctx.strokeStyle = colorInput.value;
        });
    }
    
    if (eraserToggle) {
        eraserToggle.addEventListener('change', (e) => {
            ctx.globalCompositeOperation = e.target.value === 'erase' ? 'destination-out' : 'source-over';
            ctx.strokeStyle = e.target.value === 'erase' ? 'white' : '#000000';
        });
    }
    
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lastX = null;
        });
    }
    
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL();
            a.download = 'dibujo.png';
            a.click();
        });
    }
    
    console.log('✅ READY - Touch events funcionando!');
});
