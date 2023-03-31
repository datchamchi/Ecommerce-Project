class Cart {
  constructor(oldCart) {
    this.data = oldCart.data || {};
    this.data.total = oldCart.data?.total || 0;
    this.data.items = oldCart.data?.items || [];
  }

  isProductInCart(product) {
    const list = this.data.items;
    return list.findIndex((el) => el.id === product.id);
  }

  insertProduct(product, quantity) {
    const index = this.isProductInCart(product);
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    };
    if (index < 0 && quantity > 0) {
      this.data.items.push(item);
      this.calculateTotals();
    } else {
      const productContain = this.data.items[index];
      productContain.quantity += item.quantity;
      this.calculateTotals();
    }
  }

  calculateTotals() {
    this.data.total = this.data.items.reduce(
      (total, el) => total + el.price * el.quantity,
      0
    );
  }

  saveSession(req) {
    req.session.cart = this;
  }
}
module.exports = Cart;
