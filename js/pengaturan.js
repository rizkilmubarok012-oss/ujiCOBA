/**
 * Qolbul Qur'an - Pengaturan
 * Dark Mode, Lite Mode, Font Size dengan Slider
 */

const SETTINGS_KEY = 'qolbul_settings_v3';

const DEFAULT_SETTINGS = {
    fontSize: 26,
    showLatin: true,
    showTranslation: true,
    darkMode: false,
    liteMode: false
};

let settingsCache = null;

function getSettings() {
    if (settingsCache !== null) return settingsCache;
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        settingsCache = data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
        return settingsCache;
    } catch {
        settingsCache = { ...DEFAULT_SETTINGS };
        return settingsCache;
    }
}

function saveSettings(settings) {
    settingsCache = settings;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettings(settings) {
    const { fontSize, showLatin, showTranslation, darkMode, liteMode } = settings;
    
    document.documentElement.style.setProperty('--arabic-font-size', fontSize + 'px');
    
    const slider = document.getElementById('font-size-slider');
    const label = document.getElementById('font-size-label');
    if (slider) {
        slider.value = fontSize;
    }
    if (label) {
        label.textContent = fontSize + 'px';
    }
    
    document.body.classList.toggle('hide-latin', !showLatin);
    const latinToggle = document.getElementById('toggle-latin');
    if (latinToggle) latinToggle.checked = showLatin;
    
    document.body.classList.toggle('hide-translation', !showTranslation);
    const transToggle = document.getElementById('toggle-translation');
    if (transToggle) transToggle.checked = showTranslation;
    
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    const darkToggle = document.getElementById('toggle-dark');
    if (darkToggle) darkToggle.checked = darkMode;
    
    document.body.classList.toggle('lite-mode', liteMode);
    const liteToggle = document.getElementById('toggle-lite');
    if (liteToggle) liteToggle.checked = liteMode;
}

function initSettings() {
    const settings = getSettings();
    applySettings(settings);
    
    const slider = document.getElementById('font-size-slider');
    const label = document.getElementById('font-size-label');
    
    if (slider) {
        slider.addEventListener('input', function() {
            const size = parseInt(this.value);
            if (label) label.textContent = size + 'px';
            
            const settings = getSettings();
            settings.fontSize = size;
            saveSettings(settings);
            applySettings(settings);
        });
    }
    
    const latinToggle = document.getElementById('toggle-latin');
    if (latinToggle) {
        latinToggle.addEventListener('change', function() {
            const settings = getSettings();
            settings.showLatin = this.checked;
            saveSettings(settings);
            applySettings(settings);
            showToast(this.checked ? 'Latin ditampilkan' : 'Latin disembunyikan');
        });
    }
    
    const transToggle = document.getElementById('toggle-translation');
    if (transToggle) {
        transToggle.addEventListener('change', function() {
            const settings = getSettings();
            settings.showTranslation = this.checked;
            saveSettings(settings);
            applySettings(settings);
            showToast(this.checked ? 'Terjemahan ditampilkan' : 'Terjemahan disembunyikan');
        });
    }
    
    const darkToggle = document.getElementById('toggle-dark');
    if (darkToggle) {
        darkToggle.addEventListener('change', function() {
            const settings = getSettings();
            settings.darkMode = this.checked;
            saveSettings(settings);
            applySettings(settings);
            showToast(this.checked ? 'Dark Mode aktif' : 'Light Mode aktif');
        });
    }
    
    const liteToggle = document.getElementById('toggle-lite');
    if (liteToggle) {
        liteToggle.addEventListener('change', function() {
            const settings = getSettings();
            settings.liteMode = this.checked;
            saveSettings(settings);
            applySettings(settings);
            showToast(this.checked ? 'Mode Hemat aktif' : 'Mode Hemat nonaktif');
        });
    }
}