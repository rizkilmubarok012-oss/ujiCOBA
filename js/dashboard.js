/**
 * Qolbul Qur'an - Dashboard
 * Menampilkan statistik dan aktivitas pengguna
 */

function updateDashboard() {
    updateGreeting();
    updateStats();
    updateLastRead();
    updateActivity();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 3 && hour < 11) {
        greeting = 'Selamat Pagi';
    } else if (hour >= 11 && hour < 15) {
        greeting = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
        greeting = 'Selamat Sore';
    } else if (hour >= 18 && hour < 21) {
        greeting = 'Selamat Malam';
    } else {
        greeting = 'Selamat Malam';
    }
    
    const titleEl = document.getElementById('greeting-title');
    const subEl = document.getElementById('greeting-sub');
    
    if (titleEl) titleEl.textContent = greeting;
    if (subEl) subEl.textContent = 'Semoga hari ini penuh berkah';
}

function updateStats() {
    const totalSurat = READINGS_DATA ? READINGS_DATA.length : 0;
    const favorites = getFavorites ? getFavorites() : [];
    const completed = getCompleted ? getCompleted() : [];
    
    let totalAyat = 0;
    if (READINGS_DATA) {
        READINGS_DATA.forEach(surat => {
            if (surat.verses) totalAyat += surat.verses.length;
        });
    }
    
    const progress = totalAyat > 0 ? Math.round((completed.length / totalAyat) * 100) : 0;
    
    const elTotal = document.getElementById('stat-total-surat');
    const elFav = document.getElementById('stat-favorit');
    const elDone = document.getElementById('stat-selesai');
    const elProgress = document.getElementById('stat-progress');
    
    if (elTotal) elTotal.textContent = totalSurat;
    if (elFav) elFav.textContent = favorites.length;
    if (elDone) elDone.textContent = completed.length;
    if (elProgress) elProgress.textContent = progress + '%';
}

function updateLastRead() {
    const container = document.getElementById('last-read-content');
    if (!container) return;
    
    const lastReadId = localStorage.getItem('qolbul_last_read_surat');
    
    if (lastReadId && READINGS_DATA) {
        const surat = READINGS_DATA.find(s => s.id === parseInt(lastReadId));
        if (surat) {
            container.innerHTML = `
                <div class="last-read-item">
                    <span class="last-read-surat">${surat.title || 'Unknown'}</span>
                    <span class="last-read-sub">${surat.subtitle || ''}</span>
                    <span class="last-read-time">${getLastReadTime()}</span>
                    <button class="last-read-btn" onclick="resumeLastRead()">Lanjutkan Baca</button>
                </div>
            `;
            return;
        }
    }
    
    container.innerHTML = `<p class="last-read-empty">Belum ada bacaan. Mulai baca sekarang!</p>`;
}

function getLastReadTime() {
    const saved = localStorage.getItem('qolbul_last_read_time');
    if (saved) {
        const time = new Date(parseInt(saved));
        const now = new Date();
        const diff = Math.floor((now - time) / 1000 / 60);
        
        if (diff < 1) return 'Baru saja';
        if (diff < 60) return diff + ' menit lalu';
        if (diff < 1440) return Math.floor(diff / 60) + ' jam lalu';
        return Math.floor(diff / 1440) + ' hari lalu';
    }
    return 'Belum diketahui';
}

function saveLastReadTime() {
    localStorage.setItem('qolbul_last_read_time', Date.now().toString());
}

