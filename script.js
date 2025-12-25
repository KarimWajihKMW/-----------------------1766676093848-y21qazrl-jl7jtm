document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    const categories = [
        { name: 'الكل', icon: '🔍', active: true },
        { name: 'سيارات', icon: '🚗', active: false },
        { name: 'عقارات', icon: '🏠', active: false },
        { name: 'إلكترونيات', icon: '📱', active: false },
        { name: 'أثاث', icon: '🛋️', active: false },
        { name: 'خدمات', icon: '🔧', active: false },
        { name: 'وظائف', icon: '💼', active: false }
    ];

    let ads = [
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

    // --- Elements ---
    const adsGrid = document.getElementById('adsGrid');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const modal = document.getElementById('adModal');
    const openModalBtn = document.getElementById('openAdModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const adForm = document.getElementById('adForm');
    const searchInput = document.getElementById('searchInput');

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
            adsGrid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500">لا توجد إعلانات مطابقة لبحثك 😔</div>`;
            return;
        }

        adsGrid.innerHTML = adsToRender.map(ad => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 group cursor-pointer">
                <div class="relative h-48 overflow-hidden bg-gray-200">
                    <img src="${ad.image}" alt="${ad.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">${ad.time}</span>
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

    // --- Event Handlers ---

    // Filter Logic
    window.filterByCategory = (categoryName) => {
        // Update active state
        categories.forEach(c => c.active = c.name === categoryName);
        renderCategories();

        // Filter ads
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

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Form Submission
    adForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(adForm);
        const newAd = {
            id: Date.now(),
            title: formData.get('title'),
            price: Number(formData.get('price')),
            currency: 'ر.س',
            location: formData.get('location') || 'غير محدد',
            time: 'الآن',
            // Random placeholder image based on category
            image: `https://source.unsplash.com/random/400x300/?${formData.get('category') === 'سيارات' ? 'car' : 'product'}`,
            category: formData.get('category')
        };

        // Fallback for image if unsplash source is tricky (using simple logic)
        if (newAd.category === 'سيارات') newAd.image = 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=400';
        else if (newAd.category === 'عقارات') newAd.image = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400';
        else newAd.image = 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=400';

        ads.unshift(newAd);
        renderAds(ads);
        
        adForm.reset();
        modal.classList.add('hidden');
        
        // Switch to 'All' or the specific category to see the new ad
        window.filterByCategory('الكل');
    });

    // --- Initialization ---
    renderCategories();
    renderAds(ads);
});