<div class="backdrop"></div>
<header class="main-header">
    <button id="side-menu-toggle">Menu</button>
    <nav class="main-header__nav">
        <ul class="main-header__item-list">
            <li class="main-header__item">
                <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
            </li>
            <% if (isAuthenticated) { %>
                <li class="main-header__item">
                    <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
                </li>
                <li class="main-header__item">
                    <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
                </li>
                <li class="main-header__item">
                    <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
                    </a>
                </li>
                <li class="main-header__item">
                    <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                    </a>
                </li>
            <% } %>
        </ul>
        <ul class="main-header__item-list">
            <% if (!isAuthenticated) { %>
                <li class="main-header__item">
                    <a class="<%= path === '/login' ? 'active' : '' %>" href="/login">Login</a>
                </li>
            <% } else { %>
                <li class="main-header__item">
                    <form action="/logout" method="post">
                        <button type="submit">Logout</button>
                    </form>
                </li>
            <% } %>
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
                   <a class="<%= path === '/orders' ? 'active' : '' %> <%= admin && !all ? 'disable' : '' %>" href="/orders">Orders</a>
                </li>
                <li class="mobile-nav__item">
                   <a href="/login">Login</a>
                </li>
                <li class="main-header__item">
                    <form action="/logout" method="post">
                        <button type="submit">Logout</button>
                    </form>
                </li>
            </ul>
</nav>