function updateActivity() {
    const container = document.getElementById('activity-list');
    if (!container) return;
    
    const activities = getActivities();
    
    if (activities.length === 0) {
        container.innerHTML = `<p class="activity-empty">Belum ada aktivitas. Mulai baca Al-Qur'an!</p>`;
        return;
    }
    
    let html = '';
    const recent = activities.slice(0, 5);
    recent.forEach(activity => {
        const icon = getActivityIcon(activity.type);
        html += `
            <div class="activity-item">
                <span class="activity-item-icon">${icon}</span>
                <div class="activity-item-content">
                    <span class="activity-item-text">${activity.text || 'Aktivitas'}</span>
                    <span class="activity-item-time">${activity.time || ''}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getActivityIcon(type) {
    const icons = {
        'baca': '📖',
        'favorit': '⭐',
        'selesai': '✅',
        'batal-favorit': '🗑️',
        'batal-selesai': '◻'
    };
    return icons[type] || '📌';
}

function getActivities() {
    try {
        const data = localStorage.getItem('qolbul_activities');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveActivity(type, text) {
    try {
        const activities = getActivities();
        const now = new Date();
        const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        activities.unshift({
            type: type,
            text: text,
            time: time,
            timestamp: now.getTime()
        });
        
        if (activities.length > 50) {
            activities.pop();
        }
        
        localStorage.setItem('qolbul_activities', JSON.stringify(activities));
    } catch (e) {
        console.log('Error saving activity:', e);
    }
}

function addActivity(type, text) {
    saveActivity(type, text);
    updateDashboard();
}

function resumeLastRead() {
    const lastId = localStorage.getItem('qolbul_last_read_surat');
    if (lastId && READINGS_DATA) {
        const surat = READINGS_DATA.find(s => s.id === parseInt(lastId));
        if (surat && typeof openSurat === 'function') {
            openSurat(surat);
        }
    }
}

function setupQuickAccess() {
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            if (typeof navigateTo === 'function') {
                navigateTo(page);
            }
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            const targetNav = document.querySelector(`.nav-item[data-page="${page}"]`);
            if (targetNav) targetNav.classList.add('active');
        });
    });
}

function initDashboard() {
    const dashboard = document.getElementById('page-dashboard');
    if (!dashboard) {
        console.log('Dashboard element not found');
        return;
    }
    
    updateDashboard();
    setupQuickAccess();
    console.log('Dashboard loaded successfully!');
}

if (typeof window.toggleFavorite === 'function') {
    const originalToggleFavorite = window.toggleFavorite;
    window.toggleFavorite = function(key) {
        const isFav = typeof isAyatFavorite === 'function' ? isAyatFavorite(key) : false;
        originalToggleFavorite(key);
        
        if (READINGS_DATA) {
            const [suratId] = key.split('-').map(Number);
            const surat = READINGS_DATA.find(s => s.id === suratId);
            if (surat) {
                const action = isFav ? 'batal-favorit' : 'favorit';
                const text = isFav ? 'Batal favorit ' + surat.title : 'Menambahkan ' + surat.title + ' ke favorit';
                addActivity(action, text);
            }
        }
    };
}

if (typeof window.toggleCompleted === 'function') {
    const originalToggleCompleted = window.toggleCompleted;
    window.toggleCompleted = function(key) {
        const isDone = typeof isAyatCompleted === 'function' ? isAyatCompleted(key) : false;
        originalToggleCompleted(key);
        
        if (READINGS_DATA) {
            const [suratId] = key.split('-').map(Number);
            const surat = READINGS_DATA.find(s => s.id === suratId);
            if (surat) {
                const action = isDone ? 'batal-selesai' : 'selesai';
                const text = isDone ? 'Batal selesai ' + surat.title : 'Selesai membaca ' + surat.title;
                addActivity(action, text);
            }
        }
    };
}

if (typeof window.openSurat === 'function') {
    const originalOpenSurat = window.openSurat;
    window.openSurat = function(surat) {
        originalOpenSurat(surat);
        if (surat) {
            addActivity('baca', 'Membaca ' + surat.title);
            saveLastReadTime();
            updateDashboard();
        }
    };
}

if (typeof window.openSuratWithAyat === 'function') {
    const originalOpenSuratWithAyat = window.openSuratWithAyat;
    window.openSuratWithAyat = function(surat, ayatIndex) {
        originalOpenSuratWithAyat(surat, ayatIndex);
        if (surat) {
            addActivity('baca', 'Membaca ' + surat.title + ' (Ayat ' + (ayatIndex + 1) + ')');
            saveLastReadTime();
            updateDashboard();
        }
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initDashboard, 100);
    });
} else {
    setTimeout(initDashboard, 100);
}