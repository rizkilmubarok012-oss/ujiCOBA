/**
 * Qolbul Qur'an - Halaman Semua Surat
 */

function renderSuratList(filter = '') {
    const container = document.getElementById('surat-list');
    const searchLower = filter.trim().toLowerCase();
    
    let filteredData = READINGS_DATA;
    if (searchLower) {
        filteredData = READINGS_DATA.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(searchLower))
        );
    }

    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding:40px 20px;">
                <span class="empty-icon">🔍</span>
                <p>Tidak ada surat ditemukan</p>
                <span class="empty-sub">Coba kata kunci lain</span>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();
    
    filteredData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'surat-card glass-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-id', item.id);
        
        let displaySubtitle = item.subtitle || '';
        if (displaySubtitle === item.title) {
            displaySubtitle = '';
        }
        
        const isLastRead = (item.id === parseInt(localStorage.getItem('qolbul_last_read_surat')));
        
        card.innerHTML = `
            <div class="card-content">
                <span class="name">${item.title}</span>
                ${displaySubtitle ? `<span class="subtitle">${displaySubtitle}</span>` : ''}
                ${isLastRead ? `<span class="last-read-badge">● Sedang Dibaca</span>` : ''}
            </div>
            <span class="arabic-name">${displaySubtitle || item.title}</span>
            <span class="card-arrow">›</span>
        `;
        
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const surat = READINGS_DATA.find(s => s.id === id);
            if (surat) {
                localStorage.setItem('qolbul_last_read_surat', id);
                openSurat(surat);
            }
        });
        fragment.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
}

function openSurat(surat) {
    window.currentSurat = surat;
    
    saveLastReadSurat(surat.id);
    localStorage.setItem('qolbul_last_read_surat', surat.id);
    
    const titleEl = document.getElementById('baca-title');
    let displaySubtitle = surat.subtitle || '';
    if (displaySubtitle === surat.title) {
        displaySubtitle = '';
    }
    titleEl.innerHTML = `
        ${surat.title}
        ${displaySubtitle ? `<span class="sub">${displaySubtitle}</span>` : ''}
    `;

    const container = document.getElementById('baca-container');
    const fragment = document.createDocumentFragment();
    
    surat.verses.forEach((ayat, index) => {
        const ayatKey = `${surat.id}-${index}`;
        const isFavorite = isAyatFavorite(ayatKey);
        const isCompleted = isAyatCompleted(ayatKey);
        
        const card = document.createElement('div');
        card.className = 'ayat-card glass-card';
        card.dataset.key = ayatKey;
        card.dataset.index = index;
        
        let arabText = ayat.arabic || '';
        if (arabText) {
            arabText = arabText.replace(/\n/g, ' ');
        }
        
        // Hapus emoji dari tombol
        const favText = isFavorite ? 'Favorit' : 'Favorit';
        const doneText = isCompleted ? 'Selesai' : 'Selesai';
        
        card.innerHTML = `
            ${ayat.arabic ? `<div class="arabic">${arabText}</div>` : ''}
            ${ayat.latin ? `<div class="latin">${ayat.latin}</div>` : ''}
            ${ayat.translation ? `<div class="translation">${ayat.translation}</div>` : ''}
            <div class="ayat-actions">
                <button class="btn-fav ${isFavorite ? 'active' : ''}" data-key="${ayatKey}">
                    ${isFavorite ? '★' : '☆'} ${favText}
                </button>
                <button class="btn-done ${isCompleted ? 'active' : ''}" data-key="${ayatKey}">
                    ${isCompleted ? '✓' : '□'} ${doneText}
                </button>
                <button class="btn-copy" data-key="${ayatKey}">
                    📋 Salin
                </button>
            </div>
        `;
        
        card.querySelector('.btn-fav').addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.key;
            toggleFavorite(key);
            updateAyatButtons(key);
            updateBadges();
        });
        
        card.querySelector('.btn-done').addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.key;
            toggleCompleted(key);
            updateAyatButtons(key);
            updateBadges();
        });
        
        card.querySelector('.btn-copy').addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.key;
            const [suratId, ayatIndex] = key.split('-').map(Number);
            const surat = READINGS_DATA.find(s => s.id === suratId);
            if (surat && surat.verses[ayatIndex]) {
                const ayat = surat.verses[ayatIndex];
                const text = [ayat.arabic, ayat.latin, ayat.translation].filter(Boolean).join('\n');
                copyToClipboard(text);
            }
        });
        
        fragment.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
    navigateTo('baca', true);
    
    const savedScroll = localStorage.getItem('qolbul_scroll_position');
    if (savedScroll) {
        setTimeout(() => {
            const position = parseInt(savedScroll);
            if (position > 0) {
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
            localStorage.removeItem('qolbul_scroll_position');
        }, 300);
    }
}

