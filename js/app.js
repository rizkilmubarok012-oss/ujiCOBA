/**
 * Qolbul Qur'an - Aplikasi Utama
 */

let searchTimeout = null;
let currentPage = 'dashboard';
let isInitialized = false;
let lastReadSuratId = null;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }, 300);
    initApp();
});

function initApp() {
    if (isInitialized) return;
    isInitialized = true;
    
    if (typeof initSettings === 'function') initSettings();
    if (typeof initFavorites === 'function') initFavorites();
    if (typeof initCompleted === 'function') initCompleted();
    if (typeof initDashboard === 'function') initDashboard();
    if (typeof renderSuratList === 'function') renderSuratList();
    
    setupNavigation();
    setupSearch();
    setupBackButton();
    setupScrollToTop();
    updateBadges();
    loadLastReadSurat();
    
    window.addEventListener('beforeunload', function() {
        const pageBaca = document.getElementById('page-baca');
        if (pageBaca && pageBaca.classList.contains('active')) {
            saveScrollPosition();
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        const pageBaca = document.getElementById('page-baca');
        if (document.hidden && pageBaca && pageBaca.classList.contains('active')) {
            saveScrollPosition();
        }
    });
}

function loadLastReadSurat() {
    try {
        const saved = localStorage.getItem('qolbul_last_read');
        if (saved) {
            const data = JSON.parse(saved);
            lastReadSuratId = data.suratId;
        }
    } catch (e) {
        console.log('Error loading last read:', e);
    }
}

function saveLastReadSurat(suratId) {
    try {
        localStorage.setItem('qolbul_last_read', JSON.stringify({ suratId: suratId }));
        lastReadSuratId = suratId;
    } catch (e) {
        console.log('Error saving last read:', e);
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const page = this.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page, preserveBaca = false) {
    if (page === 'baca' && !preserveBaca) {
        return;
    }
    
    currentPage = page;
    
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.toggle('active', nav.dataset.page === page);
    });
    
    const pageMap = {
        dashboard: 'page-dashboard',
        semua: 'page-semua',
        baca: 'page-baca',
        favorit: 'page-favorit',
        selesai: 'page-selesai',
        pengaturan: 'page-pengaturan'
    };
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageMap[page]);
    if (target) target.classList.add('active');
    
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        if (page === 'semua') {
            searchContainer.style.display = 'block';
            setTimeout(() => {
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.focus();
            }, 300);
        } else {
            searchContainer.style.display = 'none';
        }
    }
    
    if (page === 'favorit' && typeof renderFavorites === 'function') renderFavorites();
    if (page === 'selesai' && typeof renderCompleted === 'function') renderCompleted();
    if (page === 'dashboard' && typeof updateDashboard === 'function') updateDashboard();
    if (page === 'semua' && typeof renderSuratList === 'function') {
        const searchVal = document.getElementById('search-input')?.value || '';
        renderSuratList(searchVal);
    }
    
    updateBadges();
    
    if (page !== 'baca') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    if (!searchInput) return;
    
    setTimeout(() => {
        if (currentPage === 'semua') {
            searchInput.focus();
        }
    }, 500);
    
    searchInput.addEventListener('input', function() {
        if (clearBtn) clearBtn.classList.toggle('visible', this.value.length > 0);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (typeof renderSuratList === 'function') renderSuratList(this.value);
        }, 150);
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            this.classList.remove('visible');
            if (typeof renderSuratList === 'function') renderSuratList('');
            searchInput.focus();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (((e.ctrlKey && e.key === 'f') || e.key === '/') && currentPage === 'semua') {
            if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        }
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            if (clearBtn) clearBtn.classList.remove('visible');
            if (typeof renderSuratList === 'function') renderSuratList('');
            searchInput.blur();
        }
    });
}

function setupBackButton() {
    const backBtn = document.getElementById('btn-back');
    if (!backBtn) return;
    
    backBtn.addEventListener('click', function() {
        navigateTo('dashboard');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const navDashboard = document.querySelector('.nav-item[data-page="dashboard"]');
        if (navDashboard) navDashboard.classList.add('active');
    });
}

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (!scrollBtn) return;
    
    let isVisible = false;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const threshold = 300;
        
        if (scrollY > threshold && !isVisible) {
            scrollBtn.classList.add('visible');
            isVisible = true;
        } else if (scrollY <= threshold && isVisible) {
            scrollBtn.classList.remove('visible');
            isVisible = false;
        }
    }, { passive: true });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function updateBadges() {
    let favorites = [];
    let completed = [];
    
    if (typeof getFavorites === 'function') favorites = getFavorites();
    if (typeof getCompleted === 'function') completed = getCompleted();
    
    const favBadge = document.getElementById('fav-badge');
    const doneBadge = document.getElementById('done-badge');
    const favCount = document.getElementById('fav-count');
    const doneCount = document.getElementById('done-count');
    
    if (favBadge) {
        if (favorites.length > 0) {
            favBadge.textContent = favorites.length;
            favBadge.style.display = 'flex';
        } else {
            favBadge.style.display = 'none';
        }
    }
    
    if (doneBadge) {
        if (completed.length > 0) {
            doneBadge.textContent = completed.length;
            doneBadge.style.display = 'flex';
        } else {
            doneBadge.style.display = 'none';
        }
    }
    
    if (favCount) favCount.textContent = favorites.length;
    if (doneCount) doneCount.textContent = completed.length;
}

function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function saveScrollPosition() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
        localStorage.setItem('qolbul_scroll_position', scrollY);
    }
}

window.navigateTo = navigateTo;
window.updateBadges = updateBadges;
window.showToast = showToast;
window.saveLastReadSurat = saveLastReadSurat;
window.loadLastReadSurat = loadLastReadSurat;
window.saveScrollPosition = saveScrollPosition;
window.updateDashboard = updateDashboard;

console.log('Qolbul Qur\'an v2.0 loaded');
if (READINGS_DATA) {
    console.log(READINGS_DATA.length + ' surat tersedia');
}