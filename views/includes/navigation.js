<div class="backdrop"></div>
<header class="main-header">
    <button id="side-menu-toggle">Menu</button>
  <nav class="main-header__nav">
    <ul class="main-header__item-list">
      <li class="main-header__item" href="/">
        <a href="/">Shop</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/products' ? 'active' : '' %>  <%= admin && !all ? 'disable' : '' %>" href="/products">Products</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/cart' ? 'active' : '' %>  <%= admin && !all ? 'disable' : '' %>" href="/cart">Cart</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/orders' ? 'active' : '' %> <%= admin && !all ? 'disable' : '' %>" href="/orders">Orders</a>
      </li>
      {/* <li class="main-header__item">
        <a class="<%= path === '/admin/add-product' ? 'active' : '' %>  <%= !admin ? 'disable' : '' %>" href="/admin/add-product">Add</a>
      </li>
      <li class="main-header__item">
        <a class="<%= path === '/admin/products' ? 'active' : '' %>  <%= !admin ? 'disable' : '' %>" href="/admin/products">Admin products</a>
      </li> */}
    </ul>
    <ul class="main-header__item-list">
      <li class="main-header__item">
        <a href="/login">Login</a>
      </li>
    </ul>
  </nav>
</header>
  
<nav class="mobile-nav">
        <ul class="mobile-nav__item-list">
                <li class="mobile-nav__item">
                    <a href="/">Shop</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/products' ? 'active' : '' %>  <%= admin && !all ? 'disable' : '' %>" href="/products">Products</a>
                </li>
                <li class="mobile-nav__item">
                     <a class="<%= path === '/cart' ? 'active' : '' %>  <%= admin && !all ? 'disable' : '' %>" href="/cart">Cart</a>
                </li>
                <li class="mobile-nav__item">
                   <a class="<%= path === '/checkout' ? 'active' : '' %> <%= admin && !all ? 'disable' : '' %>" href="/checkout">Checkout</a>
                </li>
                <li class="mobile-nav__item">
                   <a class="<%= path === '/admin/add-product' ? 'active' : '' %>  <%= !admin ? 'disable' : '' %>" href="/admin/add-product">Add</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/admin/products' ? 'active' : '' %>  <%= !admin ? 'disable' : '' %>" href="/admin/products">Admin products</a>
                </li>
            </ul>
</nav>