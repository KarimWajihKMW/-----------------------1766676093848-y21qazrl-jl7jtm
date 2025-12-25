/**
 * Modern E-commerce Logic
 */

const products = [
    {
        id: 1,
        name: "سماعة رأس لاسلكية برو",
        price: 299,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        description: "تجربة صوتية لا مثيل لها مع عزل ضوضاء فائق وبطارية تدوم طويلاً."
    },
    {
        id: 2,
        name: "ساعة ذكية رياضية",
        price: 199,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        description: "تتبع لياقتك البدنية وصحتك بدقة مع تصميم عصري وأنيق."
    },
    {
        id: 3,
        name: "حذاء رياضي مريح",
        price: 149,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        description: "تصميم مريح للمشي والركض لمسافات طويلة، متوفر بألوان متعددة."
    },
    {
        id: 4,
        name: "حقيبة ظهر عصرية",
        price: 89,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
        description: "حقيبة متينة ومقاومة للماء، مثالية للسفر والعمل اليومي."
    },
    {
        id: 5,
        name: "نظارة شمسية كلاسيك",
        price: 120,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
        description: "حماية كاملة من الأشعة فوق البنفسجية بتصميم لا يبطل موضته."
    },
    {
        id: 6,
        name: "كاميرا فورية",
        price: 450,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
        description: "التقط اللحظات الجميلة واطبعها فوراً بجودة عالية."
    }
];

class App {
    constructor() {
        this.cart = [];
        this.currentView = 'home';
        this.container = document.getElementById('app-content');
        this.activeCategory = 'all';
        this.sortOrder = 'default';
        
        this.init();
    }

    init() {
        this.router('home');
        this.renderCart();
    }

    // --- Router ---
    router(view, params = null) {
        this.currentView = view;
        window.scrollTo(0, 0);
        
        if (view === 'home') {
            this.renderHome();
        } else if (view === 'product') {
            this.renderProductDetails(params);
        } else if (view === 'checkout') {
            this.closeCart();
            this.renderCheckout();
        }
    }

