/**
 * Qolbul Qur'an - Fitur Selesai Dibaca
 */

const COMPLETED_KEY = 'completedAyat';
let completedCache = null;

function getCompleted() {
    if (completedCache !== null) return completedCache;
    try {
        const data = localStorage.getItem(COMPLETED_KEY);
        completedCache = data ? JSON.parse(data) : [];
        return completedCache;
    } catch {
        completedCache = [];
        return completedCache;
    }
}

function saveCompleted(completed) {
    completedCache = completed;
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
}

function isAyatCompleted(key) {
    return getCompleted().includes(key);
}

function toggleCompleted(key) {
    let completed = getCompleted();
    const index = completed.indexOf(key);
    
    if (index > -1) {
        completed.splice(index, 1);
        showToast('Batal selesai');
    } else {
        completed.push(key);
        showToast('Ditandai selesai');
    }
    
    saveCompleted(completed);
    renderCompleted();
    updateBadges();
}

function renderCompleted() {
    const container = document.getElementById('selesai-list');
    const empty = document.getElementById('selesai-empty');
    const completed = getCompleted();
    
    if (completed.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    
    const fragment = document.createDocumentFragment();
    
    completed.forEach(key => {
        const [suratId, ayatIndex] = key.split('-').map(Number);
        const surat = READINGS_DATA.find(s => s.id === suratId);
        if (surat && surat.verses[ayatIndex]) {
            const ayat = surat.verses[ayatIndex];
            const item = document.createElement('div');
            item.className = 'done-item glass-card';
            item.dataset.key = key;
            item.dataset.suratId = suratId;
            item.dataset.ayatIndex = ayatIndex;
            item.style.cursor = 'pointer';
            
            item.innerHTML = `
                ${ayat.arabic ? `<div class="arabic">${ayat.arabic}</div>` : ''}
                ${ayat.latin ? `<div class="latin">${ayat.latin}</div>` : ''}
                ${ayat.translation ? `<div class="translation">${ayat.translation}</div>` : ''}
                <div class="item-meta">
                    <span>${surat.title} • Ayat ${ayatIndex + 1}</span>
                    <button class="remove-btn" data-key="${key}">✕ Hapus</button>
                </div>
            `;
            
            item.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-btn')) return;
                
                const suratId = parseInt(this.dataset.suratId);
                const ayatIndex = parseInt(this.dataset.ayatIndex);
                const surat = READINGS_DATA.find(s => s.id === suratId);
                
                if (surat) {
                    openSuratWithAyat(surat, ayatIndex);
                }
            });
            
            item.querySelector('.remove-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                const key = this.dataset.key;
                let completed = getCompleted();
                const index = completed.indexOf(key);
                if (index > -1) {
                    completed.splice(index, 1);
                    saveCompleted(completed);
                    renderCompleted();
                    updateAllAyatButtons();
                    updateBadges();
                    showToast('Dihapus dari selesai');
                }
            });
            
            fragment.appendChild(item);
        }
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
}

function updateAllAyatButtons() {
    document.querySelectorAll('.ayat-card').forEach(card => {
        const key = card.dataset.key;
        if (key) updateAyatButtons(key);
    });
}

function initCompleted() {
    renderCompleted();
}