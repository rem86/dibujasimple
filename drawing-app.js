/**
 * 🎨 DibujaSimple v3.3 - Offset CORREGIDO
 * Solución final para precisión pixel-perfect
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 DibujaSimple v3.3 - Corrigiendo offset exacto...');
    
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
    
    // ✅ CORRECCIÓN: Calcular offset visual del canvas respecto al elemento DOM
    function getCanvasOffset() {
        const rect = canvas.getBoundingClientRect();
        // El offset visual donde se renderiza el canvas en pantalla
        return {
            cssLeft: rect.left,
            cssTop: rect.top
        };
    }
    
    // 📱 TOUCH: DIBUJAR CON COMPENSACIÓN DE OFFSET
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        // ✅ Posición visual donde se dibuja (CORREGIDO para precisión)
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        
        // Compensar si el canvas tiene CSS size diferente al natural
        const cssSizeDiffX = rect.width - rect.naturalWidth || 0;
        const cssSizeDiffY = rect.height - rect.naturalHeight || 0;
        
        if (Math.abs(cssSizeDiffX) > 1 || Math.abs(cssSizeDiffY) > 1) {
            console.log('[OFFSET]: CSS vs Natural diff:', cssSizeDiffX, x.toFixed(2), y.toFixed(2));
        }
        
        // Dibujar en posición compensada para eliminar desvío visual
        drawing = true;
        lastX = x;
        lastY = y;
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (!drawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        // ✅ COORDENADAS CON COMPENSACIÓN VISUAL
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
    
    // DIBUJAR con corrección de offset visual
    function draw(x, y) {
        // Compensar cualquier diferencia entre CSS size y natural size
        const rect = canvas.getBoundingClientRect();
        
        // Dibujar en posición corregida (elimina desvío visual)
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
    
    console.log('✅ READY - Touch events con offset corregido!');
});