    // --- Views ---
    renderHome() {
        const filteredProducts = this.getFilteredAndSortedProducts();

        let productsHtml = filteredProducts.map(p => `
            <div class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer" onclick="app.router('product', ${p.id})">
                <div class="relative h-64 overflow-hidden">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                    <button onclick="event.stopPropagation(); app.addToCart(${p.id})" class="absolute bottom-4 left-4 bg-white text-gray-900 p-2 rounded-full shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </button>
                </div>
                <div class="p-5">
                    <div class="text-xs text-primary font-bold mb-1 uppercase tracking-wider">${this.translateCategory(p.category)}</div>
                    <h3 class="font-bold text-gray-900 text-lg mb-2">${p.name}</h3>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-bold text-gray-800">${p.price} ر.س</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
                <!-- Hero / Filters -->
                <div class="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        <button onclick="app.setCategory('all')" class="px-4 py-2 rounded-full text-sm font-semibold transition ${this.activeCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">الكل</button>
                        <button onclick="app.setCategory('electronics')" class="px-4 py-2 rounded-full text-sm font-semibold transition ${this.activeCategory === 'electronics' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">إلكترونيات</button>
                        <button onclick="app.setCategory('clothing')" class="px-4 py-2 rounded-full text-sm font-semibold transition ${this.activeCategory === 'clothing' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">ملابس</button>
                        <button onclick="app.setCategory('accessories')" class="px-4 py-2 rounded-full text-sm font-semibold transition ${this.activeCategory === 'accessories' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">اكسسوارات</button>
                    </div>
                    <div class="mt-4 md:mt-0 w-full md:w-auto">
                        <select onchange="app.setSort(this.value)" class="w-full md:w-48 bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="default" ${this.sortOrder === 'default' ? 'selected' : ''}>ترتيب افتراضي</option>
                            <option value="low" ${this.sortOrder === 'low' ? 'selected' : ''}>السعر: من الأقل للأعلى</option>
                            <option value="high" ${this.sortOrder === 'high' ? 'selected' : ''}>السعر: من الأعلى للأقل</option>
                        </select>
                    </div>
                </div>

                <!-- Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${productsHtml}
                </div>
            </div>
        `;
    }

    renderProductDetails(id) {
        const product = products.find(p => p.id === id);
        if (!product) return this.router('home');

        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
                <button onclick="app.router('home')" class="mb-6 flex items-center text-gray-500 hover:text-primary transition">
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    العودة للمتجر
                </button>
                
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2">
                        <div class="h-96 md:h-[500px] bg-gray-100">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                        </div>
                        <div class="p-8 md:p-12 flex flex-col justify-center">
                            <span class="text-primary font-bold tracking-wider uppercase mb-2">${this.translateCategory(product.category)}</span>
                            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${product.name}</h1>
                            <p class="text-gray-600 text-lg mb-8 leading-relaxed">${product.description}</p>
                            
                            <div class="flex items-center justify-between mb-8 border-t border-b border-gray-100 py-6">
                                <span class="text-3xl font-bold text-gray-900">${product.price} ر.س</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-yellow-400">
                                        ★★★★★
                                    </span>
                                    <span class="text-gray-400 text-sm">(4.9 تقييم)</span>
                                </div>
                            </div>

                            <div class="flex gap-4">
                                <button onclick="app.addToCart(${product.id})" class="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform active:scale-95">
                                    إضافة للسلة
                                </button>
                                <button class="p-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 transition">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCheckout() {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">إتمام الطلب</h1>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Checkout Form -->
                    <div class="md:col-span-2 space-y-6">
                        <!-- Step 1 -->
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <span class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center ml-3 text-sm">1</span>
                                معلومات التوصيل
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="الاسم الأول" class="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                <input type="text" placeholder="اسم العائلة" class="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                <input type="text" placeholder="رقم الهاتف" class="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none md:col-span-2">
                                <input type="text" placeholder="العنوان" class="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none md:col-span-2">
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <span class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center ml-3 text-sm">2</span>
                                الدفع
                            </h2>
                            <div class="space-y-3">
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer bg-indigo-50 border-primary">
                                    <input type="radio" name="payment" checked class="text-primary focus:ring-primary">
                                    <span class="mr-3 font-semibold">الدفع عند الاستلام</span>
                                </label>
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="payment" class="text-primary focus:ring-primary">
                                    <span class="mr-3 font-semibold">بطاقة ائتمان (قريباً)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="md:col-span-1">
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 class="text-lg font-bold mb-4">ملخص الطلب</h2>
                            <div class="space-y-3 mb-6 max-h-60 overflow-y-auto no-scrollbar">
                                ${this.cart.map(item => `
                                    <div class="flex justify-between items-center text-sm">
                                        <div class="flex items-center">
                                            <span class="text-gray-500 ml-2">x${item.qty}</span>
                                            <span class="text-gray-800 truncate w-32">${item.name}</span>
                                        </div>
                                        <span class="font-semibold">${item.price * item.qty} ر.س</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="border-t pt-4 space-y-2">
                                <div class="flex justify-between text-gray-600">
                                    <span>المجموع الفرعي</span>
                                    <span>${this.calculateTotal()} ر.س</span>
                                </div>
                                <div class="flex justify-between text-gray-600">
                                    <span>الشحن</span>
                                    <span class="text-green-600">مجاني</span>
                                </div>
                                <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t mt-2">
                                    <span>الإجمالي</span>
                                    <span>${this.calculateTotal()} ر.س</span>
                                </div>
                            </div>
                            <button onclick="app.completeOrder()" class="w-full mt-6 bg-secondary text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition shadow-lg">
                                تأكيد الطلب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Logic Helpers ---
    getFilteredAndSortedProducts() {
        let result = [...products];
        
        if (this.activeCategory !== 'all') {
            result = result.filter(p => p.category === this.activeCategory);
        }

        if (this.sortOrder === 'low') {
            result.sort((a, b) => a.price - b.price);
        } else if (this.sortOrder === 'high') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }

    setCategory(cat) {
        this.activeCategory = cat;
        this.renderHome();
    }

    setSort(order) {
        this.sortOrder = order;
        this.renderHome();
    }

    translateCategory(cat) {
        const map = {
            'electronics': 'إلكترونيات',
            'clothing': 'ملابس',
            'accessories': 'اكسسوارات',
            'all': 'الكل'
        };
        return map[cat] || cat;
    }

    // --- Cart Logic ---
    addToCart(id) {
        const product = products.find(p => p.id === id);
        const existing = this.cart.find(item => item.id === id);

        if (existing) {
            existing.qty++;
        } else {
            this.cart.push({ ...product, qty: 1 });
        }

        this.renderCart();
        this.showToast();
        // if user is on checkout, re-render to update summary
        if(this.currentView === 'checkout') this.renderCheckout(); 
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.renderCart();
        if(this.currentView === 'checkout') this.renderCheckout();
    }

    updateQty(id, change) {
        const item = this.cart.find(p => p.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) this.removeFromCart(id);
            else this.renderCart();
        }
        if(this.currentView === 'checkout') this.renderCheckout();
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    }

    renderCart() {
        const cartItemsEl = document.getElementById('cart-items');
        const cartCountEl = document.getElementById('cart-count');
        const cartTotalEl = document.getElementById('cart-total');

        // Update badge
        const totalQty = this.cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountEl.textContent = totalQty;
        cartCountEl.style.opacity = totalQty > 0 ? '1' : '0';

        // Update Total
        cartTotalEl.textContent = this.calculateTotal() + ' ر.س';

        // Render Items
        if (this.cart.length === 0) {
            cartItemsEl.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p>سلتك فارغة</p></div>';
            return;
        }

        cartItemsEl.innerHTML = this.cart.map(item => `
            <div class="flex gap-4">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg border border-gray-100">
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-gray-900 line-clamp-1">${item.name}</h4>
                    <div class="text-primary font-bold text-sm mt-1">${item.price} ر.س</div>
                    <div class="flex items-center mt-2">
                        <button onclick="app.updateQty(${item.id}, -1)" class="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">-</button>
                        <span class="mx-3 text-sm font-semibold">${item.qty}</span>
                        <button onclick="app.updateQty(${item.id}, 1)" class="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">+</button>
                    </div>
                </div>
                <button onclick="app.removeFromCart(${item.id})" class="text-gray-300 hover:text-red-500 self-start">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        `).join('');
    }

    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-sidebar-overlay');
        
        sidebar.classList.toggle('open'); // Requires CSS helper or just use generic translation logic
        // Let's use direct style manipulation or class toggling for Tailwind translation
        // The class in HTML is -translate-x-full. We need to remove it to show.
        
        if (sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10); // Fade in
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        if (!sidebar.classList.contains('-translate-x-full')) {
            this.toggleCart();
        }
    }

    showToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }

    completeOrder() {
        if(this.cart.length === 0) {
            alert('السلة فارغة!');
            return;
        }
        
        // Mock Loading
        const btn = document.querySelector('button[onclick="app.completeOrder()"]');
        const originalText = btn.innerText;
        btn.innerText = 'جاري المعالجة...';
        btn.disabled = true;
        btn.classList.add('opacity-75');

        setTimeout(() => {
            this.container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-[60vh] text-center px-4 fade-in">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">شكراً لطلبك!</h2>
                    <p class="text-gray-600 mb-8">رقم الطلب #83920. سنقوم بتوصيله إليك قريباً.</p>
                    <button onclick="location.reload()" class="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                        متابعة التسوق
                    </button>
                </div>
            `;
            this.cart = [];
            this.renderCart();
            window.scrollTo(0,0);
        }, 2000);
    }
}

const app = new App();
