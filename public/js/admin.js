//we can reach some data from hidden inputs by querySelector and specifying the name of that input. Then we can have the certain data

const deleteProduct = btn => {
  //we can reach parentNode of Button and reach some input that stores name of [] and get some vaue from that input
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  //by that we can point to the closest element that is in this case article
  const productElement = btn.closest("article");

  fetch("/admin/delete-product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
      console.log(err);
    });
};
