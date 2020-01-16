<header class="main-header">
  <nav class="main-header__nav">
    <ul class="main-header__item-list">
      <li class="main-header__item">
        <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/checkout' ? 'active' : '' %>" href="/checkout">Checkout</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Admin products</a>
      </li>
    </ul>
  </nav>

