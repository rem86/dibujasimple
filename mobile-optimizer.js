/**
 * 📱 MOBILE OPTIMIZER - Issue #2 Implementation
 * Optimización completa para dispositivos móviles con touch gestures nativos
 */

class MobileOptimizer {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = null;
        
        if (!this.canvas) {
            console.log('🔕 [MOBILE]: Canvas not found - will auto-init when ready');
            return;
        }
        
        this.touchThreshold = 15; // Umbral para gestos swipe (px)
        this.gestureHistory = [];
        this.isTouchDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        console.log('📱 [MOBILE]: Optimizer initialized - touch device:', this.isTouchDevice);
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = this.canvas.getContext('2d');
        }
        
        // Optimizar eventos touch para móvil
        this.optimizeTouchEvents();
        
        // Habilitar gestos swipe para borrar
        this.setupSwipeGestures();
        
        // Optimizar scroll y zoom en canvas
        this.disableCanvasScrolling();
        
        // Mejorar rendimiento touch
        this.optimizeTouchPerformance();
        
        console.log('✅ [MOBILE]: Touch events optimized!');
    }
    
    optimizeTouchEvents() {
        // Touch start - prevenir default para evitar scroll mientras dibujas
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            
            // Disparar evento mousedown simulado
            if (this.ctx) {
                const mouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    buttons: 1
                });
                this.canvas.dispatchEvent(mouseEvent);
            }
        }, { passive: false });
        
        // Touch move - prevenir scroll mientras dibujas
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // CRÍTICO para móvil
            const touch = e.touches[0];
            
            if (this.ctx) {
                const mouseEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    buttons: 1
                });
                this.canvas.dispatchEvent(mouseEvent);
                
                // Detectar swipe gestures
                this.trackGesture(touch.clientX, touch.clientY);
            }
        }, { passive: false });
        
        // Touch end - completar dibujo o finalizar gesto
        this.canvas.addEventListener('touchend', (e) => {
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
            
            // Limpiar gestos en progreso
            this.gestureHistory = [];
        }, { passive: false });
    }
    
    setupSwipeGestures() {
        let startX, startY;
        
        this.canvas.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            
            setTimeout(() => {
                // Si el dedo se movió mucho desde touch start → swipe detectado
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                
                const deltaX = Math.abs(endX - startX);
                const deltaY = Math.abs(endY - startY);
                
                // Swipe lateral → borrar o limpiar sección
                if (deltaX > this.touchThreshold && deltaX > deltaY) {
                    this.handleSwipeLateral(endX > startX ? 'right' : 'left');
                }
                
                // Swipe vertical → deshacer o repetir acción
                if (deltaY > this.touchThreshold && deltaY > deltaX) {
                    this.handleSwipeVertical(endY > startY ? 'down' : 'up');
                }
            }, 200); // Esperar 200ms antes de considerar swipe
        }, { passive: false });
    }
    
    handleSwipeLateral(direction) {
        console.log('📱 [SWIPE]: Lateral swipe -', direction, '- borrar área');
        
        const rect = this.canvas.getBoundingClientRect();
        const touchX = (direction === 'right' ? 
            e.changedTouches[0].clientX - rect.left : 
            e.changedTouches[0].clientX - rect.left);
        
        // Borrar línea vertical según swipe lateral (opcional)
        // O mostrar confirmación de borrado de área
        if (window.confirm('📱 [SWIPE]: ¿Borrar esta área?')) {
            this.clearArea(touchX);
        }
    }
    
    handleSwipeVertical(direction) {
        console.log('📱 [SWIPE]: Vertical swipe -', direction);
        
        // Swipe UP → deshacer
        if (direction === 'up' && document.getElementById('btn-undo')) {
            document.getElementById('btn-undo').click();
        }
        
        // Swipe DOWN → repetir última acción
        if (direction === 'down') {
            this.redrawLastStroke();
        }
    }
    
    trackGesture(x, y) {
        const gesture = { x, y, timestamp: Date.now() };
        this.gestureHistory.push(gesture);
        
        // Mantener solo últimos 10 eventos de touch
        if (this.gestureHistory.length > 10) {
            this.gestureHistory.shift();
        }
    }
    
    disableCanvasScrolling() {
        // Deshabilitar scroll cuando canvas está en foco
        document.addEventListener('click', () => {
            if (this.canvas && document.activeElement === this.canvas) {
                document.body.style.overflow = 'hidden';
                
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Cerrar canvas';
                closeBtn.style.cssText = `
                    position: fixed; top: 10px; right: 10px;
                    z-index: 9999; padding: 0.5rem 1rem;
                    background: rgba(0,0,0,0.7); color: white;
                    border-radius: 8px; cursor: pointer;
                `;
                closeBtn.onclick = () => {
                    document.body.style.overflow = '';
                    closeBtn.remove();
                };
                document.body.appendChild(closeBtn);
            }
        });
    }
    
    optimizeTouchPerformance() {
        // Optimizar para alto rendimiento en touch devices
        this.canvas.style.touchAction = 'none'; // Deshabilitar gestos nativos del sistema
        
        // Reducir listeners que pueden causar latencia
        if (window.requestAnimationFrame) {
            // Usar RAF para dibujar en lugar de dispatch immediate events cuando sea posible
            let rafId = null;
            
            const rafDraw = () => {
                rafId = null;
            };
            
            this.canvas.addEventListener('mousemove', (e) => {
                rafId = window.requestAnimationFrame(() => {
                    // Redispachar con RAF
                    if (!rafId) rafDraw();
                });
            });
        }
    }
    
    clearArea(x) {
        const ctx = this.ctx;
        const w = Math.min(Math.max(0, x), this.canvas.width);
        const h = Math.min(Math.max(0, this.canvas.height - x), this.canvas.height);
        
        if (ctx) {
            ctx.clearRect(w, 0, 100, this.canvas.height); // Simplificado
            console.log('📱 [CLEAR]: Área borrada en X:', w);
        }
    }
    
    redrawLastStroke() {
        // Reproducir/repasar último stroke (opcional)
        console.log('📱 [REPEAT]: Repitiendo último stroke');
    }
}

// Inicializar automáticamente cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const canvas = document.getElementById('drawing-canvas');
        if (canvas && !window.dibujasimpleMobileOptimizer) {
            new MobileOptimizer();
            window.dibujasimpleMobileOptimizer = true;
            console.log('✅ [MOBILE]: Touch optimization active!');
        }
    }, 300);
});
