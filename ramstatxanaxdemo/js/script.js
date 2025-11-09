class WordSlider {
    constructor(selector) {
        this.words = document.querySelectorAll(selector);
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        // Запускаем смену слов каждые 2 секунды
        setInterval(() => {
            this.nextWord();
        }, 2000);
    }
    
    nextWord() {
        // Скрываем текущее слово
        this.words[this.currentIndex].classList.remove('active');
        
        // Переходим к следующему слову
        this.currentIndex = (this.currentIndex + 1) % this.words.length;
        
        // Показываем новое слово
        this.words[this.currentIndex].classList.add('active');
    }
}

// Запускаем когда страница загрузится
document.addEventListener('DOMContentLoaded', function() {
    new WordSlider('.slider-word');
});

// FAQ функциональность
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем другие открытые вопросы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Открываем/закрываем текущий вопрос
            item.classList.toggle('active');
        });
    });
});
// Scroll animation for phone video
function initPhoneAnimation() {
    const phoneContainer = document.querySelector('.phone-container');
    const phoneSection = document.querySelector('.scale-business');
    const video = document.querySelector('.video-frame');
    
    if (!phoneContainer) return;
    
    // Настройка видео
    if (video) {
        video.controls = false; // Скрыть контролы сначала
        video.muted = true; // Без звука для автозапуска
        video.loop = true; // Зациклить видео
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.boundingClientRect;
                const viewportHeight = window.innerHeight;
                const scrollProgress = 1 - (rect.bottom / (viewportHeight + rect.height));
                
                if (scrollProgress > 0.3) {
                    phoneContainer.classList.add('zoomed');
                    // Автозапуск видео при скролле
                    if (video && video.paused) {
                        video.play().catch(e => console.log('Auto-play prevented:', e));
                    }
                } else {
                    phoneContainer.classList.remove('zoomed');
                    // Пауза видео когда уходим из зоны
                    if (video && !video.paused) {
                        video.pause();
                    }
                }
            } else {
                // Когда секция совсем не видна
                phoneContainer.classList.remove('zoomed');
                if (video && !video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: [0, 0.3, 0.6, 1]
    });
    
    observer.observe(phoneSection);
}

// Play button functionality
function initPlayButton() {
    const playBtn = document.querySelector('.play-btn');
    const video = document.querySelector('.video-frame');
    
    if (playBtn && video) {
        playBtn.addEventListener('click', function() {
            const phoneContainer = this.closest('.phone-container');
            phoneContainer.classList.add('zoomed');
            
            // Запуск видео
            video.play().then(() => {
                video.controls = true; // Показать контролы после запуска
            }).catch(e => {
                console.log('Play failed:', e);
                // Если автозапуск заблокирован, показываем контролы
                video.controls = true;
            });
            
            // Прокручиваем к телефону для лучшего UX
            phoneContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initPhoneAnimation();
    initPlayButton();
    
    // Оптимизация производительности при скролле
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                initPhoneAnimation();
                ticking = false;
            });
            ticking = true;
        }
    });
});