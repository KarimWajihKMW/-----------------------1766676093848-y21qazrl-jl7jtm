document.addEventListener('DOMContentLoaded', () => {
    // --- Data Configuration ---
    const categories = [
        { name: 'الكل', icon: '🔍', active: true },
        { name: 'سيارات', icon: '🚗', active: false },
        { name: 'عقارات', icon: '🏠', active: false },
        { name: 'إلكترونيات', icon: '📱', active: false },
        { name: 'أثاث', icon: '🛋️', active: false },
        { name: 'خدمات', icon: '🔧', active: false },
        { name: 'وظائف', icon: '💼', active: false }
    ];

    const defaultAds = [
        {
            id: 1,
            title: 'آيفون 13 برو ماكس بحالة ممتازة',
            price: 3500,
            currency: 'ر.س',
            location: 'الرياض',
            time: 'منذ ساعتين',
            image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400',
            category: 'إلكترونيات'
        },
        {
            id: 2,
            title: 'شقة للإيجار حي الياسمين',
            price: 45000,
            currency: 'ر.س',
            location: 'جدة',
            time: 'منذ 5 ساعات',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
            category: 'عقارات'
        },
        {
            id: 3,
            title: 'كنب زاوية مودرن جديد',
            price: 1200,
            currency: 'ر.س',
            location: 'الدمام',
            time: 'منذ يوم',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
            category: 'أثاث'
        },
        {
            id: 4,
            title: 'تويوتا كامري 2021 فل كامل',
            price: 85000,
            currency: 'ر.س',
            location: 'الرياض',
            time: 'منذ يومين',
            image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=400',
            category: 'سيارات'
        }
    ];

    // Load ads from localStorage or use defaults
    let ads = JSON.parse(localStorage.getItem('ads')) || defaultAds;
    // Ensure we save defaults if nothing was there
    if (!localStorage.getItem('ads')) {
        localStorage.setItem('ads', JSON.stringify(ads));
    }

    // --- Elements ---
    const adsGrid = document.getElementById('adsGrid');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const modal = document.getElementById('adModal');
    const openModalBtn = document.getElementById('openAdModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const adForm = document.getElementById('adForm');
    const searchInput = document.getElementById('searchInput');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const removeImageBtn = document.getElementById('removeImage');
    const toast = document.getElementById('toast');

    let currentUploadedImage = null;

    // --- Functions ---

    // Render Categories
    function renderCategories() {
        categoriesContainer.innerHTML = categories.map(cat => `
            <button class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition duration-200 ${cat.active ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}" onclick="filterByCategory('${cat.name}')">
                <span>${cat.icon}</span>
                <span class="font-medium">${cat.name}</span>
            </button>
        `).join('');
    }

    // Render Ads
    function renderAds(adsToRender) {
        if (adsToRender.length === 0) {
            adsGrid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500">
                <p class="text-4xl mb-2">😔</p>
                <p>لا توجد إعلانات مطابقة لبحثك</p>
            </div>`;
            return;
        }

        adsGrid.innerHTML = adsToRender.map(ad => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 group cursor-pointer">
                <div class="relative h-48 overflow-hidden bg-gray-100">
                    <img src="${ad.image}" alt="${ad.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">${ad.time}</span>
                    <span class="absolute top-2 left-2 bg-white bg-opacity-90 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">${ad.category}</span>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold text-gray-900 line-clamp-1">${ad.title}</h3>
                    </div>
                    <p class="text-indigo-600 font-bold text-xl mb-3">${ad.price.toLocaleString()} <span class="text-sm font-normal">${ad.currency}</span></p>
                    <div class="flex items-center text-gray-500 text-sm gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>${ad.location}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function showToast() {
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }

    function resetForm() {
        adForm.reset();
        currentUploadedImage = null;
        imagePreview.classList.add('hidden');
        uploadPrompt.classList.remove('hidden');
        imagePreview.querySelector('img').src = '';
    }

    // --- Event Handlers ---

    // Image Upload Preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentUploadedImage = e.target.result;
                imagePreview.querySelector('img').src = currentUploadedImage;
                imagePreview.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        imageInput.value = '';
        currentUploadedImage = null;
        imagePreview.classList.add('hidden');
        uploadPrompt.classList.remove('hidden');
    });

    // Filter Logic
    window.filterByCategory = (categoryName) => {
        categories.forEach(c => c.active = c.name === categoryName);
        renderCategories();

        if (categoryName === 'الكل') {
            renderAds(ads);
        } else {
            const filtered = ads.filter(ad => ad.category === categoryName);
            renderAds(filtered);
        }
    };

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = ads.filter(ad => 
            ad.title.toLowerCase().includes(term) || 
            ad.location.toLowerCase().includes(term)
        );
        renderAds(filtered);
    });

    // Modal Logic
    openModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Form Submission
    adForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(adForm);
        
        // Default image fallback based on category
        let finalImage = currentUploadedImage;
        if (!finalImage) {
            const cat = formData.get('category');
            if (cat === 'سيارات') finalImage = 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=400';
            else if (cat === 'عقارات') finalImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400';
            else if (cat === 'إلكترونيات') finalImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
            else finalImage = 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=400';
        }

        const newAd = {
            id: Date.now(),
            title: formData.get('title'),
            price: Number(formData.get('price')),
            currency: 'ر.س',
            location: formData.get('location') || 'غير محدد',
            time: 'الآن',
            image: finalImage,
            category: formData.get('category')
        };

        // Add to list and save to localStorage
        ads.unshift(newAd);
        localStorage.setItem('ads', JSON.stringify(ads));
        
        // Refresh view
        renderAds(ads);
        
        // Cleanup
        resetForm();
        modal.classList.add('hidden');
        showToast();
        
        // Switch to 'All' to see result
        window.filterByCategory('الكل');
    });

    // --- Initialization ---
    renderCategories();
    renderAds(ads);
});