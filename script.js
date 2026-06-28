function openProductModal(card, event) {
      // Daca click-ul a fost pe un buton/link intern (WA, add to cart, etc.), nu deschide modal
      if (event && event.target && event.target.closest('a, button')) {
        return;
      }
      const modal = document.getElementById('productModal');
      const name = card.querySelector('.produs-name')?.textContent || 'Rochie';
      const price = card.querySelector('.produs-pret')?.textContent || '';
      const priceOld = card.querySelector('.produs-pret-old')?.textContent || '';
      const stock = card.querySelector('.produs-stock')?.textContent || '';
      const imgEl = card.querySelector('.produs-foto');
      const bg = imgEl ? window.getComputedStyle(imgEl).backgroundImage : '';

      document.getElementById('modalName').textContent = name;
      document.getElementById('modalPrice').textContent = price;
      document.getElementById('modalPriceOld').textContent = priceOld;
      document.getElementById('modalStock').textContent = stock;
      document.getElementById('modalImage').style.backgroundImage = bg;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeProductModal() {
      document.getElementById('productModal').classList.remove('open');
      document.body.style.overflow = '';
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeProductModal();
    });
    document.getElementById('productModal').addEventListener('click', function(e) {
      if (e.target === this) closeProductModal();
    });