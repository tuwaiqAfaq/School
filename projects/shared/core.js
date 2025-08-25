// ملف الوظائف المشتركة لنظام الإدخالات النصية
// يعتمد على متغير companyName الذي يجب تعريفه في ملف data.js

class TextEntrySystem {
    constructor(companyName) {
        this.companyName = companyName;
        this.storageKey = `textEntries_${companyName}`;
    }

    // إضافة إدخال جديد
    addEntry(text) {
        if (!text || text.trim() === '') {
            return false;
        }

        const entries = this.getAllEntries();
        const newEntry = {
            id: Date.now(),
            text: text.trim(),
            timestamp: new Date().toLocaleString('ar-SA')
        };

        entries.unshift(newEntry); // إضافة في المقدمة
        this.saveEntries(entries);
        return true;
    }

    // الحصول على جميع الإدخالات
    getAllEntries() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('خطأ في قراءة البيانات:', error);
            return [];
        }
    }

    // الحصول على آخر 12 إدخال
    getRecentEntries() {
        const allEntries = this.getAllEntries();
        return allEntries.slice(0, 12);
    }

    // حذف إدخال محدد
    deleteEntry(id) {
        const entries = this.getAllEntries();
        const filteredEntries = entries.filter(entry => entry.id !== parseInt(id));
        this.saveEntries(filteredEntries);
        return true;
    }

    // مسح جميع الإدخالات
    clearAllEntries() {
        localStorage.removeItem(this.storageKey);
        return true;
    }

    // حفظ الإدخالات في LocalStorage
    saveEntries(entries) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(entries));
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
        }
    }

    // عرض الإدخالات في صفحة العرض
    displayRecentEntries(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = this.getRecentEntries();
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">لا توجد إدخالات حتى الآن</p>';
            return;
        }

        let html = '<div class="entries-grid">';
        entries.forEach((entry, index) => {
            html += `
                <div class="entry-card">
                    <div class="entry-number">${index + 1}</div>
                    <div class="entry-text">${this.escapeHtml(entry.text)}</div>
                    <div class="entry-time">${entry.timestamp}</div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    // عرض جميع الإدخالات في لوحة التحكم
    displayAllEntries(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = this.getAllEntries();
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">لا توجد إدخالات حتى الآن</p>';
            return;
        }

        let html = '<div class="control-entries">';
        entries.forEach((entry) => {
            html += `
                <div class="control-entry" data-id="${entry.id}">
                    <div class="entry-content">
                        <div class="entry-text">${this.escapeHtml(entry.text)}</div>
                        <div class="entry-time">${entry.timestamp}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteEntry(${entry.id})">حذف</button>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    // تنظيف النص من HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// متغير عام للنظام
let textSystem;

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (typeof companyName !== 'undefined') {
        textSystem = new TextEntrySystem(companyName);
    }
});

// دوال عامة للاستخدام في الصفحات
function addNewEntry() {
    const textInput = document.getElementById('entryText');
    if (!textInput) return;

    const text = textInput.value;
    if (textSystem.addEntry(text)) {
        textInput.value = '';
        alert('تم إضافة الإدخال بنجاح!');
    } else {
        alert('يرجى إدخال نص صالح');
    }
}

function deleteEntry(id) {
    if (confirm('هل أنت متأكد من حذف هذا الإدخال؟')) {
        textSystem.deleteEntry(id);
        location.reload();
    }
}

function clearAllEntries() {
    if (confirm('هل أنت متأكد من مسح جميع الإدخالات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        textSystem.clearAllEntries();
        location.reload();
    }
}

function loadRecentEntries() {
    if (textSystem) {
        textSystem.displayRecentEntries('entriesContainer');
    }
}

function loadAllEntries() {
    if (textSystem) {
        textSystem.displayAllEntries('entriesContainer');
    }
}

