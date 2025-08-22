// Script para modificar os botões da página
(function() {
    let attempts = 0;
    const maxAttempts = 10;
    
    function modifyButtons() {
        attempts++;
        console.log(`Tentativa ${attempts} de modificar botões`);
        
        // Aguarda um pouco para o React renderizar
        setTimeout(() => {
            // Procura por botões de diferentes formas
            const allButtons = [
                ...document.querySelectorAll('button'),
                ...document.querySelectorAll('a[role="button"]'),
                ...document.querySelectorAll('[class*="button"]'),
                ...document.querySelectorAll('[class*="btn"]'),
                ...document.querySelectorAll('a[class*="cta"]'),
                ...document.querySelectorAll('[onclick]')
            ];
            
            // Remove duplicatas
            const buttons = [...new Set(allButtons)];
            
            console.log(`Encontrados ${buttons.length} botões únicos`);
            
            if (buttons.length === 0 && attempts < maxAttempts) {
                setTimeout(modifyButtons, 1000);
                return;
            }
            
            // Ordena botões pela posição vertical na página
            buttons.sort((a, b) => {
                const aRect = a.getBoundingClientRect();
                const bRect = b.getBoundingClientRect();
                return aRect.top - bRect.top;
            });
            
            buttons.forEach((button, index) => {
                const text = button.textContent?.trim() || button.getAttribute('aria-label') || '';
                console.log(`Botão ${index + 1}:`, text, button.tagName, button.className);
                
                // Remove event listeners existentes (clonando o elemento)
                const newButton = button.cloneNode(true);
                button.parentNode?.replaceChild(newButton, button);
                
                // Primeiro botão - scroll para seção de bônus/valor
                if (index === 0) {
                    newButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Primeiro botão clicado - buscando seção de bônus/preço');
                        
                        // Lista de seletores para encontrar seção de preço/bônus
                        const selectors = [
                            '[id*="bonus"]', '[class*="bonus"]',
                            '[id*="preco"]', '[class*="preco"]', 
                            '[id*="price"]', '[class*="price"]',
                            '[id*="valor"]', '[class*="valor"]',
                            'h2:contains("Bônus")', 'h2:contains("Preço")', 'h2:contains("Valor")',
                            'h3:contains("Bônus")', 'h3:contains("Preço")', 'h3:contains("Valor")',
                            '[class*="highlight"]', '[class*="offer"]'
                        ];
                        
                        let targetSection = null;
                        
                        for (const selector of selectors) {
                            targetSection = document.querySelector(selector);
                            if (targetSection) {
                                console.log('Seção encontrada:', selector);
                                break;
                            }
                        }
                        
                        // Se não encontrar seção específica, procura por texto
                        if (!targetSection) {
                            const allElements = document.querySelectorAll('*');
                            for (const element of allElements) {
                                const text = element.textContent?.toLowerCase();
                                if (text && (text.includes('bônus') || text.includes('preço') || text.includes('valor') || text.includes('r$'))) {
                                    targetSection = element;
                                    console.log('Seção encontrada por texto:', text.substring(0, 50));
                                    break;
                                }
                            }
                        }
                        
                        if (targetSection) {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            // Fallback: vai para 60% da página
                            console.log('Seção não encontrada, fazendo scroll para 60% da página');
                            window.scrollTo({ 
                                top: document.documentElement.scrollHeight * 0.6, 
                                behavior: 'smooth' 
                            });
                        }
                    });
                    
                    console.log('Primeiro botão configurado para scroll');
                }
                
                // Segundo botão - redireciona para Kiwify
                if (index === 1) {
                    newButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Segundo botão clicado - redirecionando para Kiwify');
                        
                        // Abre em nova aba
                        window.open('https://pay.kiwify.com.br/bdLzvkH', '_blank');
                    });
                    
                    console.log('Segundo botão configurado para Kiwify');
                }
            });
            
        }, 500);
    }
    
    // Inicia quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyButtons);
    } else {
        modifyButtons();
    }
    
    // Observer para detectar mudanças no DOM (caso o React adicione elementos depois)
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });
        
        if (shouldCheck && attempts < maxAttempts) {
            setTimeout(modifyButtons, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