function openSuratWithAyat(surat, targetAyatIndex) {
    window.currentSurat = surat;
    
    saveLastReadSurat(surat.id);
    localStorage.setItem('qolbul_last_read_surat', surat.id);
    
    const titleEl = document.getElementById('baca-title');
    let displaySubtitle = surat.subtitle || '';
    if (displaySubtitle === surat.title) {
        displaySubtitle = '';
    }
    titleEl.innerHTML = `
        ${surat.title}
        ${displaySubtitle ? `<span class="sub">${displaySubtitle}</span>` : ''}
    `;

    const container = document.getElementById('baca-container');
    const fragment = document.createDocumentFragment();
    
    surat.verses.forEach((ayat, index) => {
        const ayatKey = `${surat.id}-${index}`;
        const isFavorite = isAyatFavorite(ayatKey);
        const isCompleted = isAyatCompleted(ayatKey);
        
        const card = document.createElement('div');
        card.className = 'ayat-card glass-card';
        card.dataset.key = ayatKey;
        card.dataset.index = index;
        
        if (index === targetAyatIndex) {
            card.style.borderColor = 'var(--primary)';
            card.style.boxShadow = '0 0 0 3px var(--primary-glow), var(--shadow-md)';
            card.style.scrollMargin = '80px';
            card.id = `ayat-${index}`;
        }
        
        let arabText = ayat.arabic || '';
        if (arabText) {
            arabText = arabText.replace(/\n/g, ' ');
        }
        
        const favText = isFavorite ? 'Favorit' : 'Favorit';
        const doneText = isCompleted ? 'Selesai' : 'Selesai';
        
        card.innerHTML = `
            ${ayat.arabic ? `<div class="arabic">${arabText}</div>` : ''}
            ${ayat.latin ? `<div class="latin">${ayat.latin}</div>` : ''}
            ${ayat.translation ? `<div class="translation">${ayat.translation}</div>` : ''}
            <div class="ayat-actions">
                <button class="btn-fav ${isFavorite ? 'active' : ''}" data-key="${ayatKey}">
                    ${isFavorite ? '★' : '☆'} ${favText}
                </button>
                <button class="btn-done ${isCompleted ? 'active' : ''}" data-key="${ayatKey}">
                    ${isCompleted ? '✓' : '□'} ${doneText}
                </button>
                <button class="btn-copy" data-key="${ayatKey}">
                    📋 Salin
                </button>
            </div>
        `;
        
        card.querySelector('.btn-fav').addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.key;
            toggleFavorite(key);
            updateAyatButtons(key);
            updateBadges();
        });
        
        card.querySelector('.btn-done').addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.key;
            toggleCompleted(key);
            updateAyatButtons(key);
            updateBadges();
        });
        
        card.querySelector('.btn-copy').addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.dataset.key;
            const [suratId, ayatIndex] = key.split('-').map(Number);
            const surat = READINGS_DATA.find(s => s.id === suratId);
            if (surat && surat.verses[ayatIndex]) {
                const ayat = surat.verses[ayatIndex];
                const text = [ayat.arabic, ayat.latin, ayat.translation].filter(Boolean).join('\n');
                copyToClipboard(text);
            }
        });
        
        fragment.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
    navigateTo('baca', true);
    
    setTimeout(() => {
        const targetElement = document.getElementById(`ayat-${targetAyatIndex}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                targetElement.style.borderColor = 'var(--border-color)';
                targetElement.style.boxShadow = 'none';
            }, 3000);
        }
    }, 200);
}

function updateAyatButtons(key) {
    const card = document.querySelector(`.ayat-card[data-key="${key}"]`);
    if (!card) return;

    const isFavorite = isAyatFavorite(key);
    const isCompleted = isAyatCompleted(key);

    const favBtn = card.querySelector('.btn-fav');
    const doneBtn = card.querySelector('.btn-done');

    if (favBtn) {
        favBtn.textContent = isFavorite ? '★ Favorit' : '☆ Favorit';
        favBtn.classList.toggle('active', isFavorite);
    }
    if (doneBtn) {
        doneBtn.textContent = isCompleted ? '✓ Selesai' : '□ Selesai';
        doneBtn.classList.toggle('active', isCompleted);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Berhasil disalin!');
        }).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('Berhasil disalin!');
    } catch {
        showToast('Gagal menyalin');
    }
    document.body.removeChild(textarea);
}

function saveScrollPosition() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
        localStorage.setItem('qolbul_scroll_position', scrollY);
    }
}

window.openSuratWithAyat = openSuratWithAyat;
window.openSurat = openSurat;