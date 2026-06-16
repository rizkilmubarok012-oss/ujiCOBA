/**
 * Qolbul Qur'an - Fitur Favorit
 */

const FAVORITE_KEY = 'favoriteAyat';
let favoritesCache = null;

function getFavorites() {
    if (favoritesCache !== null) return favoritesCache;
    try {
        const data = localStorage.getItem(FAVORITE_KEY);
        favoritesCache = data ? JSON.parse(data) : [];
        return favoritesCache;
    } catch {
        favoritesCache = [];
        return favoritesCache;
    }
}

function saveFavorites(favorites) {
    favoritesCache = favorites;
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

function isAyatFavorite(key) {
    return getFavorites().includes(key);
}

function toggleFavorite(key) {
    let favorites = getFavorites();
    const index = favorites.indexOf(key);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Dihapus dari favorit');
    } else {
        favorites.push(key);
        showToast('Ditambahkan ke favorit');
    }
    
    saveFavorites(favorites);
    renderFavorites();
    updateBadges();
}

function renderFavorites() {
    const container = document.getElementById('favorit-list');
    const empty = document.getElementById('favorit-empty');
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    
    const fragment = document.createDocumentFragment();
    
    favorites.forEach(key => {
        const [suratId, ayatIndex] = key.split('-').map(Number);
        const surat = READINGS_DATA.find(s => s.id === suratId);
        if (surat && surat.verses[ayatIndex]) {
            const ayat = surat.verses[ayatIndex];
            const item = document.createElement('div');
            item.className = 'fav-item glass-card';
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
                let favorites = getFavorites();
                const index = favorites.indexOf(key);
                if (index > -1) {
                    favorites.splice(index, 1);
                    saveFavorites(favorites);
                    renderFavorites();
                    updateAllAyatButtons();
                    updateBadges();
                    showToast('Dihapus dari favorit');
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

function initFavorites() {
    renderFavorites();
}