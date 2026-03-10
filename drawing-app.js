/**
 * 🎨 DibujaSimple v3.4 - CORRECCIÓN OFFSET PERFECTA
 * Usa display size, no natural width/height
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 DibujaSimple v3.4 - Offset corregido perfectamete...');
    
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // ✅ SOLUCIÓN: Usar display size, no natural width
    // Esto elimina cualquier offset entre CSS y natural
    const displayWidth = canvas.offsetWidth || canvas.width;
    const displayHeight = canvas.offsetHeight || canvas.height;
    
    console.log('[OFFSET]: Display size:', displayWidth, 'x', displayHeight);
    
    // Fondo blanco (usa display dimensions)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, displayWidth, displayHeight);
    
    // Variables simples
    let drawing = false;
    let lastX = null;
    let lastY = null;
    
    // 📱 TOUCH: DIBUJAR usando DISPLAY SIZE (no natural)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        
        // ✅ CORRECCIÓN: Posición relativa al display size visible
        const rect = canvas.getBoundingClientRect();
        
        // Display width es igual a CSS width, no hay offset aquí
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        
        // DIBUJAR EN POSICIÓN EXACTA (sin compensación adicional)
        drawing = true;
        lastX = x;
        lastY = y;
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (!drawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        // ✅ COORDENADAS RELATIVAS AL ELEMENTO VISIBLE
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        
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
    
    // DIBUJAR - Usar display coordinates exactas
    function draw(x, y) {
        const rect = canvas.getBoundingClientRect();
        
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
            ctx.fillRect(0, 0, displayWidth, displayHeight);
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
    
    // Debug log para verificar offset
    setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        console.log('[DEBUG]: Display size:', displayWidth, 'x', displayHeight);
        console.log('[DEBUG]: CSS position:', rect.left.toFixed(2), rect.top.toFixed(2));
        console.log('✅ DibujaSimple v3.4 - Offset corregido con display size!');
    }, 500);
});
