document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollTop();
  initLightbox();
  initForms();
  initReviews();
  initFAQ();
  initCatalog();
  initMap();
});

function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
  }
  
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });
}

function updateThemeButton(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? 'Светлая' : 'Темная';
  }
}

function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');
  
  hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
  });
  
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
    });
  });
}

function initScrollTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.innerHTML = '↑';
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

let currentImageIndex = 0;
const galleryImages = [
  'img/Асадо.jpg',
  'img/Эмпанадас.jpg',
  'img/Миланеса.jpg',
  'img/Чорипан.jpg',
  'img/Проволета.jpg',
  'img/Медиалунас.jpg',
  'img/Дульсе-де-лече.jpg',
  'img/Альфахор.jpg',
  'img/Локро.jpg',
  'img/чипа из маниоки.jpg',
  'img/Мохас.jpg',
  'img/Эскабече.jpg'
];

function initLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <span class="lightbox-nav lightbox-prev">&#10094;</span>
      <div class="lightbox-image"></div>
      <span class="lightbox-nav lightbox-next">&#10095;</span>
    </div>
  `;
  document.body.appendChild(lightbox);
  
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      currentImageIndex = index;
      lightboxImage.style.backgroundImage = `url('${galleryImages[index]}')`;
      lightbox.classList.add('active');
    });
  });
  
  closeBtn?.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
  
  prevBtn?.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.style.backgroundImage = `url('${galleryImages[currentImageIndex]}')`;
  });
  
  nextBtn?.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.style.backgroundImage = `url('${galleryImages[currentImageIndex]}')`;
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

function initForms() {
  const contactForm = document.getElementById('contactForm');
  const orderForm = document.getElementById('orderForm');
  
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(contactForm)) {
      showModal('Спасибо!', 'Ваше сообщение отправлено!');
      contactForm.reset();
    }
  });
  
  orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(orderForm)) {
      showModal('Заказ принят!', 'Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.');
      orderForm.reset();
    }
  });
}

function validateForm(form) {
  let isValid = true;
  form.querySelectorAll('.form-group').forEach(group => {
    const input = group.querySelector('input, textarea, select');
    const error = group.querySelector('.error');
    
    if (input?.hasAttribute('required') && !input.value.trim()) {
      error?.classList.add('show');
      isValid = false;
    } else if (input?.type === 'email' && input.value && !isValidEmail(input.value)) {
      error?.classList.add('show');
      error.textContent = 'Введите корректный email';
      isValid = false;
    } else {
      error?.classList.remove('show');
    }
  });
  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showModal(title, message) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="this.closest('.modal').remove()">ОК</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.classList.add('active');
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function initReviews() {
  const reviewsList = document.getElementById('reviewsList');
  const reviewForm = document.getElementById('reviewForm');
  
  let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  renderReviews(reviews);
  
  reviewForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reviewName')?.value;
    const text = document.getElementById('reviewText')?.value;
    
    if (name && text) {
      const newReview = { name, text, date: new Date().toLocaleDateString('ru-RU') };
      reviews.unshift(newReview);
      localStorage.setItem('reviews', JSON.stringify(reviews));
      renderReviews(reviews);
      reviewForm.reset();
      showModal('Спасибо!', 'Ваш отзыв добавлен!');
    }
  });
}

function renderReviews(reviews) {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList) return;
  
  if (reviews.length === 0) {
    reviews = [
      { name: 'Анна Иванова', text: 'Отличная продукция! Очень вкусный хлеб.', date: '01.06.2026' },
      { name: 'Петр Петров', text: 'Высокое качество и быстрая доставка.', date: '15.05.2026' }
    ];
  }
  
  reviewsList.innerHTML = reviews.map(review => `
    <div class="review">
      <div class="review-author">${review.name} • ${review.date}</div>
      <p>${review.text}</p>
    </div>
  `).join('');
}

function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

const products = [
  { id: 1, name: 'Асадо (Asado)', category: 'main', price: 5500, icon: 'img/Асадо.jpg', desc: 'Главное национальное блюдо Аргентины! Сочные куски говядины, ребрышки, стейки и колбаски чоризо, медленно приготовленные на открытом огне или углях. Подается с фирменным соусом чимичурри, который добавляет неповторимый вкус и аромат!' },
  { id: 2, name: 'Эмпанадас (Empanadas)', category: 'appetizers', price: 1200, icon: 'img/Эмпанадас.jpg', desc: 'Небольшие жареные или печеные пирожки из нежного теста с разнообразными начинками! Самые популярные — с рубленой говядиной, ветчиной с сыром или курицей! Вкус, который запомнится надолго!' },
  { id: 3, name: 'Миланеса (Milanesa)', category: 'main', price: 3800, icon: 'img/Миланеса.jpg', desc: 'Тонкий стейк в хрустящей панировке из сухарных крошек — как шницель, но по-аргентински! Часто запекают с соусом, ветчиной и сыром (вариант наполетан) и подают с горой картофеля фри! Очень сытно и невероятно вкусно!' },
  { id: 4, name: 'Чорипан (Choripán)', category: 'appetizers', price: 1500, icon: 'img/Чорипан.jpg', desc: 'Уличная классика Аргентины! Хрустящая булочка-багет, в которую вкладывают жареную свиную колбаску чоризо и обильно поливают соусом! Быстро, сытно и очень вкусно!' },
  { id: 5, name: 'Проволета (Provoleta)', category: 'appetizers', price: 2200, icon: 'img/Проволета.jpg', desc: 'Жареный сыр проволоне, приготовленный на гриле до образования аппетитной, румяной корочки! Посыпают орегано и едят с хлебом! Прекрасная закуска к вину!' },
  { id: 6, name: 'Медиалунас (Medialunas)', category: 'desserts', price: 900, icon: 'img/Медиалунас.jpg', desc: 'Аргентинские мини-круассаны! Обычно они более сладкие, плотные и часто подаются со сливочным сыром или dulce de leche! Идеальное дополнение к утреннему кофе!' },
  { id: 7, name: 'Дульсе-де-лече (Dulce de leche)', category: 'desserts', price: 1300, icon: 'img/Дульсе-де-лече.jpg', desc: 'Национальная гордость Аргентины, местный аналог вареной сгущенки! Подается как самостоятельный десерт, крем для тортов и основа для мороженого! Нежный, сладкий и очень вкусный!' },
  { id: 8, name: 'Альфахор (Alfajor)', category: 'desserts', price: 1600, icon: 'img/Альфахор.jpg', desc: 'Популярнейшее аргентинское печенье, состоящее из двух слоев рассыпчатого теста с прослойкой из dulce de leche, часто покрытое шоколадом или глазурью! Сладко, нежно и очень ароматно!' },
  { id: 9, name: 'Локро (Locro)', category: 'main', price: 4200, icon: 'img/Локро.jpg', desc: 'Традиционный аргентинский суп из кукурузы, фасоли, мяса и овощей! Густой, сытный и очень ароматный, особенно популярен в холодное время года!' },
  { id: 10, name: 'Чипсы из маниоки (Chipa)', category: 'appetizers', price: 1000, icon: 'img/чипа из маниоки.jpg', desc: 'Хрустящие, сдобные булочки из маниоки с сыром! Снаружи хрустящие, внутри мягкие! Замечательная закуска или дополнение к основным блюдам!' },
  { id: 11, name: 'Мохас (Mollejas)', category: 'appetizers', price: 2800, icon: 'img/Мохас.jpg', desc: 'Нежные телячьи потрошки, приготовленные на гриле до золотистой корочки! Изысканная аргентинская закуска, которая понравится любителям необычных вкусов!' },
  { id: 12, name: 'Эскабече (Escabeche)', category: 'appetizers', price: 1900, icon: 'img/Эскабече.jpg', desc: 'Маринованные овощи или рыба в кисло-сладком соусе с уксусом и специями! Классическая аргентинская закуска, освежающая и ароматная!' }
];

function initCatalog() {
  renderProducts(products);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-category');
      const filtered = category === 'all' ? products : products.filter(p => p.category === category);
      renderProducts(filtered);
    });
  });
}

function renderProducts(productList) {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  
  container.innerHTML = productList.map(product => `
    <div class="product-card">
      <div class="product-image" style="background-image: url('${product.icon}');"></div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="product-price">${product.price} ARS</div>
        <button class="btn btn-primary" onclick="orderProduct('${product.name}')">Заказать</button>
      </div>
    </div>
  `).join('');
}

function orderProduct(productName) {
  const orderForm = document.getElementById('orderForm');
  const productSelect = document.getElementById('productSelect');
  
  if (orderForm && productSelect) {
    productSelect.value = productName;
    orderForm.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = 'contacts.html?product=' + encodeURIComponent(productName);
  }
}

function initMap() {
  const regionInfo = document.getElementById('regionInfoSimple');
  
  document.querySelectorAll('.map-region').forEach(region => {
    region.addEventListener('click', () => {
      document.querySelectorAll('.map-region').forEach(r => r.classList.remove('active'));
      region.classList.add('active');
      
      const info = JSON.parse(region.getAttribute('data-info') || '{}');
      regionInfo.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 15px;">${info.name}</h3>
        <p style="margin-bottom: 10px;">${info.desc}</p>
        <div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-top: 15px;">
          <div style="padding:10px; background:rgba(0,0,0,0.05); border-radius:5px;">
            <strong>Температура:</strong><br>${info.temp}
          </div>
          <div style="padding:10px; background:rgba(0,0,0,0.05); border-radius:5px;">
            <strong>Погода:</strong><br>${info.weather}
          </div>
        </div>
      `;
    });
  });
  
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  if (product) {
    const productSelect = document.getElementById('productSelect');
    if (productSelect) {
      productSelect.value = product;
    }
  }
}
